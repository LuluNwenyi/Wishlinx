# imports #
# ------- #
import os
from flask import Flask
from pymongo import MongoClient
from pymongo.server_api import ServerApi
from .config import env_config
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
from flask_cors import CORS

# app config
app = Flask(__name__)

uri = os.environ.get("MONGO_URI")
client = MongoClient(uri, server_api=ServerApi('1'), tls=True)

app.config["JWT_SECRET_KEY"] = os.environ.get("SECRET_KEY")

#mongo = pymongo(app)
jwt = JWTManager(app)
bcrypt = Bcrypt(app)
cors = CORS(app)

# database config
db = client.db

# app factory
def create_app():
    
    # set app config
    app.config.from_object(env_config)
   
    #mongo.init_app(app)
    jwt.init_app(app)
    bcrypt.init_app(app)
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
