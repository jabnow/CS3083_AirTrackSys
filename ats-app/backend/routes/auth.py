# register
# login
# user
# the staff
from flask import Blueprint, request, jsonify, make_response
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin, LoginManager, login_user, logout_user, login_required, current_user
from datetime import datetime
from dateutil import relativedelta

# blueprint
auth_api = Blueprint('auth', __name__, url_prefix='/api/auth')

class User(UserMixin):
    def __init__(self, id, role='customer'):    # default to customer
        self.id = id
        self.role = role
    def get_id(self):
        return self.id
    
    
@auth_api.route('/register', methods=['POST'])
def register():
    ...
    

@auth_api.route('/login', methods=['POST'])
def login():
    ...    
    
    
@auth_api.route('/logout', methods=['POST'])
def logout():
    ...   
    
    
# verify phone number(s)
@auth_api.route('/user/phone_number', methods=['POST'])
def add_phone_number():
    ...   


# verify email(s)
@auth_api.route('/user/email', methods=['POST'])
def add_email():
    ...   