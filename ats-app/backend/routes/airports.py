from flask import Blueprint, jsonify, request
import json
from db import getdb

airports_api = Blueprint('airports_api', __name__, url_prefix='/api/airports')

@airports_api.route('/', methods=['POST'])
def create_airport():
    print("🛬 Received airport creation request")

    try:
        data = json.loads(request.data.decode('utf-8'))
        code = str(data.get('code', '')).strip().upper()
        name = str(data.get('name', '')).strip()
        city = str(data.get('city', '')).strip()
        country = str(data.get('country', '')).strip()
    except Exception as e:
        return jsonify({'error': f'Invalid input format: {str(e)}'}), 400

    # Basic validation
    if not all([code, name, city, country]):
        return jsonify({'msg': 'missing field'}), 422
    if len(code) > 10 or len(name) > 100 or len(city) > 100 or len(country) > 100:
        return jsonify({'msg': 'field length exceeds limit'}), 422

    connection = getdb()
    cursor = connection.cursor()
    try:
        cursor.execute(
            '''
            INSERT INTO Airport (
                code, name, city, country
            ) VALUES (%s, %s, %s, %s)
            ''',
            (code, name, city, country)
        )
        connection.commit()
    except Exception as e:
        connection.rollback()
        cursor.close()
        connection.close()
        print("❌ SQL insert error:", e)
        return jsonify({'msg': 'invalid field or duplicate key'}), 409

    cursor.close()
    connection.close()
    return jsonify({'msg': 'airport created successfully'}), 201
