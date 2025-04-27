from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from models import Purchases

purchases_api = Blueprint('purchases_api', __name__, url_prefix='/api/purchases')

@purchases_api.route('/', methods=['GET'])
@login_required
def my_purchases():
    return jsonify(Purchases.get_by_customer(current_user.id))

# test