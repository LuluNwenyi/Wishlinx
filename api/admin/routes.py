# imports #
# ------- # 
import datetime
from flask import Blueprint, jsonify, request
from api import bcrypt
from bson import ObjectId
from api.decorators import admin_required
from api.collections import admin_collection, user_collection
from flask_jwt_extended import get_jwt_identity, jwt_required
from api.functions import generate_confirmation_token, generate_public_id

admin = Blueprint('admin', __name__)

@admin.route('/create-admin', methods=['POST'])
def create_admin():
    
    # query for user
    existing_user = admin_collection.find_one({"email": request.json['email']})

    if not existing_user:

        try:
            # register the user
            password = bcrypt.generate_password_hash(request.json['password']).decode('utf-8')
            email = request.json['email']
            name = request.json['name']
            username = request.json['username']
            
            # check if username is taken
            existing_user_username = user_collection.find_one({"username": username})
            existing_admin_username = admin_collection.find_one({"username": username})
            
            if existing_admin_username or existing_user_username is not None:
                return jsonify({"message": "This username is already taken."}), 409
            
            else:
                # register the user
                admin_collection.insert_one({
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
    

# get all admins        
@admin.route('/admins', methods=['GET'])
@jwt_required()
@admin_required
def admin_list():
    
    all_admins = admin_collection.find({})
    admin_list = []
    
    for admin in all_admins:
        admin_data = {}
        admin_data["id"] = str(admin["_id"])
        admin_data["name"] = str(admin["name"])
        admin_data["email"] = str(admin["email"])
        
        admin_list.append(admin_data)
        
    return jsonify(admin_list), 200
        

# get an admin
@admin.route('/admin', methods=['GET'])
@jwt_required()
@admin_required
def get_admin():
    
    admin_id = get_jwt_identity() # retrieve admin id from jwt token
    admin = admin_collection.find_one({"_id": ObjectId(admin_id)}) # find admin by id
    
    if not admin:
        return jsonify({"message": "Admin not found"}), 404
    
    admin_data = {}
    admin_data["id"] = str(admin["_id"])
    admin_data["name"] = str(admin["name"])
    admin_data["email"] = str(admin["email"])
    
    return jsonify(admin_data), 200


# update admin details
@admin.route("/settings/profile", methods=["PATCH"])
@jwt_required()
def update_admin():

    admin_id = get_jwt_identity() # retrieve user id from jwt token
    admin_data = admin_collection.find_one({"_id": ObjectId(admin_id)}) # find user by id

    if admin_id:
        try:
            admin_collection.update_one(
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
    admin = admin_collection.find_one({"_id": ObjectId(admin_id)}) # find admin by id
    
    if admin:
        try:
            admin_collection.delete_one({"_id": ObjectId(admin_id)})
            return jsonify({"message": "Admin deleted successfully"}), 200
        
        except Exception as e:
            return jsonify({"message": str(e)}), 500
        
    else:
        return jsonify({"message": "Admin not found"}), 404    
