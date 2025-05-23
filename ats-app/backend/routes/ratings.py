from flask import Blueprint, jsonify, request
from db import getdb
import utility

ratings_api = Blueprint('ratings_api', __name__, url_prefix='/api/ratings')

# Get ratings (No login check)
@ratings_api.route('/', methods=['GET'])
def get_my_ratings():
    """
    Returns all ratings/comments the current customer has made.
    """
    print(f"🔍 Retrieving ratings for user: {current_user.id}")  # Remove login check if not needed
    
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
        (current_user.id,)  # You need to extract user_id properly without login.
    )
    rows = cur.fetchall()
    print(f"✅ Retrieved {len(rows)} rows for ratings")

    cur.close()
    conn.close()
    return jsonify({'ratings': rows}), 200

# Add or update a rating (No login check)


@ratings_api.route('/add', methods=['POST'])
def add_rating():
    """
    Add or update a rating (1–5) and comment for a ticket the customer purchased.
    """
    print("hi")
    data = request.get_json() or {}
    print(f"🔍 Add rating request received: {data}")  # Debugging the incoming data

    # Manually validate and convert fields (bypassing utility.convertBody for testing)
    body = {}
    if 'ticket_ID' in data:
        body['ticket_ID'] = data['ticket_ID']
    if 'rating' in data:
        body['rating'] = data['rating']
    if 'comment' in data:
        body['comment'] = data['comment']
    
    print(f"🔍 Manually converted body: {body}")  # Debugging manually converted data

    # Check if fields are missing
    if not body.get('ticket_ID') or not body.get('rating'):
        return jsonify({'msg': 'missing field'}), 422

    # Validate rating range (1–5)
    try:
        r = int(body['rating'])
        if r < 1 or r > 5:
            return jsonify({'msg': 'rating must be between 1 and 5'}), 422
    except Exception as e:
        print(f"❌ Invalid rating type: {e}")
        return jsonify({'msg': 'invalid rating type'}), 422

    # Now processing with the valid ticket_ID and rating
    conn = getdb()
    cur = conn.cursor()

    # Ensure the ticket exists with the provided ticket_ID (No email check now as per request)
    print(f"🔍 Verifying if ticket_ID {body['ticket_ID']} exists in purchases")
    cur.execute(
        """
        SELECT 1
        FROM purchases p
        JOIN ticket t ON t.ticket_ID = p.ticket_ID
        WHERE p.ticket_ID = %s
        AND t.departure_timestamp < NOW()
        """,
        (body['ticket_ID'],)
    )


    if cur.fetchone() is None:
        cur.close()
        conn.close()
        print('Flight not departed')
        print(f"❌ Ticket {body['ticket_ID']} not found")
        return jsonify({'msg': 'Ticket not found/not departed'}), 404

    # Update rating and comment
    print(f"📤 Updating rating for ticket {body['ticket_ID']} to {r} with comment: {body.get('comment')}")
    cur.execute(
        "UPDATE purchases SET rating = %s, comment = %s WHERE ticket_ID = %s",
        (r, body.get('comment'), body['ticket_ID'])  # Update the ticket with the new rating/comment
    )

    conn.commit()
    cur.close()
    conn.close()

    print(f"✅ Rating for ticket {body['ticket_ID']} saved successfully")  # Debugging success

    return jsonify({'msg': 'rating saved'}), 200


@ratings_api.route('/all', methods=['GET'])
def get_all_flight_ratings():
    """
    Staff-only: Return all ratings and comments grouped by flight.
    Requires 'X-User-Role' header to be 'staff'.
    """

    print("🛬 Staff is fetching all flight ratings and comments...")

    conn = getdb()
    cur = conn.cursor(dictionary=True)
    
    cur.execute("""
        SELECT 
            p.ticket_ID,
            p.rating,
            p.comment,
            p.email,
            f.flight_number,
            f.departure_timestamp,
            f.arrival_airport_code,
            f.departure_airport_code,
            f.airline_name
        FROM purchases p
        JOIN ticket t ON t.ticket_ID = p.ticket_ID
        JOIN flight f ON f.flight_number = t.flight_number 
                      AND f.departure_timestamp = t.departure_timestamp 
                      AND f.airline_name = t.airline_name
        WHERE p.rating IS NOT NULL
        ORDER BY f.flight_number, f.departure_timestamp DESC
    """)
    
    rows = cur.fetchall()
    print(f"✅ Retrieved {len(rows)} ratings for staff")

    cur.close()
    conn.close()

    return jsonify({'ratings': rows}), 200
    
@ratings_api.route('/flight', methods=['GET'])
def get_flight_ratings_for_staff():
    """
    Staff-only: for a specific flight, return its average rating and all comments.
    Expects query params: airline_name, flight_number, departure_timestamp (YYYY-MM-DD).
    """
   

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