from flask import Flask
from flask_cors import CORS
import mysql.connector as _mysql_connector
from config import Config
from db import getdb
from flask import json

# Make App
app = Flask(__name__)
CORS(app, supports_credentials=True, origins="*")  # Enable CORS for all routes
app.config.from_object(Config)


# Import and register blueprints
# Unfinished until the models.py doc is finished
# Am I missing any? -JW
from routes.airplane import airplane_api
from routes.airports   import airports_api
from routes.auth      import auth_api
from routes.customers   import customer_api
from routes.flights   import flights_api
from routes.purchases   import purchases_api
from routes.tickets   import tickets_api
from routes.ratings   import ratings_api
from routes.reports   import reports_api

app.register_blueprint(airplane_api, url_prefix='/api/airplane')    # written - JW
app.register_blueprint(airports_api, url_prefix='/api/airports')    # written - DZ
app.register_blueprint(auth_api, url_prefix='/api/auth')            # written - JW
app.register_blueprint(customer_api, url_prefix='/api/customers')   # written - DZ
app.register_blueprint(flights_api, url_prefix='/api/flights')      # written - JW
app.register_blueprint(purchases_api, url_prefix='/api/purchases')  # written - JW
app.register_blueprint(tickets_api, url_prefix='/api/tickets')      # written - JW
app.register_blueprint(ratings_api, url_prefix='/api/ratings')      # written - JW
app.register_blueprint(reports_api, url_prefix='/api/reports')      # started - JW


def check_connection():
    try:    # from create_db.py
        my_connector = _mysql_connector.connect(
            host = "localhost",
            user = "root",      # change with your own settings
            password = "", # change with your own settings
            database = "air_traffic_reservation_system",   # change with your own settings
            port = 3306,  # change with your own settings
        )
        return True
    except _mysql_connector.Error as e:
        return False
    
@app.route('/')
def index():    
    is_connected = check_connection()
    if is_connected:
        return '<h2> Database connection is successful. </h2>'
    else:
        return '<h2> Database connection failed. </h2>'
    
@app.route("/airports")
def airports():
    return "<h2> Airports </h2>"
    
# test if the app is running
# in bash: curl http://localhost:5000/api/health
# expected output: {"db": true}
@app.route('/api/health', methods=['GET'])
def healthcheck():
    try:
        conn = getdb()
        cur = conn.cursor()
        cur.execute('SELECT 1')
        ok = cur.fetchone()[0] == 1
        cur.close()
        conn.close()
        return {'db': ok}, 200
    except Exception as e:
        return {'db': False, 'error': str(e)}, 500

    
    
if __name__ == '__main__':
    app.run(debug=True)