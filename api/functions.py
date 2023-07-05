# imports #
# ------- #
import os, requests, uuid, random, string
from flask import jsonify, current_app, url_for
from itsdangerous import URLSafeTimedSerializer
from api.collections import user_collection, admin_collection

url = os.environ.get("MAILGUN_URL")

# send email function   
def send_email(to_email, subject, body):
    requests.post(
        url,
        auth=("api", os.environ.get("MAILGUN_API_KEY")),
        data={"from": os.environ.get("MAILGUN_FROM"),
              "to": to_email,
              "subject": subject
              }
    )

# generate tokens for email confirmation
def generate_confirmation_token(email):

    user = user_collection.find_one({"email": email})
    
    if not user:
        user = admin_collection.find_one({"email": email})

    # generate token
    serializer = URLSafeTimedSerializer(current_app.config['SECRET_KEY'])
    token = serializer.dumps(email, salt=current_app.config['SECURITY_PASSWORD_SALT'])

    # send email
    subject = "Confirm Your Email Address"
    confirm_url = url_for("auth.confirm_email", token=token,  _external=True)

    text = f"Hi {user['name']}, Please confirm your email" + \
              f"by clicking on the link: {confirm_url} " + \
            f"If you didn't create an account, ignore this mail."

    send_email(to_email=user['email'], subject=subject, body=text)
    return jsonify({ "msg": "succesfully sent the confirmation mail to email"}), 200

# generate unique id for users
def generate_public_id(length=8):
    
    uid = uuid.uuid4() # generate a UUID based on the host ID and current time

    uid_str = str(uid).replace('-', '').upper() # remove hyphens and convert to uppercase to shorten the ID
    random_chars = ''.join(random.choices(string.ascii_letters + string.digits, k=length)) # generate a random alphanumeric string of the desired length
    publc_id = uid_str[:length] + random_chars # combine the UUID and the random string to create the short unique ID

    return publc_id
