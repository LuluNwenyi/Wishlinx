# imports #
# ------- # 
from flask import Blueprint, jsonify
from bson import ObjectId
from api.collections import user_collection, wish_collection, list_collection

profile = Blueprint('profile', __name__)

# user profile
@profile.route('/<username>', methods=['GET'])
def user_public_profile(username):
        
        # query for user
        user = user_collection.find_one({"username": username})
        
        if user:
            user_id = str(user['_id'])  # get the user id for filtering
            # calculate total number of claimed wishes
            claimed_wishes = list(wish_collection.find({"user_id": ObjectId(user_id), 
                                                   "status": "claimed"}))
            claims = []
            for wish in claimed_wishes:
                claim = wish['claim']
                claims.append(claim)
                
            total_claims = len(claims)
            
            # calculate total number of wishes
            wish_list = list(wish_collection.find({"user_id": ObjectId(user_id)}))
            wishes = []
            for wish in wish_list:
                wish_data = {}
                wish_data["id"] = str(wish['_id'])
                wishes.append(wish_data)
                
            total_wishes = len(wishes)
            
            user_lists = list_collection.find({"user_id": ObjectId(user_id)})
        
            wishlists = []
            for each_list in user_lists:
                list_data = {}
                list_data["id"] = str(each_list['_id'])
                list_data["user_id"] = str(each_list['user_id'])
                list_data["title"] = str(each_list['title'])
                list_data["description"] = str(each_list['description'])
                list_data["category"] = str(each_list['category'])
                list_data["expiry_date"] = str(each_list['expiry_date'])
                list_data["display_hex_code"] = str(each_list['display_hex_code'])
                list_data["wishes"] = str(each_list['wishes'])

                wishlists.append(list_data)
            
            response = {
                "name": user['name'],
                "username": user['username'],
                "public_id": user['public_id'],
                "lists": wishlists,
                "total_claims": total_claims,
                "total_wishes": total_wishes
            }
            return jsonify(response), 200
        
        else:
            return jsonify({"message": "This user does not exist."}), 404
