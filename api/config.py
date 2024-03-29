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
