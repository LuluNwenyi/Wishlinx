# imports #
# ------- #
import os
from flask import Flask
from .config import env_config
from flask_pymongo import PyMongo
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
from flask_cors import CORS

# app config
app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get("SECRET_KEY")
app.config['SECURITY_PASSWORD_SALT'] = os.environ.get("SECURITY_PASSWORD_SALT")
app.config['MONGO_URI'] = os.environ.get('MONGODB_URI')
app.config['SES_REGION_NAME'] = os.environ.get("SES_REGION_NAME")
app.config['SES_EMAIL_SOURCE'] = os.environ.get("SES_EMAIL_SOURCE")
app.config['AWS_ACCESS_KEY_ID'] = os.environ.get("AWS_ACCESS_KEY_ID")
app.config['AWS_SECRET_ACCESS_KEY'] = os.environ.get("AWS_SECRET_ACCESS_KEY")

mongo = PyMongo(app)
jwt = JWTManager(app)
bcrypt = Bcrypt(app)
cors = CORS(app)

# database config
db = mongo.db

# app factory
def create_app():
    
    # set app config
    app.config.from_object(env_config)

    jwt.init_app(app)
    bcrypt.init_app(app)
    mongo.init_app(app)
    cors.init_app(app)

    # define and register blueprints
    from api.default import default as default_blueprint
    from api.auth.routes import auth as auth_blueprint
    from api.user.routes import user as user_blueprint
    from api.admin.routes import admin as admin_blueprint
    from api.lists.routes import lists as list_blueprint
    from api.wishes.routes import wish as wish_blueprint
    from api.claims.routes import claim as claim_blueprint
    from api.profile.routes import profile as profile_blueprint
    
    app.register_blueprint(default_blueprint) # register default blueprint
    app.register_blueprint(auth_blueprint) # register auth blueprint
    app.register_blueprint(user_blueprint) # register user blueprint
    app.register_blueprint(admin_blueprint) # register admin blueprint
    app.register_blueprint(list_blueprint) # register lists blueprint
    app.register_blueprint(wish_blueprint) # register wishes blueprint
    app.register_blueprint(claim_blueprint) # register claims blueprint
    app.register_blueprint(profile_blueprint) # register profile blueprint
    
    return app
