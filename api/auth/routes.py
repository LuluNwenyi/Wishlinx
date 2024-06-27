# imports #
# ------- #
import datetime, os
from datetime import timedelta
from flask import Blueprint, abort, jsonify, request, current_app, url_for
from itsdangerous import URLSafeTimedSerializer
from api import db, bcrypt, jwt, app
from api.functions import send_email
from api.collections import user_collection
from flask_jwt_extended import create_access_token, jwt_required, get_jwt, create_refresh_token, get_jwt_identity

auth = Blueprint('auth', __name__)

# user login
@auth.route("/login", methods=["POST"])
def login_user():

    # query if the user exists
    existing_user = user_collection.find_one({"email": request.json['email']})

    if existing_user:
        # check if password is correct, create tokens, update log and return response
        if existing_user and bcrypt.check_password_hash(existing_user['password'], request.json['password']):

            user_id = str(existing_user['_id'])

            token = create_access_token(identity=user_id, fresh=True, expires_delta=timedelta(minutes=30))
            refresh_token = create_refresh_token(identity=user_id, expires_delta=timedelta(hours=1))
            login_time = datetime.datetime.now()
            db.users.update_one({"_id": existing_user['_id']}, {"$set": {"last_login": login_time}})

            return jsonify({"token": token,
                            "refresh_token": refresh_token}), 200

        else:
            response = {
                "message": "Incorrect password"
            }
            return jsonify(response), 401

    else:
        # if user doesn't exist
        response = {
            'message' : 'This user does not exist.'
        }
        return jsonify(response), 404


# refresh token
@auth.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():

    user_id = get_jwt_identity()
    new_token = create_access_token(identity=user_id, fresh=False)
    return jsonify({"token": new_token}), 200


# logout user
@auth.route("/logout", methods=["DELETE"])
@jwt_required()
def logout_user():

    @jwt.token_in_blocklist_loader
    def check_if_token_is_revoked(jwt_header, jwt_payload):
        jti = jwt_payload['jti']
        token = db.tokens.find_one({"jti": jti})
        return token is not None

    jti = get_jwt()['jti']
    now = datetime.datetime.utcnow()
    db.tokens.insert_one({
        "jti": jti,
        "created_at": now
    })

    response = {
        "message": "User logged out successfully"
    }
    return jsonify(response), 200


# test authentication
@auth.route("/test", methods=["GET"])
@jwt_required()
def test_protection():
    
    response = {
        "message": "You are authorized"
    }
    return jsonify(response), 200

# confirm email
@auth.route("/confirm_email/<token>", methods=["GET", "PATCH"])
def confirm_email(token):

    ts = URLSafeTimedSerializer(os.environ.get('SECRET_KEY'))
    email = ts.loads(token, salt=os.environ.get('SECURITY_PASSWORD_SALT'), max_age=3600)

    user = user_collection.find_one({"email": email})
    if user:
        user_collection.update_many({"_id": user['_id']}, {"$set": {"confirmed_email": True, "confirmed_at": datetime.datetime.utcnow()}})
        response = {
            "message": "Email confirmed"
        }
        return jsonify(response), 200

    else:
        response = {
            'message' : 'This user does not exist.'
        }
        return jsonify(response), 404


# forgot password
@auth.route('/forgot-password', methods=['POST'])
def forgot_password():
    
    email = request.json['email']
    
    # check if user with email exists
    user = user_collection.find_one({"email": email})
    if user:
        user_name = str(user['name'])

        subject = "Reset Your Password"
        ts = URLSafeTimedSerializer(os.environ.get("SECRET_KEY"))
        token = ts.dumps(email, salt=os.environ.get("SECURITY_PASSWORD_SALT"))
        recovery_url = url_for("auth.reset_password", token=token,  _external=True)
        body = f"Hi {user_name}," + \
                f"Reset your password by clicking on the link: {recovery_url} " + \
                f"If you didn't ask to reset your password, ignore this mail."
        
        send_email(
                    current_app,
                    recipients=[email],
                    subject=subject,
                    text=body,
                    sender=os.environ.get('SES_EMAIL_SOURCE')
                )
        
        return jsonify({ "msg": "succesfully sent the reset mail to your email"}), 200
    
    else:
        return jsonify({"message": "This user does not exist."}), 404


# reset password
@auth.route('/reset/<token>', methods=['GET', 'PATCH'])
def reset_password(token):

    ts = URLSafeTimedSerializer(current_app.config["SECRET_KEY"])
    new_password = request.json['password']

    try:
        email = ts.loads(token, salt=current_app.config["SECURITY_PASSWORD_SALT"], max_age=3600)
    except:
        abort(404)

    if email is False:
        return jsonify({"message": "Invalid token or token expired"}), 401
    
    user = user_collection.find_one({"email": email})   

    if not user:
        return jsonify({"message": "User not found"}), 404  

    if user:
        new_password_hash = bcrypt.generate_password_hash(new_password)
        user_collection.update_one({"email": email}, {"$set": {"password": new_password_hash}})

        return jsonify({'message': 'Your password has been reset!'}), 200

    else:
        return {"message": "An error occured"},   400
