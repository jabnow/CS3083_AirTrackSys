import os
from dotenv import load_dotenv
import mysql.connector

load_dotenv()

# from Config.SQL_SERVER
SQL_SERVER = os.getenv('SQL_SERVER')

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
    cfg = credentials.DB_CONFIG
except ImportError:
    cfg = {
        'host':     os.getenv('MYSQL_HOST', 'localhost'),
        'user':     os.getenv('MYSQL_USER', 'root'),
        'password': os.getenv('MYSQL_PASSWORD', ''),
        'database': os.getenv('MYSQL_DB', 'air_traffic_reservation_system')
    }

# admin
admin_connection = mysql.connector.connect(
    host=cfg['host'],
    user=cfg['user'],
    password=cfg['password']
)


# Application pooled connection
app_connection = None
try:
    app_connection = mysql.connector.connect(
        host=cfg['host'],
        user=cfg['user'],
        password=cfg['password'],
        database=cfg['database']
    )
except mysql.connector.Error:
    pass


def getdb():
    """
    Return a new MySQL connection to the application database.
    """
    return mysql.connector.connect(
        host=cfg['host'],
        user=cfg['user'],
        password=cfg['password'],
        database=cfg['database']
    )