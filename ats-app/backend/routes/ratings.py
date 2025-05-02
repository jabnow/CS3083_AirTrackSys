from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from db import getdb
import utility
from datetime import datetime

ratings_api = Blueprint('ratings_api', __name__, url_prefix='/api/ratings')

@ratings_api.route('/', methods=['GET'])
@login_required
def get_my_ratings():
    """
    Customer-only: list all of the current user's ratings & comments, newest first.
    """
    conn = getdb()
    cur = conn.cursor(dictionary=True)
    cur.execute(
        """
        SELECT ticket_ID,
               rating,
               comment,
               purchase_timestamp
          FROM purchases
         WHERE email = %s
           AND rating IS NOT NULL
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
    Customer-only: add or update a rating (1–5) and optional comment for one of the user's tickets.
    Expects JSON { ticket_ID, rating, comment? }.
    """
    data = request.get_json() or {}
    body = utility.convertBody(
        data,
        {
            'ticket_ID': 'ticket_ID',
            'rating':    'rating',
            'comment?':  'comment'
        }
    )
    if body is False:
        return jsonify({'msg': 'missing field'}), 422

    # validate rating
    try:
        r = int(body['rating'])
        if r < 1 or r > 5:
            raise ValueError()
    except:
        return jsonify({'msg': 'rating must be an integer between 1 and 5'}), 422

    conn = getdb()
    cur = conn.cursor()
    # ensure ticket belongs to this user
    cur.execute(
        "SELECT 1 FROM purchases WHERE email = %s AND ticket_ID = %s",
        (current_user.id, body['ticket_ID'])
    )
    if cur.fetchone() is None:
        cur.close()
        conn.close()
        return jsonify({'msg': 'not your ticket'}), 403

    # update rating/comment
    cur.execute(
        """
        UPDATE purchases
           SET rating = %s,
               comment = %s
         WHERE email = %s
           AND ticket_ID = %s
        """,
        (r, body.get('comment'), current_user.id, body['ticket_ID'])
    )
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({'msg': 'rating saved'}), 200


@ratings_api.route('/flight', methods=['GET'])
@login_required
def get_flight_ratings_for_staff():
    """
    Staff-only: for a specific flight, return its average rating and all comments.
    Expects query params: airline_name, flight_number, departure_timestamp (YYYY-MM-DD).
    """
    if getattr(current_user, 'role', None) != 'staff':
        return jsonify({'msg': 'staff only'}), 403

    airline = request.args.get('airline_name')
    flight_no = request.args.get('flight_number')
    dep_date = request.args.get('departure_timestamp')
    if not airline or not flight_no or not dep_date:
        return jsonify({'msg': 'missing field'}), 422

    conn = getdb()
    cur = conn.cursor(dictionary=True)

    # fetch all reviews
    cur.execute(
        """
        SELECT p.email,
               p.rating,
               p.comment,
               p.purchase_timestamp
          FROM purchases p
          JOIN ticket t
            ON t.ticket_ID = p.ticket_ID
          JOIN flight f
            ON f.flight_number = t.flight_number
           AND DATE(f.departure_timestamp) = %s
           AND f.airline_name = %s
           AND f.flight_number = %s
         WHERE p.rating IS NOT NULL
         ORDER BY p.purchase_timestamp DESC
        """,
        (dep_date, airline, flight_no)
    )
    reviews = cur.fetchall()

    # compute average
    cur.execute(
        """
        SELECT AVG(p.rating) AS average_rating
          FROM purchases p
          JOIN ticket t
            ON t.ticket_ID = p.ticket_ID
          JOIN flight f
            ON f.flight_number = t.flight_number
           AND DATE(f.departure_timestamp) = %s
           AND f.airline_name = %s
           AND f.flight_number = %s
         WHERE p.rating IS NOT NULL
        """,
        (dep_date, airline, flight_no)
    )
    avg_row = cur.fetchone()
    average = avg_row['average_rating'] or 0.0

    cur.close()
    conn.close()

    return jsonify({
        'average_rating': round(average, 2),
        'reviews': reviews
    }), 200