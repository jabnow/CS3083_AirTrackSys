from flask import Flask
from flask_cors import CORS
import mysql.connector as _mysql_connector
from config import Config
from db import getdb
from flask_login import LoginManager
from routes.auth import User  

app = Flask(__name__)
app.secret_key = Config.SECRET_KEY
CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)
app.config.from_object(Config)

# === Flask-Login setup ===
login_manager = LoginManager()
login_manager.login_view = 'auth_api.login'
login_manager.init_app(app)

@login_manager.user_loader
def load_user(user_id):
    return User(user_id)

# register blueprints
from routes.airplane import airplane_api
from routes.airports import airports_api
from routes.auth      import auth_api
from routes.customers import customer_api
from routes.flights   import flights_api
from routes.purchases import purchases_api
from routes.tickets   import tickets_api
from routes.ratings   import ratings_api
from routes.reports   import reports_api

app.register_blueprint(airplane_api)
app.register_blueprint(airports_api)
app.register_blueprint(auth_api)
app.register_blueprint(customer_api)
app.register_blueprint(flights_api)
app.register_blueprint(purchases_api)
app.register_blueprint(tickets_api)
app.register_blueprint(ratings_api)
app.register_blueprint(reports_api)

# test connection to the database
def check_connection():
    try:
        _mysql_connector.connect(
            host     = Config.DB_CONFIG['host'],
            user     = Config.DB_CONFIG['user'],
            password = Config.DB_CONFIG['password'],
            database = Config.DB_CONFIG['database'],
            port     = 3306
        )
        return True
    except _mysql_connector.Error:
        return False

@app.route('/')
def index():
    if check_connection():
        return '<h2>Database connection is successful.</h2>'
    else:
        return '<h2>Database connection failed…</h2>'

@app.route('/api/health', methods=['GET'])
def healthcheck():
    try:
        conn = getdb()
        cur  = conn.cursor()
        cur.execute('SELECT 1')
        ok = cur.fetchone()[0] == 1
        cur.close()
        conn.close()
        return {'db': ok}, 200
    except Exception as e:
        return {'db': False, 'error': str(e)}, 500

if __name__ == '__main__':
    import pprint
    pprint.pprint(app.url_map.iter_rules())
    app.run(debug=True)