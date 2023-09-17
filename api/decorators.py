# imports #
# ------- #
from flask import jsonify
from flask_jwt_extended import get_jwt_identity
from functools import wraps
from api.collections import user_collection
from bson import ObjectId

# admin decorator
def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        user_id = get_jwt_identity()
        user = user_collection.find_one({'_id' : ObjectId(user_id), 'admin' : True}) # check if user is an admin
        if not user:
            return jsonify({"message": "This user is not an admin!"}), 401
        return f(*args, **kwargs)
    return decorated_function

