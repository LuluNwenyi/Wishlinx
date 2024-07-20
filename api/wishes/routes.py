# imports #
# ------- # 
import datetime
from flask import Blueprint, jsonify, request
from bson import ObjectId
from api.collections import user_collection, list_collection, wish_collection
from flask_jwt_extended import get_jwt_identity, jwt_required
from api.functions import allowed_file, s3_upload

wish = Blueprint('wish', __name__)

@wish.route('/upload', methods=['POST'])
def upload_image_s3():
    img = request.files['image']
    if img and allowed_file(img.filename):
        #img_path = img.filename.replace(' ', '-')
        s3_url = s3_upload(file=img, 
                  folder='wishes')
        return jsonify({"message": "Image uploaded successfully.",
                        "s3_url": s3_url}), 200

# create lists
@wish.route('/<list_id>/wish', methods=['POST'])
@jwt_required()
def create_wish(list_id):
    # check if user exists
    user_id = get_jwt_identity()
    user = user_collection.find_one({"_id": ObjectId(user_id)})
        
    if user:
        # check if list exists
        user_list = list_collection.find_one({"_id": ObjectId(list_id)})
        
        if user_list:
            try: 
                item = request.json['item']
                description = request.json['description']
                wish_list = user_list['_id']
                link = request.json['link']
                quantity = request.json['quantity']
                amount = request.json['amount']
                currency = request.json['currency']
                
                new_wish = {
                    "user_id": ObjectId(user_id),
                    "item": item,
                    "description": description,
                    "wish_list": wish_list,
                    "link": link,
                    "status": "unclaimed",
                    "quantity": quantity,
                    "amount": amount,
                    "currency": currency,
                    "img": None,
                    "created_at": datetime.datetime.utcnow(),
                    "last_modified": datetime.datetime.utcnow()
                    }
                
                wish_collection.insert_one(new_wish)
                
                list_collection.update_one(
                    {"_id": ObjectId(wish_list)}, {"$addToSet": {"wishes": new_wish}})
                
                return jsonify({"message": "This wish has been created succesfully"}), 201

            except Exception as e:
                return jsonify({"message": str(e)}), 500
        else:
            return jsonify({"message": "This list does not exist."}), 404
    else:
        return jsonify({"message": "This user does not exist."}), 404
    
    
@wish.route('/<wish_id>/upload-wish-image', methods=['POST'])
@jwt_required()
def upload_wish_image(wish_id):
    # check if user exists
    user_id = get_jwt_identity() # retrieve wish id from jwt token
    user = user_collection.find_one({"_id": ObjectId(user_id)})
    
    if user:
        img = request.files['image']
        if img and allowed_file(img.filename):
            # check if wish exists
            wish = wish_collection.find_one({"_id": ObjectId(wish_id)})
            if wish:
                try:
                    image_url = s3_upload(file=img, 
                            folder='wishes')
                    wish_collection.update_one({"_id": ObjectId(wish_id)}, {"$set": {
                                                                                    "image": image_url,
                                                                                    "last_modified": datetime.datetime.utcnow()
                                                                                    }})
                    return jsonify({"message": "Image uploaded successfully.",
                                    "image_url": image_url}), 200
                except Exception as e:
                    return jsonify({"message": str(e)}), 500
            else: 
                return jsonify({"message": "This wish does not exist."}), 404
        else:
            return jsonify({"message": "Please upload a valid image file."}), 500
    else:
        return jsonify({"message": "This user does not exist."}), 404


# get all wishes
@wish.route('/<list_id>/wish', methods=['GET'])
@jwt_required()
def get_wishes(list_id):
    # check if user exists
    user_id = get_jwt_identity()
    user = user_collection.find_one({"_id": ObjectId(user_id)})
    
    if user:
        # check if list exists
        user_list = list_collection.find_one({"_id": ObjectId(list_id), "user_id": ObjectId(user_id)})
        
        if user_list:
            # retrieve all wishes in that list
            all_wishes = wish_collection.find({"wish_list": ObjectId(list_id)})
            wishes = []
        
            for wish in all_wishes:
                wish_data = {}
                wish_data["id"] = str(wish['_id'])
                wish_data["item"] = str(wish['item'])
                wish_data["description"] = str(wish['description'])
                wish_data["link"] = str(wish['link'])
                wish_data["status"] = str(wish['status'])
                wish_data["quantity"] = str(wish['quantity'])
                wish_data["amount"] = str(wish['amount'])
                wish_data["currency"] = str(wish['currency'])
                wish_data["wish_list"] = str(wish['wish_list'])
        
                wishes.append(wish_data)
                
            return wishes, 200
        
        else:
            return jsonify({"message": "This list does not exist or is not owned by this user."}), 404
    else:
        return jsonify({"message": "This user does not exist."}), 404
                

