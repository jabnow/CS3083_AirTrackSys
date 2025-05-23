# register
# login
# user
# the staff
from flask import Blueprint, request, jsonify, make_response
from markupsafe import escape
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin, LoginManager, login_user, logout_user, login_required, current_user
from datetime import datetime
from dateutil import relativedelta
from db import getdb
from utility import convertBody, convertDate, convertDatetime, convertMonth
import hashlib

# blueprint
auth_api = Blueprint('auth', __name__, url_prefix='/api/auth')

class User(UserMixin):
    def __init__(self, id, role='customer'):    # default to customer
        self.id = id
        self.role = role
    def get_id(self):
        return self.id
    
CUSTOMER_FIELDS = {
    'email': 'email',   # required, unique
    'password': 'password',
    'first_name': 'first_name',
    'last_name': 'last_name',
    'building_number': 'building_number',
    'street': 'street',
    'city': 'city',
    'state': 'state',
    'phone_number': 'phone_number',
    'passport_number': 'passport_number',
    'passport_expiration': 'passport_expiration',
    'passport_country': 'passport_country',
    'date_of_birth': 'date_of_birth'
}

STAFF_FIELDS = {
    'username': 'username',
    'employer_name': 'employer_name',
    'password': 'password',
    'first_name': 'first_name',
    'last_name': 'last_name',
    'date_of_birth': 'date_of_birth',
    'emails?': 'emails',   # optional for multiple emails
    'phones?': 'phones'    # optional for multiple numbers
}
    
@auth_api.route('/register', methods=['POST'])
def register():
    raw = request.get_json() or {}
    role = raw.get('role', 'customer')
    # Choose mapping based on role
    mapping = STAFF_FIELDS if role == 'staff' else CUSTOMER_FIELDS
    data = convertBody(raw, mapping, auto_date=True)
    print("🔍 Received parameters:")
    for key, value in raw.items():
        print(f"  {key}: {value}")
    if data is False:
        return jsonify({'msg': 'missing or invalid fields'}), 422

    connection = getdb(); cur = connection.cursor()
    if role == 'staff':
        # Insert into airline_staff
        print("🧪 PARAMS:", (
            data['username'],
            data['employer_name'],
            generate_password_hash(data['password']),
            escape(data['first_name']),
            escape(data['last_name']),
            data['date_of_birth']
        ))
        try:
            cur.execute(
                "INSERT INTO airline_staff(username, employer_name, password, first_name, last_name, date_of_birth)"
                " VALUES (%s,%s,%s,%s,%s,%s)",
                (
                    data['username'],
                    data['employer_name'],
                    generate_password_hash(data['password']),
                    escape(data['first_name']),
                    escape(data['last_name']),
                    data['date_of_birth']
                )
            )
        except mysql.connector.IntegrityError as e:
            print("❌ Duplicate Key Error:", e)
            return jsonify({'msg': 'Duplicate user – username may already exist'}), 409

        
        # Process and insert staff emails
        emails_raw = data.get('emails', '')
        emails = [e.strip() for e in emails_raw.split(',') if e.strip()] if emails_raw else []

        for email in emails:
            cur.execute("SELECT 1 FROM Staff_Email WHERE username = %s AND email = %s", (data['username'], escape(email)))
            if not cur.fetchone():
                cur.execute("INSERT INTO Staff_Email(username, email) VALUES (%s, %s)", (data['username'], escape(email)))

        # Process and insert staff phone numbers
        phones_raw = data.get('phones', '')
        phones = [p.strip() for p in phones_raw.split(',') if p.strip()] if phones_raw else []

        for phone in phones:
            cur.execute("SELECT 1 FROM Staff_Phone WHERE username = %s AND phone_number = %s", (data['username'], escape(phone)))
            if not cur.fetchone():
                cur.execute("INSERT INTO Staff_Phone(username, phone_number) VALUES (%s, %s)", (data['username'], escape(phone)))

    else:
        # Create new customer
        cur.execute(
            "INSERT INTO Customer(email, first_name, last_name, password, building_number, street, city, state,"
            " phone_number, passport_number, passport_expiration, passport_country, date_of_birth)"
            " VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)",
            (
                data['email'],
                escape(data['first_name']),
                escape(data['last_name']),
                generate_password_hash(data['password']),
                data['building_number'],
                data['street'],
                data['city'],
                data['state'],
                data['phone_number'],
                data['passport_number'],
                data['passport_expiration'],
                data['passport_country'],
                data['date_of_birth']
            )
        )
    connection.commit()
    cur.close(); connection.close()
    return jsonify({'msg': 'successfully registered', 'role': role}), 201
    

@auth_api.route('/login', methods=['POST'])
def login():
    raw = request.get_json() or {}
    role = raw.get('role', 'customer')
    
    print("🔑 Login attempt with:", raw)

    connection = getdb()
    cur = connection.cursor()
    
    if role == 'staff':
        cur.execute("SELECT password FROM airline_staff WHERE username=%s", (raw.get('username'),))
        identifier = raw.get('username')
    else:
        cur.execute("SELECT password FROM Customer WHERE email=%s", (raw.get('email'),))
        identifier = raw.get('email')

    row = cur.fetchone()
    cur.close()
    connection.close()



    if not row:
        return jsonify({'msg': 'Invalid credentials no email'}), 401
    hashed_password = row[0]
    check_password_hash(hashed_password, 'abcd')
    print("🔍 Stored hash from DB:", hashed_password)
    print("🔐 User entered password:", raw.get('password', ''))
    hashed_input = hashlib.sha256(raw.get('password', '').encode()).hexdigest()  
    print(hashed_input)
    if not (check_password_hash(hashed_password, raw.get('password', '')) or hashed_input == hashed_password):
        return jsonify({'msg': 'Invalid credentials wrong password'}), 401

    # Skipping password check intentionally per your earlier request
    user = User(identifier, role)
    login_user(user)

    print(f"✅ Logged in user: {user.get_id()} with role: {role}")
    return jsonify({'msg': 'logged in', 'role': role, 'id': user.get_id()}), 200

    
    
@auth_api.route('/logout', methods=['POST'])
@login_required
def logout():
    """
    Logout the user and end the session.
    """
    logout_user()
    return jsonify({'msg': 'successfully logged out'}), 200