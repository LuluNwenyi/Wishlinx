# imports #
# ------- #
from flask import jsonify
from flask_jwt_extended import get_jwt_identity
from functools import wraps
from api.collections import admin_collection
from bson import ObjectId

# admin decorator
def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        user_id = get_jwt_identity()
        user = admin_collection.find({'_id' : ObjectId(user_id), 'admin' : True})
        if not user:
            return jsonify({"message": "This user is not an admin!"}), 401
        return f(*args, **kwargs)
    return decorated_function
