from flask import Blueprint, jsonify, request
import utility  # it's a custom file
from flask_login import login_required, current_user
import json
from db import get_db
from config import Config

customer_api = Blueprint('customer_api', __name__, url_prefix='/api/customers')

# no login decorator needed for this route, i think... -DZ
@customer_api.route('/', methods=['PUT'])
def create_customer():
    try:
        body = utility.convert_Body(
            json.loads(request.data.decode('utf-8')),
            {
                'email': 'email',   
                'first_name' : 'first_name',
                'last_name' : 'last_name',
                'password' : 'password',
                'building_number' : 'building_number',
                'street' : 'street',
                'city' : 'city',
                'state' : 'state',
                'phone_number' : 'phone_number',
                'passport_number' : 'passport_number',
                'passport_expiration' : 'passport_expiration',
                'passport_country' : 'passport_country',
                'date_of_birth' : 'date_of_birth',
            }
        )
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    
    connection = get_db()
    cursor = connection.cursor()

    # no other validation needed? 
    try:
        cursor.execute(
            '''
            INSERT INTO Customer(
                email,
                first_name,
                last_name,
                password,
                building_number,
                street,
                city,
                state,
                phone_number,
                passport_number,
                passport_expiration,
                passport_country,
                date_of_birth
            ) VALUES (
                %(email)s,
                %(first_name)s,
                %(last_name)s,
                %(password)s,
                %(building_number)s,
                %(street)s,
                %(city)s,
                %(state)s,
                %(phone_number)s,
                %(passport_number)s,
                %(passport_expiration)s,
                %(passport_country)s,
                %(date_of_birth)s
            )
            ''',
            body
        )
        connection.commit()
    except Exception as e:
        connection.rollback()
        cursor.close()
        connection.close()
        return jsonify({'msg': 'invalid field or duplicate key'}), 409
    cursor.close()
    connection.close()
    return jsonify({'msg': 'customer created successfully'}), 201

