from flask import Blueprint, jsonify, request
import utility  # it's a custom file
from flask_login import login_required, current_user
import json
from db import getdb
from config import Config

# from flask import render_template, redirect, url_for, flash
airports_api = Blueprint('airports_api', __name__, url_prefix='/api/airports')

@airports_api.route('/', methods=['POST'])
# @login_required
def create_airport():  
    # print("create_airport running")
    # authorization check - only staff can create airports - JW
    # if getattr(current_user, 'role', None) != 'staff':
    #     return jsonify({'msg': 'Staff Only'}), 403
    
    # ok now go
    try:
        body = utility.convertBody(
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
    
    connection = getdb()
    cursor = connection.cursor()

    try:
        cursor.execute(
            '''
            INSERT INTO Airport(
                code,
                name,
                city,
                country
            ) VALUES (
                %(code)s,
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
    return jsonify({'msg': 'airport created successfully'}), 201


# # might be useful for testing - JW
# @airports_api.route('/', methods=['GET'])
# def list_airports():
#     """
#     List all airports.
#     """
#     connection = getdb()
#     cur = connection.cursor(dictionary=True)
#     cur.execute("SELECT code, name, city, country FROM airport")
#     airports = cur.fetchall()
#     cur.close()
#     connection.close()
#     return jsonify(airports), 200

# @airports_api.route('/add-form', methods=['GET', 'POST'])
# def add_airport_form():
#     if request.method == 'POST':
#         body = {
#             'code': request.form.get('code'),
#             'name': request.form.get('name'),
#             'city': request.form.get('city'),
#             'country': request.form.get('country')
#         }

#         connection = getdb()
#         cursor = connection.cursor()
#         try:
#             cursor.execute(
#                 '''
#                 INSERT INTO Airport(code, name, city, country)
#                 VALUES (%s, %s, %s, %s)
#                 ''',
#                 (body['code'], body['name'], body['city'], body['country'])
#             )
#             connection.commit()
#             flash('Airport added successfully!', 'success')
#             return redirect(url_for('airports_api.add_airport_form'))
#         except Exception as e:
#             connection.rollback()
#             flash(f'Error: {str(e)}', 'danger')
#         finally:
#             cursor.close()
#             connection.close()

#     return render_template('add_airport.html')