from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import mysql.connector as _mysql_connector
from config import Config

app = Flask(__name__)
CORS(app)
app.config.from_object(Config)

def check_connection():
    try:    # from create_db.py
        my_connector = _mysql_connector.connect(
            host = "localhost",
            user = "root",      # change with your own settings
            password = "beans", # change with your own settings
            database = "air_traffic_reservation_system",   # change with your own settings
        )
        return True
    except _mysql_connector.Error as e:
        return False
    
@app.route('/')
def index():
    is_connected = check_connection
    if is_connected:
        return '<h2> Database connection is successful! :D </h2>'
    else:
        return '<h2> Database connection failed... :C </h2>'