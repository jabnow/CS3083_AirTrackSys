from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from db import getdb    # file
import utility          # file
# from models import Purchases

ratings_api = Blueprint('ratings_api', __name__, url_prefix='/api/ratings')

@ratings_api.route('/', methods=['GET'])
@login_required
def get_my_ratings():
    """
    Returns all ratings/comments the current customer has made.
    """
    conn = getdb()
    cur = conn.cursor(dictionary=True)
    cur.execute(
        """
        SELECT
          ticket_ID,
          rating,
          comment,
          purchase_timestamp
        FROM purchases
        WHERE email = %s AND rating IS NOT NULL
        ORDER BY purchase_timestamp DESC
        """,
        (current_user.id,)
    )
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return jsonify({'ratings': rows}), 200

@ratings_api.route('/', methods=['POST'])
@login_required
def add_rating():
    """
    Add or update a rating (1–5) and comment for a ticket the customer purchased.
    Expects JSON:
      {
        "ticket_ID": "<ticket uuid>",
        "rating": <int 1-5>,
        "comment": "<optional text>"
      }
    """
    data = request.get_json() or {}
    body = utility.convertBody(
        data,
        {
            'ticket_ID': 'ticket_ID',
            'rating': 'rating',
            'comment': 'comment?'
        }
    )
    if body is False:
        return jsonify({'msg': 'missing field'}), 422

    # Validate rating range
    try:
        r = int(body['rating'])
        if r < 1 or r > 5:
            return jsonify({'msg': 'rating must be between 1 and 5'}), 422
    except:
        return jsonify({'msg': 'invalid rating type'}), 422

    conn = getdb()
    cur = conn.cursor()
    # Ensure the ticket belongs to the current user
    cur.execute(
        "SELECT 1 FROM purchases WHERE email = %s AND ticket_ID = %s",
        (current_user.id, body['ticket_ID'])
    )
    if cur.fetchone() is None:
        cur.close()
        conn.close()
        return jsonify({'msg': 'not your ticket'}), 403

    # Update rating and comment
    cur.execute(
        "UPDATE purchases SET rating = %s, comment = %s WHERE email = %s AND ticket_ID = %s",
        (r, body.get('comment'), current_user.id, body['ticket_ID'])
    )
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({'msg': 'rating saved'}), 200


# @ratings_api.route('/', methods=['POST'])
# @login_required
# def add_rating():
#     data = request.json; data['email'] = current_user.id
#     Purchases.update_rating(**data)
#     return jsonify({'msg':'rated'})