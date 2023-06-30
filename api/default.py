# imports #
# ------- #
from flask import Blueprint, jsonify

default = Blueprint('default', __name__) # create default blueprint

# home page
@default.route('/')
def index():

    return jsonify({"message":"Welcome to the Wishlinx APi"})
