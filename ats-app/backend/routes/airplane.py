from flask import Blueprint, jsonify, request
import utility  # it's a custom file
from flask_login import login_required, current_user
import json
from db import get_db
from config import Config

airplane_api = Blueprint('airplane_api', __name__, url_prefix='/api/airplane')

@airplane_api.route('/', methods=['PUT'])
@login_required
def add_airplane():
    try:
        body = utility.convert_Body(
            json.loads(request.data.decode('utf-8')),
            {
                'airplane_ID': 'airplane_ID',
                'owner_name' : 'owner_name',
                'seats' : 'seats',
                'manufacturer' : 'manufacturer'
            }
        )
    except Exception as e:
        return jsonify({'error': str(e)}), 400  # idk which error codes to use, just going by suggested nums - JW
    if body is False:
        return jsonify({'msg': 'missing field'}), 422
    
    # btw user permissions: only staff can edit airplanes
    if getattr(current_user, 'role', None) != 'staff':
        return jsonify({'msg': 'Staff Only'}), 403
    
    # can only book if seats are available
    try:
        if int(body['seats']) <= 0:
            return jsonify({'error': 'seats must be positive'}), 422
    except Exception:
        return jsonify({'msg': 'there are no available seats left'}), 422

    
    # apparently all staff have to be employed by an airline
    connection = get_db()
    cursor = connection.cursor()
    airline_staff = utility.get_staff(
        cursor,
        current_user.username,
        'employer_name'
    )
    if airline_staff != body['owner_name']:
        cursor.close()
        connection.close()
        return jsonify({'msg': 'Not authorized for this airline'}), 403
    
    try:
        cursor.execute(
            '''
            INSERT INTO Airplane(
                airplane_ID,
                owner_name,
                seats,
                manufacturer
            ) VALUES (
                %(airplane_ID)s,
                %(owner_name)s,
                %(seats)s,
                %(manufacturer)s
            )
            ''',
            body,
        )
        connection.commit()
    except Exception as e:
        connection.rollback()
        cursor.close()
        connection.close()
        return jsonify({'msg': 'invalid field or duplicate key'}), 409
    cursor.close()
    connection.close()
    return jsonify({'msg': 'airplane created successfully'}), 201