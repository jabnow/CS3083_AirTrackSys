from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from models import Purchases
from ratings import *
import utility
import json
from db import getdb
from config import Config

purchases_api = Blueprint('payment_info_api', __name__, url_prefix='/api/payment_info')

@purchases_api.route('/', methods=['POST'])
@login_required
def add_payment_info():

    if getattr(current_user, 'role', None) != 'customer':
        return jsonify({'msg': 'Registered Customers Only'}), 403
    
    try:
        body = utility.convertBody(
            json.loads(request.data.decode('utf-8')),
            {
                'card_number': 'card_number',
                'card_type': 'card_type',
                'card_expiration_date': 'card_expiration_date',
                'name_on_card': 'name_on_card',
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
            INSERT INTO PaymentInfo(
                card_number,
                card_type,
                card_expiration_date,
                name_on_card
            ) VALUES (
                %(card_number)s,
                %(card_type)s,
                %(card_expiration_date)s,
                %(name_on_card)s
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
    return jsonify({'msg': 'Payment info added successfully'}), 201
