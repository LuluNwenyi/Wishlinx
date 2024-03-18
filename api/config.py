# imports #
# ------- #
import os, boto3
from dotenv import load_dotenv
from pathlib import Path
from ssm_parameter_store import EC2ParameterStore

# configure environment variables to use .env file
dotenv_path = Path('.env')
load_dotenv(dotenv_path=dotenv_path)

# configure wrapper for store.get_parametereters on aws
""" client = boto3.client('ssm')
store.get_parameter = client.get_store.get_parametereter(
    Name='string',
    WithDecryption=True
)
 """
 
store = EC2ParameterStore(
    aws_access_key_id=os.environ.get("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.environ.get("AWS_SECRET_ACCESS_KEY"),
    region_name='us-east-1'
)

# store.get_parameter = store.get_store.get_parametereter()

 
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
    SECRET_KEY = store.get_parameter("WISHLINX_SECRET_KEY")
    SECURITY_PASSWORD_SALT = store.get_parameter("WISHLINX_SECURITY_PASSWORD_SALT")
    SES_REGION_NAME = store.get_parameter("WISHLINX_SES_REGION_NAME")
    SES_EMAIL_SOURCE = store.get_parameter("WISHLINX_SES_EMAIL_SOURCE")
    S3_BUCKET_NAME = store.get_parameter("WISHLINX_S3_BUCKET_NAME")
    AWS_ACCESS_KEY_ID = store.get_parameter("WISHLINX_AWS_ACCESS_KEY_ID")
    AWS_SECRET_ACCESS_KEY = store.get_parameter("WISHLINX_AWS_SECRET_ACCESS_KEY")
    MONGO_URI = store.get_parameter("WISHLINX_MONGODB_URI")

# environments config
env_config = {
    "development": DevelopmentConfig,
    "testing": TestingConfig,
    "production": ProductionConfig
    }
