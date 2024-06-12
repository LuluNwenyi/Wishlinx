# imports #
# ------- #
import os, uuid, random, string, boto3
from flask import jsonify
from itsdangerous import URLSafeTimedSerializer
from api.collections import user_collection


ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'} # allowed file extensions for uploads

# send email function
def send_email(app, recipients, subject, text, sender):
    ses = boto3.client(
        'ses',
        region_name=os.environ.get('SES_REGION_NAME'),
        aws_access_key_id=os.environ.get('AWS_ACCESS_KEY_ID'),
        aws_secret_access_key=os.environ.get('AWS_SECRET_ACCESS_KEY')
    )
    if not sender:
        sender = os.environ.get('SES_EMAIL_SOURCE')

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
    
# check file extension
def allowed_file(filename):
    return '.' in filename and \
        filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# s3 upload function
def s3_upload(file, folder):
    s3 = boto3.client(
        's3',
        region_name=os.environ.get('S3_REGION_NAME'),
         # bucket config
        aws_access_key_id=os.environ.get('AWS_ACCESS_KEY_ID'),
        aws_secret_access_key=os.environ.get('AWS_SECRET_ACCESS_KEY')
    )
    bucket=os.environ.get('S3_BUCKET_NAME')
    file_path = file.filename.replace(" ", "-")
    key = folder + "/" + str(uuid.uuid4()) + "-" + file_path
    s3.upload_fileobj(
        file,
        bucket,
        key
        )
    object_url="https://"+bucket+".s3."+os.environ.get('S3_REGION_NAME')+".amazonaws.com/"+key #create Object URL  Manually
    return object_url
    
# generate tokens for email confirmation
def generate_confirmation_token(email):

    user = user_collection.find_one({"email": email})
    
    if user:
        # generate token
        serializer = URLSafeTimedSerializer(os.environ.get('SECRET_KEY'))
        token = serializer.dumps(email, salt=os.environ.get('SECURITY_PASSWORD_SALT'))
        
        return token
    else:
        return jsonify({"error": "User not found."})

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
