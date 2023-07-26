# imports #
# ------- # 
import datetime
from flask import Blueprint, jsonify, request
from bson import ObjectId
from api.collections import wish_collection, user_collection
from flask_jwt_extended import get_jwt_identity, jwt_required

claim = Blueprint('claim', __name__)

# create new claim
@claim.route('/<wish_id>/claim', methods=['POST'])
def claim_wish(wish_id):
    # check if wish exists
    wish = wish_collection.find_one({"_id": ObjectId(wish_id)})

    if wish:
        name = request.json['name']
        email = request.json['email']
        
        new_claim = {
            "id": str(ObjectId()),
            "wish_id": wish_id,
            "name": name,
            "email": email,
            "created_at": datetime.datetime.utcnow()
        }
        
        wish_collection.update_one({"_id": ObjectId(wish_id)}, {"$set": {
                                                                        "status": "claimed",
                                                                        "claim": new_claim,
                                                                        "last_modified": datetime.datetime.utcnow()
                                                                        }})

        return jsonify({"message": "This wish has been claimed successfully"}), 201
    else:
        return jsonify({"message": "This wish does not exist."}), 404


# get all claims
@claim.route('/claims', methods=['GET'])
@jwt_required()
def get_claims():
    # check if user exists
    user_id = get_jwt_identity()
    user = user_collection.find_one({"_id": ObjectId(user_id)})
    
    if user:
        # check for wishes that have been claimed
        claimed_wishes = wish_collection.find({"status": "claimed"})
        claims = []
        
        for wish in claimed_wishes:
            claim = wish['claim']
            claims.append(claim)
            
        return jsonify({"claims": claims}), 200
    
    else:
        return jsonify({"message": "This user does not exist."}), 404

# get claim by id
@claim.route('/claim/<claim_id>', methods=['GET'])
@jwt_required()
def get_claim(claim_id):
    # check if user exists
    user_id = get_jwt_identity()
    user = user_collection.find_one({"_id": ObjectId(user_id)})
    
    if user:
        # check if claim exists
        claim = wish_collection.find_one({"claim.id": claim_id})
        
        if claim:
            return jsonify({"claim": claim['claim']}), 200
        else:
            return jsonify({"message": "This claim does not exist."}), 404
    else:
        return jsonify({"message": "This user does not exist."}), 404


# total wishes
@claim.route('/total-claims', methods=['GET'])
@jwt_required()
def total_claims():
    # check if user exists
    user_id = get_jwt_identity()
    user = user_collection.find_one({"_id": ObjectId(user_id)})
    
    if user:
    # calculate total number of wishes
        claimed_wishes = list(wish_collection.find({"user_id": user_id, 
                                                   "status": "claimed"}))
        claims = []
        for wish in claimed_wishes:
            claim = wish['claim']
            claims.append(claim)
        total_claims = len(claims)
        
        return jsonify({"message": "This is the total number of claims.", "total_claims": total_claims}), 200  
    else:
        return jsonify({"message": "This user does not exist."}), 404
