# backend/routes/purchases.py
from flask import Blueprint, jsonify
from flask_login import login_required, current_user
from db import getdb

purchases_api = Blueprint('purchases_bp', __name__, url_prefix='/api/purchases')

@purchases_api.route('/', methods=['GET'])
@login_required
def my_purchases():
    """
    Returns all tickets the current customer has purchased, including any ratings/comments.
    """
    conn = getdb()
    cur = conn.cursor(dictionary=True)
    cur.execute(
        """
        SELECT
          p.ticket_ID,
          t.flight_number,
          t.departure_timestamp,
          t.airline_name,
          t.customer_name,
          t.sold_price,
          p.rating,
          p.comment,
          p.purchase_timestamp
        FROM purchases p
        JOIN ticket t ON t.ticket_ID = p.ticket_ID
        WHERE p.email = %s
        ORDER BY p.purchase_timestamp DESC
        """,
        (current_user.id,)
    )
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return jsonify({'purchases': rows}), 200

# Note: Use the 'ratings' blueprint to add or update ratings/comments for tickets.