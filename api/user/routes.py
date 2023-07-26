# imports #
# ------- # 
import datetime, os
from flask import Blueprint, jsonify, request, url_for, current_app
from api import bcrypt
from bson import ObjectId
from api.decorators import admin_required
from api.collections import user_collection, admin_collection
from flask_jwt_extended import get_jwt_identity, jwt_required
from api.functions import generate_confirmation_token, generate_public_id, generate_avatar, send_email
from flask_cors import cross_origin
import cloudinary.uploader, cloudinary, cloudinary.api

user = Blueprint('user', __name__)

@user.route('/create-user', methods=['POST'])
@cross_origin()
def create_user():
    
    # query for user
    existing_user = user_collection.find_one({"email": request.json['email']})

    if not existing_user:

       # try:
            # register the user
            password = bcrypt.generate_password_hash(request.json['password']).decode('utf-8')
            email = request.json['email']
            name = request.json['name']
            username = request.json['username']
            
            # check if username is taken
            existing_user_username = user_collection.find_one({"username": username})
            existing_admin_username = admin_collection.find_one({"username": username})
            
            if existing_admin_username or existing_user_username:
                return jsonify({"message": "This username is already taken."}), 409
            
            else:
               # user_av = generate_avatar()
               # av_upload_url = cloudinary.uploader.upload(user_av)
                
                # register the user
                user_collection.insert_one({
                                        "name": name,
                                        "email": email,
                                        "username": username,
                                        "password": password,
                                        "public_id": generate_public_id(),
                                        # "profile_pic": {
                                        #                 'image': av_upload_url['secure_url'],
                                        #                 'image_id': av_upload_url['public_id']
                                        #             },
                                        "admin": True,
                                        "confirmed_email": False,
                                        "created_at": datetime.datetime.utcnow(),
                                        "confirmed_at": None,
                                        "last_login": datetime.datetime.utcnow()
                })
                # generate confirmation token and send email
                token = generate_confirmation_token(email=email)
                
                subject = "Confirm your e-mail address"
                confirm_url = url_for("auth.confirm_email", token=token,  _external=True)
                body = f"Hi {name}, Please confirm your email address" + \
                f"by clicking on the link: {confirm_url} " + \
                f"If you didn't ask sign up on Wishlinx, ignore this mail."
                
                send_email(
                    current_app,
                    recipients=[email],
                    subject=subject,
                    text=body,
                    sender=os.environ.get('SES_EMAIL_SOURCE')
                )
                
                print("confirmation sent")
                return jsonify({"message": "This user has been created successfully, and a confirmation email has been sent."}), 201
                        
               # except Exception as e:
                    #return jsonify({"message": str(e)}), 500
        
    else:
        # if user exists
        response = {
            "message" : "This user already exists."
        }
        return jsonify(response), 409
            

# get all users        
@user.route('/users', methods=['GET'])
@jwt_required()
def user_list():
    
    all_users = user_collection.find({})
    user_list = []
    
    for user in all_users:
        user_data = {}
        user_data["id"] = str(user['_id'])
        user_data["public_id"] = str(user['public_id'])
        user_data["name"] = str(user['name'])
        user_data["username"] = str(user['username'])
        user_data["email"] = str(user['email'])
        
        user_list.append(user_data)
        
    return jsonify(user_list), 200
        

# get one user
@user.route('/user', methods=['GET'])
@jwt_required()
def get_user():
    
    user_id = get_jwt_identity() # retrieve user id from jwt token
    user = user_collection.find_one({"_id": ObjectId(user_id)}) # find user by id
    
    if user:
        user_data = {}
        user_data["id"] = str(user['_id'])
        user_data["public_id"] = str(user['public_id'])
        user_data["name"] = str(user['name'])
        user_data["username"] = str(user['username'])
        user_data["email"] = str(user['email'])
        
        return jsonify(user_data), 200
    else:
        return jsonify({"message": "User not found"}), 404


# update user details
@user.route("/settings/profile", methods=["PATCH"])
@jwt_required()
def update_user():

    user_id = get_jwt_identity() # retrieve user id from jwt token
    user_data = user_collection.find_one({"_id": ObjectId(user_id)}) # find user by id

    if user_id:
        try:
            user_collection.update_one(
                {"_id": user_data['_id']},
                {
                    "$set": {
                        "name": request.json['name'],
                        "username": request.json['username'],
                        "email": request.json['email']
                    }
                }
            )
            return jsonify({"message": "User profile updated successfully"}), 200
        
        except Exception as e:
            response = {
                "message": str (e)
            }
            return jsonify(response), 400

    else:
        return jsonify({"message": "User not found"}), 404
    

# delete user details       
@user.route('/user', methods=['DELETE'])
@jwt_required()
@admin_required
def delete_user():

    user_id = get_jwt_identity() # retrieve user id from jwt token
    user = user_collection.find_one({"_id": ObjectId(user_id)}) # find user by id
    
    if user:
        try:
            user_collection.delete_one({"_id": ObjectId(user_id)})
            return jsonify({"message": "User deleted successfully"}), 200
        
        except Exception as e:
            return jsonify({"message": str(e)}), 500
        
    else:
        return jsonify({"message": "User not found"}), 404    
