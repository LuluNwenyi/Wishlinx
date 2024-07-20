# imports #
# ------- # 
import datetime, os
from flask import Blueprint, jsonify, request, url_for, current_app
from api import bcrypt
from bson import ObjectId
from datetime import timedelta
from api.decorators import admin_required
from api.collections import user_collection, list_collection,wish_collection
from flask_jwt_extended import get_jwt_identity, jwt_required, create_access_token, create_refresh_token
from api.functions import generate_confirmation_token, generate_public_id, allowed_file, send_email, s3_upload
from flask_cors import cross_origin

user = Blueprint('user', __name__)

@user.route('/create-user', methods=['POST'])
@cross_origin()
def create_user():
    
    # query for user
    existing_user = user_collection.find_one({"email": request.json['email']})

    if not existing_user:

        try:
            # register the user
            password = bcrypt.generate_password_hash(request.json['password']).decode('utf-8')
            email = request.json['email']
            name = request.json['name']
            username = request.json['username']
            
            # check if username is taken
            existing_user_username = user_collection.find_one({"username": username})
            
            if existing_user_username:
                return jsonify({"message": "This username is already taken."}), 409
            
            else:
                # generate confirmation token
                token = generate_confirmation_token(email=email)
                
                subject = "Confirm your e-mail address"
                confirm_url = url_for("auth.confirm_email", token=token,  _external=True)
                body = f"Hi {name}," + \
                f"Please confirm your email address by clicking on the link: {confirm_url} " + \
                f"If you didn't ask sign up on Wishlinx, ignore this mail."
                
                try: 
                    email_sender=send_email(
                        current_app,
                        recipients=[email],
                        subject=subject,
                        text=body,
                        sender=os.environ.get('SES_EMAIL_SOURCE')
                    )
                except Exception as e:
                    return jsonify({"message": "Failed to send confirmation email. User data not saved."}), 500
                
                print(email_sender)
                if email_sender['ResponseMetadata']['HTTPStatusCode']==200:           
                    # save user data after email is sent successfully
                    user = user_collection.insert_one({
                                            "name": name,
                                            "email": email,
                                            "username": username,
                                            "password": password,
                                            "public_id": generate_public_id(),
                                            "admin": False,
                                            "confirmed_email": False,
                                            "created_at": datetime.datetime.utcnow(),
                                            "confirmed_at": None,
                                            "last_login": datetime.datetime.utcnow()
                    })
                    
                    user_id = str(user.inserted_id)
                    
                    # generate login and refresh tokens
                    login_token = create_access_token(identity=user_id, fresh=True, expires_delta=timedelta(days=7))
                    refresh_token = create_refresh_token(identity=user_id, expires_delta=timedelta(days=7))
                    
                    return jsonify({
                        "message": "This user has been created successfully, and a confirmation email has been sent.",
                        "login_token": login_token,
                        "refresh_token": refresh_token
                    }), 201
                else:
                    return jsonify({"message": "Confirmation email was not sent."})
                        
        except Exception as e:
            return jsonify({"message": str(e)}), 500
        
    else:
        # if user exists
        response = {
            "message" : "This user already exists."
        }
        return jsonify(response), 409


@user.route('/upload-profile-image', methods=['POST'])
@jwt_required()
def upload_profile_image():
    # check if user exists
    user_id = get_jwt_identity() # retrieve wish id from jwt token
    user = user_collection.find_one({"_id": ObjectId(user_id)})
    
    if user:
        img = request.files['image']
        if img and allowed_file(img.filename):
            try:
                image_url = s3_upload(file=img, 
                        folder='profiles')
                user_collection.update_one({"_id": ObjectId(user_id)}, {"$set": {
                                                                                "image": image_url,
                                                                                "last_modified": datetime.datetime.utcnow()
                                                                                }})
                return jsonify({"message": "Image uploaded successfully.",
                                "image_url": image_url}), 200
            except Exception as e:
                return jsonify({"message": str(e)}), 500
        else:
            return jsonify({"message": "Please upload a valid image file."}), 500
    else:
        return jsonify({"message": "This user does not exist."}), 404
      

# get all users        
@user.route('/users', methods=['GET'])
@jwt_required()
@admin_required
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
        user_data["image"] = str(user['image'])
        
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
        #user_data["image"] = str(user['image'])
                
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
def delete_user():

    user_id = get_jwt_identity() # retrieve user id from jwt token
    user = user_collection.find_one({"_id": ObjectId(user_id)}) # find user by id
        
    if not user:
        return jsonify({"message": "User not found"}), 404
    
    else:
        # Delete user
        user_collection.delete_one({"_id": ObjectId(user_id)})
        
        # Delete all lists associated with the user
        list_collection.delete_many({"user_id": ObjectId(user_id)})
        
        # Delete all wishes associated with the user
        wish_collection.delete_many({"user_id": ObjectId(user_id)})
        
        return jsonify({"message": "User and all associated lists and wishes deleted successfully"}), 200   
