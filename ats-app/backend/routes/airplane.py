from flask import Blueprint, jsonify, request
import json
from db import getdb

airplane_api = Blueprint('airplane_api', __name__, url_prefix='/api/airplane')

@airplane_api.route('/', methods=['PUT'])
def add_airplane():
    print("✈️ Received airplane add request")

    try:
        data = json.loads(request.data.decode('utf-8'))
        airplane_ID = str(data.get('airplane_ID', '')).strip()
        owner_name = str(data.get('owner_name', '')).strip()
        manufacturer = str(data.get('manufacturer', '')).strip()
        seats = int(data.get('seats', 0))
    except Exception as e:
        return jsonify({'error': f'Invalid input format: {str(e)}'}), 400

    # Validation
    if not all([airplane_ID, owner_name, manufacturer]):
        return jsonify({'msg': 'missing field'}), 422
    if seats <= 0:
        return jsonify({'msg': 'seats must be positive'}), 422
    if len(airplane_ID) > 20 or len(owner_name) > 100 or len(manufacturer) > 100:
        return jsonify({'msg': 'field length exceeds limit'}), 422

    connection = getdb()
    cursor = connection.cursor()

    try:
        cursor.execute(
            '''
            INSERT INTO Airplane (
                airplane_ID,
                owner_name,
                seats,
                manufacturer
            ) VALUES (%s, %s, %s, %s)
            ''',
            (airplane_ID, owner_name, seats, manufacturer)
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