# get a wish
@wish.route('/<list_id>/wish/<wish_id>', methods=['GET'])
@jwt_required()
def get_wish(list_id, wish_id):
    # check if user exists
    user_id = get_jwt_identity()
    user = user_collection.find_one({"_id": ObjectId(user_id)})
    
    if user:
        # check if list exists
        user_list = list_collection.find_one({"_id": ObjectId(list_id), "user_id": ObjectId(user_id)})
        
        if user_list:
            # check if wish exists
            wish = wish_collection.find_one({"_id": ObjectId(wish_id)})
            
            if wish:
                # retrieve the wishes from that list           
                wish_data = {}
                wish_data["id"] = str(wish['_id'])
                wish_data["item"] = str(wish['item'])
                wish_data["description"] = str(wish['description'])
                wish_data["link"] = str(wish['link'])
                wish_data["status"] = str(wish['status'])
                wish_data["quantity"] = str(wish['quantity'])
                wish_data["amount"] = str(wish['amount'])
                wish_data["currency"] = str(wish['currency'])
                wish_data["wish_list"] = str(wish['wish_list'])
                
                return wish_data, 200
            
            else:
                return jsonify({"message": "This wish does not exist."}), 404
            
        else:
            return jsonify({"message": "This list does not exist or is not owned by this user."}), 404
        
    else:
        return jsonify({"message": "This user does not exist."}), 404


# update a wish
@wish.route('/<list_id>/wish/<wish_id>', methods=['PATCH'])
@jwt_required()
def update_wish(list_id, wish_id):
    # check if user exists
    user_id = get_jwt_identity()
    user = user_collection.find_one({"_id": ObjectId(user_id)})
    
    if user:
        # check if list exists
        user_list = list_collection.find_one({"_id": ObjectId(list_id), "user_id": ObjectId(user_id)})
        
        if user_list:
            # check if wish exists
            wish = wish_collection.find_one({"_id": ObjectId(wish_id)})
               
            if wish:
                try:
                    item = request.json['item']
                    description = request.json['description']
                    link = request.json['link']
                    quantity = request.json['quantity']
                    amount = request.json['amount']
                    currency = request.json['currency']
                    
                    wish_collection.update_one({"_id": ObjectId(wish_id)}, {"$set": {
                                                                                "item": item,
                                                                                "description": description,
                                                                                "link": link,
                                                                                "quantity": quantity,
                                                                                "amount": amount,
                                                                                "currency": currency,
                                                                                "last_modified": datetime.datetime.utcnow()
                                                                                }})
                    list_collection.update_one({"_id": ObjectId(list_id), "wishes._id": ObjectId(wish_id)}, {"$set": {
                                                                                                                    "wishes.$.item": item,
                                                                                                                    "wishes.$.description": description,
                                                                                                                    "wishes.$.link": link,
                                                                                                                    "wishes.$.quantity": quantity,
                                                                                                                    "wishes.$.amount": amount,
                                                                                                                    "wishes.$.currency": currency,
                                                                                                                    "wishes.$.last_modified": datetime.datetime.utcnow()
                                                                                                                    }})
                    return jsonify({"message": "This list has been updated successfully."}), 200
                
                except Exception as e:
                    return jsonify({"message": str(e)}), 500
                
            else:
                return jsonify({"message": "This wish does not exist."}), 404
            
        else:
            return jsonify({"message": "This list does not exist or is not owned by this user."}), 404
        
    else:
        return jsonify({"message": "This user does not exist."}), 404


# delete a wish
@wish.route('/<list_id>/wish/<wish_id>', methods=['DELETE'])
@jwt_required()
def delete_wish(list_id, wish_id):
    # check if user exists
    user_id = get_jwt_identity()
    user = user_collection.find_one({"_id": ObjectId(user_id)})
    
    if user:
        # check if list exists
        user_list = list_collection.find_one({"_id": ObjectId(list_id), "user_id": ObjectId(user_id)})
        
        if user_list:
            # check if wish exists
            wish = wish_collection.find_one({"_id": ObjectId(wish_id)})
               
            if wish:
                wish_collection.delete_one({"_id": ObjectId(wish_id)})
                list_collection.update_one({"_id": ObjectId(list_id)}, {"$pull": {"wishes": {"_id": ObjectId(wish_id)}}})
                
                return jsonify({"message": "This wish has been deleted successfully."}), 200
            
            else:
                return jsonify({"message": "This wish does not exist."}), 404
            
        else:
            return jsonify({"message": "This list does not exist or is not owned by this user."}), 404
        
    else:
        return jsonify({"message": "This user does not exist."}), 404    
 

# total wishes
@wish.route('/total-wishes', methods=['GET'])
@jwt_required()
def total_wishes():
    # check if user exists
    user_id = get_jwt_identity()
    user = user_collection.find_one({"_id": ObjectId(user_id)})
    
    if user:
    # calculate total number of wishes
        wish_list = list(wish_collection.find({"user_id": ObjectId(user_id)}))
        wishes = []
        for wish in wish_list:
            wish_data = {}
            wish_data["id"] = str(wish['_id'])
            wishes.append(wish_data)   
        total_wishes = len(wishes)
        
        return jsonify({"message": "This is the total number of wishes.", "total_wishes": total_wishes}), 200
    else:
        return jsonify({"message": "This user does not exist."}), 404
