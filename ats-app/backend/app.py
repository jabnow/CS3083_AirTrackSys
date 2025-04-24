from flask import Flask
from flask_cors import CORS
import mysql.connector as _mysql_connector
from config import Config
import db

# Make App
app = Flask(__name__)
CORS(app)
app.config.from_object(Config)


# Import and register blueprints
# Unfinished until the models.py doc is finished
# Am I missing any? -JW
from routes.airplane import airplane_api
from routes.airports   import airports_api
from routes.auth      import auth_api
from routes.customers   import customer_api
from routes.public_flights   import flights_api
from routes.purchases   import purchases_api
from routes.tickets   import tickets_api

app.register_blueprint(airplane_api, url_prefix='/api/airplane')    # started - JW
app.register_blueprint(airports_api, url_prefix='/api/airports')
app.register_blueprint(auth_api, url_prefix='/api/auth')            # started - JW
app.register_blueprint(customer_api, url_prefix='/api/customers')
app.register_blueprint(flights_api, url_prefix='/api/flights')      
app.register_blueprint(purchases_api, url_prefix='/api/purchases')
app.register_blueprint(tickets_api, url_prefix='/api/tickets')


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
    
    
if __name__ == '__main__':
    app.run(debug=True)