from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from db import getdb
from models import Purchases

ratings_api = Blueprint('ratings_api', __name__, url_prefix='/api/ratings')

@ratings_api.route('/', methods=['GET'])
def list_ratings():
    connection= getdb(); cur = connection.cursor(dictionary=True)
    cur.execute("SELECT * FROM Purchases WHERE comment IS NOT NULL")
    rows = cur.fetchall(); 
    cur.close(); 
    connection.close()
    return jsonify(rows)


@ratings_api.route('/', methods=['POST'])
@login_required
def add_rating():
    data = request.json; data['email'] = current_user.id
    Purchases.update_rating(**data)
    return jsonify({'msg':'rated'})