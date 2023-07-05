# imports #
# ------- #
import os
from flask import Flask
from .config import env_config
from flask_mailgun import Mailgun
from flask_pymongo import PyMongo
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt

# app config
app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY')
app.config['SECURITY_PASSWORD_SALT'] = os.environ.get('SECURITY_PASSWORD_SALT')
app.config['MAILGUN_DOMAIN'] = os.environ.get('MAILGUN_DOMAIN')
app.config['MAILGUN_API_KEY'] = os.environ.get('MAILGUN_API_KEY')
app.config['MAILGUN_URL'] = os.environ.get('MAILGUN_URL')
app.config['MAILGUN_FROM'] = os.environ.get('MAILGUN_FROM')
app.config['MONGO_URI'] = os.environ.get('MONGODB_URI')

mailgun = Mailgun(app)
mongo = PyMongo(app)
jwt = JWTManager(app)
bcrypt = Bcrypt(app)

# database config
db = mongo.db

# app factory
def create_app():
    
    # set app config
    app.config.from_object(env_config)
    
    mailgun.init_app(app)
    jwt.init_app(app)
    bcrypt.init_app(app)
    mongo.init_app(app)

    # define and register blueprints
    from api.default import default as default_blueprint
    from api.auth.routes import auth as auth_blueprint
    from api.user.routes import user as user_blueprint
    from api.admin.routes import admin as admin_blueprint
    
    app.register_blueprint(default_blueprint) # register default blueprint
    app.register_blueprint(auth_blueprint) # register auth blueprint
    app.register_blueprint(user_blueprint) # register user blueprint
    app.register_blueprint(admin_blueprint) # register admin blueprint
    
    return app
