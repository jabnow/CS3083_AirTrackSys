import os
import secrets
from dotenv import load_dotenv

load_dotenv()


# Load DB_CONFIG if available
# if you want, create a credentials.py file in the same directory as this
# credentials.py is in .gitignore
# (just copy and paste):

# DB_CONFIG = {
#     'host': 'localhost',
#     'user': 'root',
#     'password': 'your_password',
#     'database': 'air_traffic_reservation_system'
# }

try:
    import credentials
    DB_CONFIG = credentials.DB_CONFIG
except ImportError:
    DB_CONFIG = {
        'host':     os.getenv('MYSQL_HOST', 'localhost'),
        'user':     os.getenv('MYSQL_USER', 'root'),
        'password': os.getenv('MYSQL_PASSWORD', ''),
        'database': os.getenv('MYSQL_DB', 'air_traffic_reservation_system')
    }

class Config:
    # random sesison secret key
    SECRET_KEY = os.getenv('SECRET_KEY') or secrets.token_urlsafe(32)
    # MySQL connection 
    DB_CONFIG = DB_CONFIG