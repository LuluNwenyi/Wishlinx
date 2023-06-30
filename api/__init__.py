# imports #
# ------- #
import os
from flask import Flask
from .config import env_config

# app config
app = Flask(__name__)

# app factory
def create_app():
    
    # set app config
    app.config.from_object(env_config)

    # define and register blueprints
    from api.default import default as default_blueprint
    
    app.register_blueprint(default_blueprint) # register default blueprint
    
    return app
