from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from db import getdb
import utility
import uuid
from datetime import datetime

# Blueprint for ticket purchasing and cancellation
tickets_api = Blueprint('tickets_api', __name__, url_prefix='/api/tickets')

@tickets_api.route('/', methods=['POST'])
@login_required
def purchase_ticket():
    """
    Purchase a ticket for a flight if seats are available.
    """
    # Validate input
    body = utility.convertBody(
        request.get_json() or {},
        {
            'flight_number': 'flight_number',
            'departure_timestamp': 'departure_timestamp',
            'airline_name': 'airline_name',
            'card_number': 'card_number',
            'card_type': 'card_type',
            'card_expiration_date': 'card_expiration_date',
            'name_on_card': 'name_on_card'
        },
        auto_date=True
    )
    if body is False:
        return jsonify({'msg': 'Missing or invalid fields'}), 422

    connection = getdb()
    cur = connection.cursor()

    # Check capacity
    cur.execute(
        "SELECT a.seats, COUNT(t.ticket_ID) "
        "FROM flight f "
        "JOIN airplane a ON f.airplane_ID=a.airplane_ID AND f.airline_name=a.owner_name "
        "LEFT JOIN ticket t ON t.flight_number=f.flight_number AND t.departure_timestamp=f.departure_timestamp AND t.airline_name=f.airline_name "
        "WHERE f.flight_number=%s AND f.departure_timestamp=%s AND f.airline_name=%s "
        "GROUP BY a.seats",
        (body['flight_number'], body['departure_timestamp'], body['airline_name'])
    )
    row = cur.fetchone()
    if not row:
        cur.close(); connection.close()
        return jsonify({'msg': 'Flight not found'}), 404
    seats, booked = row[0], row[1]
    if booked >= seats:
        cur.close(); connection.close()
        return jsonify({'msg': 'Flight fully booked'}), 409

    # Calculate seat pricing
    # Formula:  If 60% of the capacities is already booked/reserved for that flight, extra 20% will be added with the minimum/base price.
    cur.execute(
        "SELECT base_price FROM flight WHERE flight_number=%s AND departure_timestamp=%s AND airline_name=%s",
        (body['flight_number'], body['departure_timestamp'], body['airline_name'])
    )
    base_price = cur.fetchone()[0]
    demand_ratio = booked / seats
    sold_price = base_price * (1.2 if demand_ratio >= 0.6 else 1.0)

    # Insert payment info
    cur.execute(
        "INSERT IGNORE INTO payment_info(card_number, card_type, card_expiration_date, name_on_card)"
        " VALUES(%(card_number)s,%(card_type)s,%(card_expiration_date)s,%(name_on_card)s)",
        body
    )

    # Create ticket
    ticket_id = str(uuid.uuid4())
    purchase_timestamp = datetime.now()
    cur.execute(
        "INSERT INTO ticket(ticket_ID,flight_number, departure_timestamp, airline_name, email, customer_name, sold_price)"
        " VALUES(%s,%s,%s,%s,%s,%s,%s)",
        (ticket_id, body['flight_number'], body['departure_timestamp'], body['airline_name'],
         current_user.id, current_user.id, sold_price)
    )

    # Record purchase
    cur.execute(
        "INSERT INTO purchases(email, ticket_ID, card_number, comment, rating, purchase_timestamp)"
        " VALUES(%s,%s,%s,NULL,NULL,%s)",
        (current_user.id, ticket_id, body['card_number'], purchase_timestamp)
    )

    connection.commit()
    cur.close(); connection.close()
    return jsonify({'msg': 'Ticket purchased', 'ticket_ID': ticket_id, 'sold_price': sold_price}), 201

@tickets_api.route('/<ticket_id>', methods=['DELETE'])
@login_required
def cancel_ticket(ticket_id):
    """
    Cancel a ticket if more than 24 hours remain before departure.
    """
    connection = getdb()
    cur = connection.cursor()
    cur.execute(
        "SELECT departure_timestamp FROM ticket WHERE ticket_ID=%s AND email=%s",
        (ticket_id, current_user.id)
    )
    row = cur.fetchone()
    if not row:
        cur.close(); connection.close()
        return jsonify({'msg': 'Not found'}), 404
    departure = row[0]
    if (departure - datetime.utcnow()).total_seconds() < 24*3600:
        cur.close(); connection.close()
        return jsonify({'msg': 'Cannot cancel within 24 hours'}), 403

    cur.execute("DELETE FROM purchases WHERE ticket_ID=%s AND email=%s", (ticket_id, current_user.id))
    cur.execute("DELETE FROM ticket WHERE ticket_ID=%s", (ticket_id,))
    connection.commit()
    cur.close(); connection.close()
    return jsonify({'msg': 'Ticket cancelled'}), 200