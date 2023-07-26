# imports #
# ------- #
import os
from dotenv import load_dotenv
from pathlib import Path
import cloudinary, cloudinary.api

# configure environment variables to use .env file
dotenv_path = Path('.env')
load_dotenv(dotenv_path=dotenv_path)

# base config
class Config():

    SECRET_KEY = os.environ.get("SECRET_KEY")
    SECURITY_PASSWORD_SALT = os.environ.get("SECURITY_PASSWORD_SALT")
    CLOUDINARY_CONFIG = cloudinary.config(cloud_name = os.environ.get('CLOUD_NAME'),
                    api_key = os.environ.get("CLOUDINARY_API_KEY"),
                    api_secret = os.environ.get("CLOUDINARY_API_SECRET"),
                    secure = True)
    SES_REGION_NAME = os.environ.get("SES_REGION_NAME")
    SES_EMAIL_SOURCE = os.environ.get("SES_EMAIL_SOURCE")
    AWS_ACCESS_KEY_ID = os.environ.get("AWS_ACCESS_KEY_ID")
    AWS_SECRET_ACCESS_KEY = os.environ.get("AWS_SECRET_ACCESS_KEY")

    @staticmethod
    def init_app(app):
        pass

# development config
class DevelopmentConfig(Config):

    DEBUG = True
    MONGO_URI = os.environ.get("MONGODB_URI")

# testing config
class TestingConfig(Config):

    MONGO_URI = os.environ.get("MONGODB_URI")

# production config
class ProductionConfig(Config):

    MONGO_URI = os.environ.get("MONGODB_URI")

# environments config
env_config = {
    "development": DevelopmentConfig,
    "testing": TestingConfig,
    "production": ProductionConfig
    }
