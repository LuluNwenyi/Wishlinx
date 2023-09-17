# imports #
# ------- # 
import datetime, os
from flask import Blueprint, jsonify, request, current_app
from bson import ObjectId
from api.collections import wish_collection, user_collection, list_collection
from flask_jwt_extended import get_jwt_identity, jwt_required
from api.functions import send_email

claim = Blueprint('claim', __name__)

# create new claim
@claim.route('/<wish_id>/claim', methods=['POST'])
def claim_wish(wish_id):
    # check if wish exists
    wish = wish_collection.find_one({"_id": ObjectId(wish_id)})
    if wish:
        # get wish details
        wish_user_id = wish['user_id']
        wish_owner = user_collection.find_one({"_id": ObjectId(wish_user_id)})
        wish_owner_name = wish_owner['name']
        wish_list = wish['wish_list']
        wishlist = list_collection.find_one({"_id": ObjectId(wish_list)})
        wishlist_title = wishlist['title']
        wish_owner_email = wish_owner['email']
        
        # get claim details
        name = request.json['name']
        email = request.json['email']
        
        new_claim = {
            "id": str(ObjectId()),
            "wish_id": wish_id,
            "name": name,
            "email": email,
            "created_at": datetime.datetime.utcnow()
        }
        
        # send email to the person who claimed the wish
        claim_subject = "You've claimed a wish!"
        claim_body = f"Hi {name}," + \
                f"You've reserved an item on {wish_owner_name}" + "'s wishlist" + \
                f"Do well to fulfill the wish you claim by reaching out to the owner!" + \
                f"Thanks for using Wishlinx!" + \
                f"If you didn't claim a wish on Wishlinx, please ignore this mail."
                            
        
        user_subject = "You've got a new wish claim!"
        user_body = f"Hi {wish_owner_name}," + \
                    f"A new item has been reserved on {wishlist_title} by:" + \
                    f"Name: " + name + \
                    f"Email: " + email + \
                    f"You can view this claim by logging into your account." \
                        
        # send emails to the wish claimer and the wish owner       
        send_email(
                 current_app,
                    recipients=[email],
                    subject=claim_subject,
                    text=claim_body,
                    sender=os.environ.get('SES_EMAIL_SOURCE')
                )
        
        send_email(
                 current_app,
                    recipients=[wish_owner_email],
                    subject=user_subject,
                    text=user_body,
                    sender=os.environ.get('SES_EMAIL_SOURCE')
                )
                
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
        claimed_wishes = wish_collection.find({"user_id":user_id, "status": "claimed"})
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
        claim = wish_collection.find_one({"user_id":user_id, "claim.id": claim_id})
        
        if claim:
            return jsonify({"claim": claim['claim']}), 200
        else:
            return jsonify({"message": "This claim does not exist or does not belong to this user."}), 404
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
