# imports #
# ------- # 
import datetime
from flask import Blueprint, jsonify, request
from api import bcrypt
from bson import ObjectId
from api.decorators import admin_required
from api.collections import user_collection
from flask_jwt_extended import get_jwt_identity, jwt_required
from api.functions import generate_confirmation_token, generate_public_id, allowed_file, send_email, s3_upload

admin = Blueprint('admin', __name__)

@admin.route('/create-admin', methods=['POST'])
def create_admin():
    
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
            existing_admin_username = user_collection.find_one({"username": username})
            
            if existing_admin_username or existing_user_username is not None:
                return jsonify({"message": "This username is already taken."}), 409
            
            else:
                # register the user
                user_collection.insert_one({
                                        "name": name,
                                        "email": email,
                                        "username": username,
                                        "password": password,
                                        "public_id": generate_public_id(),
                                        "admin": True,
                                        "confirmed_email": False,
                                        "created_at": datetime.datetime.utcnow(),
                                        "confirmed_at": None,
                                        "last_login": datetime.datetime.utcnow()
                })
                
                generate_confirmation_token(email=email)
                return jsonify({"message": "This admin has been created successfully, and a confirmation email has been sent."}), 201
            
        except Exception as e:
            return jsonify({"message": str(e)}), 500
        
    else:
        # if user exists
        response = {
            "message" : "This user already exists."
        }
        return jsonify(response), 409

@admin.route('/admin/upload-profile-image', methods=['POST'])
@jwt_required()
def upload_profile_image():
    # check if user exists
    admin_id = get_jwt_identity() # retrieve wish id from jwt token
    admin = user_collection.find_one({"_id": ObjectId(admin_id)})
    
    if admin:
        img = request.files['image']
        if img and allowed_file(img.filename):
            try:
                image_url = s3_upload(file=img, 
                        folder='profiles')
                user_collection.update_one({"_id": ObjectId(admin_id)}, {"$set": {
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

# get all admins        
@admin.route('/admins', methods=['GET'])
@jwt_required()
@admin_required
def admin_list():
    
    all_admins = user_collection.find({"admin": True})
    admin_list = []
    
    for admin in all_admins:
        admin_data = {}
        admin_data["id"] = str(admin["_id"])
        admin_data["name"] = str(admin["name"])
        admin_data["email"] = str(admin["email"])
        admin_data["username"] = str(admin["username"])
        admin_data["image"] = str(admin["image"])
        
        admin_list.append(admin_data)
        
    return jsonify(admin_list), 200
        

# get an admin
@admin.route('/admin', methods=['GET'])
@jwt_required()
@admin_required
def get_admin():
    
    admin_id = get_jwt_identity() # retrieve admin id from jwt token
    admin = user_collection.find_one({"_id": ObjectId(admin_id)}) # find admin by id
    
    if not admin:
        return jsonify({"message": "Admin not found"}), 404
    
    admin_data = {}
    admin_data["id"] = str(admin["_id"])
    admin_data["name"] = str(admin["name"])
    admin_data["email"] = str(admin["email"])
    admin_data["username"] = str(admin["username"])
    admin_data["image"] = str(admin["image"])
    
    return jsonify(admin_data), 200


# update admin details
@admin.route("/admin/settings/profile", methods=["PATCH"])
@jwt_required()
@admin_required
def update_admin():

    admin_id = get_jwt_identity() # retrieve user id from jwt token
    admin_data = user_collection.find_one({"_id": ObjectId(admin_id)}) # find user by id

    if admin_data:
        try:
            user_collection.update_one(
                {"_id": admin_data['_id']},
                {
                    "$set": {
                        "name": request.json['name'],
                        "username": request.json['username'],
                        "email": request.json['email']
                    }
                }
            )
            return jsonify({"message": "Admin profile updated successfully"}), 200
        
        except Exception as e:
            response = {
                "message": str (e)
            }
            return jsonify(response), 400

    else:
        response = {
            "message" : "This admin does not exist."
        }
        return jsonify(response), 404


# delete admin details       
@admin.route('/admin', methods=['DELETE'])
@jwt_required()
@admin_required
def delete_admin():
    
    admin_id = get_jwt_identity() # retrieve admin id from jwt token
    admin = user_collection.find_one({"_id": ObjectId(admin_id)}) # find admin by id
    
    if admin:
        try:
            user_collection.delete_one({"_id": ObjectId(admin_id)})
            return jsonify({"message": "Admin deleted successfully"}), 200
        
        except Exception as e:
            return jsonify({"message": str(e)}), 500
        
    else:
        return jsonify({"message": "Admin not found"}), 404    
