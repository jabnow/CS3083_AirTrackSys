from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from db import getdb
import utility
import uuid
from datetime import datetime

# Blueprint for ticket purchasing and cancellation
tickets_api = Blueprint('tickets_api', __name__, url_prefix='/api/tickets')

@tickets_api.route('/buy', methods=['POST'])

def purchase_ticket():
    """
    Purchase a ticket for a flight if seats are available.
    """
    print("🔍 Received purchase request")

    # Validate input
    body = request.get_json() or {}
    print(f"🔍 Received body: {body}")

    # Ensure all required fields are present in the request body
    required_fields = ['flight_number', 'departure_timestamp', 'airline_name', 'card_number', 'card_type', 'card_expiration_date', 'name_on_card']
    for field in required_fields:
        if field not in body:
            return jsonify({'msg': f'Missing or invalid field: {field}'}), 422

    # Convert expiration date to the correct format (YYYY-MM-DD)
    try:
        card_expiration_date = datetime.strptime(body['card_expiration_date'], "%Y-%m-%d").date()
    except ValueError:
        return jsonify({'msg': 'Invalid card expiration date format, expected YYYY-MM-DD'}), 422

    # Ensure all the fields are properly formatted
    card_number = body['card_number']
    card_type = body['card_type']
    name_on_card = body['name_on_card']
    flight_number = body['flight_number']
    departure_timestamp = body['departure_timestamp']
    airline_name = body['airline_name']
    customer_id=body['customer_id']

    # Database connection and queries
    connection = getdb()
    cur = connection.cursor()

    # Check flight capacity
    departure_date = datetime.strptime(body['departure_timestamp'], "%Y-%m-%d").date()
    print("Executing query with:")
    print("🧾 Using customer_id:", customer_id)
    print("  flight_number:", flight_number)
    print("  airline_name:", airline_name)
    print("  departure_timestamp (date only):", departure_date)
    print("  airline_name:", airline_name)
    print("Using flight_number:", flight_number)
    print("Using departure_date (only YYYY-MM-DD):", departure_date)
    print("Using airline_name:", airline_name)
    cur.execute(
        "SELECT a.seats, COUNT(t.ticket_ID) "
        "FROM flight f "
        "JOIN airplane a ON f.airplane_ID = a.airplane_ID AND f.airline_name = a.owner_name "
        "LEFT JOIN ticket t ON t.flight_number = f.flight_number AND DATE(t.departure_timestamp) = DATE(f.departure_timestamp) AND t.airline_name = f.airline_name "
        "WHERE f.flight_number = %s AND DATE(f.departure_timestamp) = %s AND f.airline_name = %s "
        "GROUP BY a.seats",
        (flight_number, departure_date, airline_name)
    )
    row = cur.fetchone()
    print(row)
    if not row:
        cur.close(); connection.close()
        return jsonify({'msg': 'Flight not found'}), 404
    
    seats, booked = row[0], row[1]
    if booked >= seats:
        cur.close(); connection.close()
        return jsonify({'msg': 'Flight fully booked'}), 409

    cur.execute(
        "SELECT base_price, departure_timestamp FROM flight WHERE flight_number = %s AND DATE(departure_timestamp) = %s AND airline_name = %s",
        (flight_number, departure_date, airline_name)  # ensure DATE match
    )

    row = cur.fetchone()
    if not row:
        cur.close(); connection.close()
        return jsonify({'msg': 'Flight not found'}), 404

    base_price, departure_timestamp = row  # correctly unpack the row
    print("💰 Base price:", base_price)
    print("🕒 Full departure timestamp:", departure_timestamp)
    # demand_ratio = booked / seats
    # sold_price = base_price * (1.2 if demand_ratio >= 0.6 else 1.0)
    sold_price=base_price
    print(sold_price)

    # Insert payment info
    try:
        cur.execute(
            "INSERT IGNORE INTO payment_info(card_number, card_type, card_expiration_date, name_on_card)"
            " VALUES(%s, %s, %s, %s)",
            (card_number, card_type, card_expiration_date, name_on_card)
        )
    except Exception as e:
        print(f"💥 Error inserting payment info: {e}")
        return jsonify({'msg': 'Error inserting payment info'}), 500

    # Create ticket
    ticket_id = str(uuid.uuid4())[:4]
    purchase_timestamp = datetime.now()
    cur.execute(
        "INSERT INTO ticket(ticket_ID, flight_number, departure_timestamp, airline_name, email, customer_name, sold_price)"
        " VALUES(%s, %s, %s, %s, %s, %s, %s)",
        (ticket_id, flight_number, departure_timestamp, airline_name, customer_id, name_on_card, sold_price)
    )

    # Record purchase
    cur.execute(
        "INSERT INTO purchases(email, ticket_ID, card_number, comment, rating, purchase_timestamp)"
        " VALUES(%s, %s, %s, NULL, NULL, %s)",
        (customer_id, ticket_id, card_number, purchase_timestamp)
    )

    connection.commit()
    cur.close(); connection.close()

    return jsonify({'msg': 'Ticket purchased', 'ticket_ID': ticket_id, 'sold_price': sold_price}), 201

@tickets_api.route('/<ticket_id>', methods=['DELETE'])

def cancel_ticket(ticket_id):
    """
    Cancel a ticket if more than 24 hours remain before departure.
    Requires customer email via 'X-User-Id' header.
    """
    ticket_id = request.headers.get('X-Ticket-Id')
    customer_id = request.headers.get('X-User-Id')
    if not customer_id:
        return jsonify({'msg': 'Missing customer identity'}), 401

    print(f"🔑 Cancel request by: {customer_id} for ticket: {ticket_id}")

    connection = getdb()
    cur = connection.cursor()

    cur.execute(
        "SELECT departure_timestamp FROM ticket WHERE ticket_ID=%s AND email=%s",
        (ticket_id, customer_id)
    )
    row = cur.fetchone()
    if not row:
        cur.close(); connection.close()
        return jsonify({'msg': 'Not found'}), 404

    departure = row[0]
    print(f"🕒 Departure time: {departure}")

    if (departure - datetime.utcnow()).total_seconds() < 24 * 3600:
        cur.close(); connection.close()
        return jsonify({'msg': 'Cannot cancel within 24 hours/Already departed'}), 403


    cur.execute("DELETE FROM purchases WHERE ticket_ID=%s AND email=%s", (ticket_id, customer_id))
    cur.execute("DELETE FROM ticket WHERE ticket_ID=%s", (ticket_id,))
    connection.commit()
    cur.close(); connection.close()

    print("✅ Ticket cancelled:", ticket_id)
    return jsonify({'msg': 'Ticket cancelled'}), 200