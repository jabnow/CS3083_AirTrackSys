from flask import Blueprint, jsonify, request
import utility  # it's a custom file
from flask_login import login_required, current_user
import json
from db import get_db
from config import Config

airport_api = Blueprint('airport_api', __name__, url_prefix='/api/airport')

@airport_api.route('/', methods=['PUT'])
@login_required
# I guess this is a use case that airline staff are supposed to have - DZ
def create_airport():  
    try:
        body = utility.convert_Body(
            json.loads(request.data.decode('utf-8')),
            {
                'code': 'code',
                'name' : 'name',
                'city' : 'city',
                'country' : 'country'
            }
        )
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    if body is False:
        return jsonify({'msg': 'missing field'}), 422
    
    if getattr(current_user, 'role', None) != 'staff':
        return jsonify({'msg': 'Staff Only'}), 403
    
    connection = get_db()
    cursor = connection.cursor()

    try:
        cursor.execute(
            '''
            INSERT INTO Airport(
                airport_code,
                name,
                city,
                country,
            ) VALUES (
                %(airport_code)s,
                %(name)s,
                %(city)s,
                %(country)s
            )
            ''',
            body,
        )
        connection.commit()
    except:
        connection.rollback()
        cursor.close()
        connection.close()
        return jsonify({'msg': 'invalid field or duplicate key'}), 409
    cursor.close()
    connection.close()
    return jsonify({'msg': 'airplane created successfully'}), 201