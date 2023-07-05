# imports #
# ------- # 
from api import db

# defining the mongodb collections to prevent circular imports
user_collection = db.users
admin_collection = db.admins
