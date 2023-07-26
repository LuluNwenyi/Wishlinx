# imports #
# ------- #
import os, requests, uuid, random, string, boto3, logging
from flask import jsonify, url_for
from itsdangerous import URLSafeTimedSerializer
from api.collections import user_collection, admin_collection
from dicebear import DAvatar, DStyle, DOptions, DColor

# send email function
def send_email(app, recipients, subject, text, sender):
    ses = boto3.client(
        'ses',
        region_name=app.config['SES_REGION_NAME'],
        aws_access_key_id=app.config['AWS_ACCESS_KEY_ID'],
        aws_secret_access_key=app.config['AWS_SECRET_ACCESS_KEY']
    )
    if not sender:
        sender = app.config['SES_EMAIL_SOURCE']

    ses.send_email(
        Source=sender,
        Destination={'ToAddresses': recipients},
        Message={
            'Subject': {'Data': subject},
            'Body': {
                'Text': {'Data': text}
                #'Html': {'Data': html}
            }
        }
    )

# generate tokens for email confirmation
def generate_confirmation_token(email):

    user = user_collection.find_one({"email": email})
    
    if not user:
        user = admin_collection.find_one({"email": email})
    else:
        pass

    # generate token
    serializer = URLSafeTimedSerializer(os.environ.get('SECRET_KEY'))
    token = serializer.dumps(email, salt=os.environ.get('SECURITY_PASSWORD_SALT'))
    
    return token

# generate unique id for users
def generate_public_id(length=8):
    
    uid = uuid.uuid4() # generate a UUID based on the host ID and current time

    uid_str = str(uid).replace('-', '').upper() # remove hyphens and convert to uppercase to shorten the ID
    random_chars = ''.join(random.choices(string.ascii_letters + string.digits, k=length)) # generate a random alphanumeric string of the desired length
    publc_id = uid_str[:length] + random_chars # combine the UUID and the random string to create the short unique ID

    return publc_id

# generate random color for list display
def generate_random_color():

    color = random.randrange(0, 2**24) # generating a random number in between 0 and 2^24

    # Converting that number from base-10(decimal) to base-16 (hexadecimal)
    hex_color = hex(color)

    return hex_color[2:] # removing the 0x from the hexadecimal string

# generate avatar from dicebear
def generate_avatar():
    
    # settings for the avatar
    options = DOptions(
    backgroundColor=DColor("transparent")
    )
    # generate avatar 
    avatar = DAvatar(
    style=DStyle.fun_emoji,
    options=options
    )
    
    return avatar.url_svg
    
