# imports #
# ------- # 
import datetime
from flask import Blueprint, jsonify, request
from bson import ObjectId
from api.collections import user_collection, list_collection
from flask_jwt_extended import get_jwt_identity, jwt_required
from api.functions import generate_random_color

lists = Blueprint('lists', __name__)

# create lists
@lists.route('/list', methods=['POST'])
@jwt_required()
def create_list():
    # check if user exists
    user_id = get_jwt_identity()
    user = user_collection.find_one({"_id": ObjectId(user_id)})
    
    if user:
        try: 
            title = request.json['title']
            description = request.json['description']
            category = request.json['category']
            
            list_collection.insert_one({
                                        "user_id": str(user['_id']),
                                        "title": title,
                                        "description": description,
                                        "category": category,
                                        "expiry_date": None,
                                        "created_at": datetime.datetime.utcnow(),
                                        "last_modified": datetime.datetime.utcnow(),
                                        "wishes": [],
                                        "display_hex_code": generate_random_color()
                })
            return jsonify({"message": "This list has been created succesfully"}), 201

        except Exception as e:
            return jsonify({"message": str(e)}), 500
    else:
        return jsonify({"message": "This user does not exist."}), 404
    
    
# get lists
@lists.route('/lists', methods=['GET'])
@jwt_required()
def get_lists():
    # check if user exists
    user_id = get_jwt_identity()
    user = user_collection.find_one({"_id": ObjectId(user_id)})
    
    if user:
        # check for lists that belong to the user
        user_list = list_collection.find({"user_id": user_id})
        if user_list:
            # return list data
            all_lists = list_collection.find({})
            lists = []
                
            for user_list in all_lists:
                list_data = {}
                list_data["id"] = str(user_list['_id'])
                list_data["user_id"] = str(user_list['user_id'])
                list_data["title"] = str(user_list['title'])
                list_data["description"] = str(user_list['description'])
                list_data["category"] = str(user_list['category'])
                list_data["expiry_date"] = str(user_list['expiry_date'])
                list_data["display_hex_code"] = str(user_list['display_hex_code'])
                list_data["wishes"] = user_list['wishes']
                    
                lists.append(list_data) 
                return jsonify(lists), 200
        else:
            return jsonify({"message": "You do not own any lists."}), 404
    
    else:
        return jsonify({"message": "This user does not exist."}), 404


# get a list
@lists.route('/list/<id>', methods=['GET'])
@jwt_required()
def get_list(id):
    # check if user exists
    user_id = get_jwt_identity()
    user = user_collection.find_one({"_id": ObjectId(user_id)})
    
    if user:
        # check if list exists and that it belongs to the user
        user_list = list_collection.find_one({"_id": ObjectId(id), "user_id": user_id})
        # return list data
        if user_list:
            list_data = {}
            list_data["id"] = str(user_list['_id'])
            list_data["user_id"] = str(user_list['user_id'])
            list_data["title"] = str(user_list['title'])
            list_data["description"] = str(user_list['description'])
            list_data["category"] = str(user_list['category'])
            list_data["expiry_date"] = str(user_list['expiry_date'])
            list_data["display_hex_code"] = str(user_list['display_hex_code'])
            list_data["wishes"] = user_list['wishes']
            
            return jsonify(list_data), 200
        else:
            return jsonify({"message": "You do not own this list."}), 401
    else:
        return jsonify({"message": "This user does not exist."}), 404



# update a list
@lists.route('/list/<id>', methods=['PATCH'])
@jwt_required()
def update_list(id):
    # check if user exists
    user_id = get_jwt_identity()
    user = user_collection.find_one({"_id": ObjectId(user_id)})

    if user:
        # check if list exists and that it belongs to the user
        user_list = list_collection.find_one({"_id": ObjectId(id), "user_id": user_id})
        
        if user_list:
            try:
                title = request.json['title']
                description = request.json['description']
                category = request.json['category']
                    
                list_collection.update_one({"_id": ObjectId(id)}, {"$set": {
                                                                            "title": title,
                                                                            "description": description,
                                                                            "category": category,
                                                                            "last_modified": datetime.datetime.utcnow()
                                                                            }})
                return jsonify({"message": "This list has been updated successfully."}), 200
            except Exception as e:
                    return jsonify({"message": str(e)}), 500
        else:
            return jsonify({"message": "You do not own this list."}), 401
    else:
        return jsonify({"message": "This user does not exist."}), 404


# delete a list
@lists.route('/list/<id>', methods=['DELETE'])
@jwt_required()
def delete_list(id):
    # check if user exists
    user_id = get_jwt_identity()
    user = user_collection.find_one({"_id": ObjectId(user_id)})

    if user:
        # check if list exists and that it belongs to the user
        user_list = list_collection.find_one({"_id": ObjectId(id), "user_id": user_id})
                
        if user_list:
            length_check = list_collection.find_one({"wishes": {"$size": 0}})
            
            if length_check:
                list_collection.delete_one({"_id": ObjectId(id)})
                return jsonify({"message": "This list has been deleted successfully."}), 200
            else:
                return jsonify({"message": "This list cannot be deleted because it contains wishes."}), 401
        else:
            return jsonify({"message": "This list does not exist or is not your own."}), 401 
    else:
        return jsonify({"message": "This user does not exist."}), 404


# update a list's expiry date
@lists.route('/list/<id>/expiry', methods=['PATCH'])
@jwt_required()
def update_list_expiry_date(id):
    # check if user exists
    user_id = get_jwt_identity()
    user = user_collection.find_one({"_id": ObjectId(user_id)})

    if user:
        # check if list exists and that it belongs to the user
        user_list = list_collection.find_one({"_id": ObjectId(id), "user_id": user_id})
        
        if user_list:
            try:
                expiry_date = request.json['expiry_date']
                list_collection.update_one({"_id": ObjectId(id)}, {"$set": {
                                                                            "expiry_date": expiry_date,
                                                                            "last_modified": datetime.datetime.utcnow()
                                                                            }})
                return jsonify({"message": "This list's expiry date has been updated successfully."}), 200
                
            except Exception as e:
                return jsonify({"message": str(e)}), 500
        else:
            return jsonify({"message": "You do not own this list."}), 401
    else:
        return jsonify({"message": "This user does not exist."}), 404
