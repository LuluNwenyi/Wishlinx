# imports #
# ------- #
import os
from dotenv import load_dotenv
from pathlib import Path

# configure environment variables to use .env file
dotenv_path = Path('.env')
load_dotenv(dotenv_path=dotenv_path)
 
# base config
class Config():

    @staticmethod
    def init_app(app):
        pass

# development config
class DevelopmentConfig(Config):

    FLASK_DEBUG = True
    SECRET_KEY = os.environ.get("SECRET_KEY")
    SECURITY_PASSWORD_SALT = os.environ.get("SECURITY_PASSWORD_SALT")
    SES_REGION_NAME = os.environ.get("SES_REGION_NAME")
    SES_EMAIL_SOURCE = os.environ.get("SES_EMAIL_SOURCE")
    AWS_ACCESS_KEY_ID = os.environ.get("AWS_ACCESS_KEY_ID")
    AWS_SECRET_ACCESS_KEY = os.environ.get("AWS_SECRET_ACCESS_KEY")
    MONGO_URI = os.environ.get('MONGO_URI')

# testing config
class TestingConfig(Config):

    FLASK_DEBUG = True

# production config
class ProductionConfig(Config):

    FLASK_APP = "app.py"
    FLASK_ENV = "production"
    FLASK_DEBUG = False
    SECRET_KEY = os.environ.get("SECRET_KEY")
    SECURITY_PASSWORD_SALT = os.environ.get("SECURITY_PASSWORD_SALT")
    SES_REGION_NAME = os.environ.get("SES_REGION_NAME")
    SES_EMAIL_SOURCE = os.environ.get("SES_EMAIL_SOURCE")
    S3_BUCKET_NAME = os.environ.get("S3_BUCKET_NAME")
    AWS_ACCESS_KEY_ID = os.environ.get("AWS_ACCESS_KEY_ID")
    AWS_SECRET_ACCESS_KEY = os.environ.get("AWS_SECRET_ACCESS_KEY")
    MONGO_URI = os.environ.get('MONGO_URI')

# environments config
env_config = {
    "development": DevelopmentConfig,
    "testing": TestingConfig,
    "production": ProductionConfig
    }
