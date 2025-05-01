# backend/routes/flights.py
from flask import Blueprint, request, jsonify, abort
from flask_login import login_required, current_user
from db import getdb
import utility
from datetime import datetime
# from ..constant import valid_status
from flask import current_app
from datetime import datetime

# Blueprint for flight management
flights_api = Blueprint('flights_api', __name__, url_prefix='/api/flights')

@flights_api.route('/', methods=['GET'])

def list_flights():
    """
    Staff-only: list flights with optional filters.
    """
    try:
        params = utility.convertParams(
            request.args,
            {
                'airline': 'airline',
                'start_date?': 'start_date',
                'end_date?': 'end_date',
                'source_city?': 'source_city',
                'source_airport?': 'source_airport',
                'destination_city?': 'destination_city',
                'destination_airport?': 'destination_airport'
            },
            auto_date=True
        )
    except:
        return jsonify({'msg': 'invalid field'}), 422
    if params is False:
        return jsonify({'msg': 'missing field'}), 422

    # Authorization: staff only
    if getattr(current_user, 'role', None) != 'staff':
        return jsonify({'msg': 'staff only'}), 403

    conn = getdb()
    cur = conn.cursor()
    # Ensure staff manages this airline
    staff_airline = utility.getStaff(cur, current_user.id, 'employer_name')
    if not staff_airline or staff_airline[0] != params['airline']:
        cur.close(); conn.close()
        return jsonify({'msg': 'Not authorized for this airline'}), 403

    selector = utility.createSqlQuery(
        [
            {'name':'airline', 'selector':'f.airline_name = %s'},
            {'name':'start_date', 'selector':'DATE(f.departure_timestamp) >= %s'},
            {'name':'end_date', 'selector':'DATE(f.departure_timestamp) <= %s'},
            {'name':'source_city', 'selector':'dep.city = %s'},
            {'name':'source_airport', 'selector':'f.departure_airport_code = %s'},
            {'name':'destination_city', 'selector':'arr.city = %s'},
            {'name':'destination_airport', 'selector':'f.arrival_airport_code = %s'}
        ],
        params
    )
    query = f"""
        SELECT f.airline_name, f.flight_number, f.departure_timestamp, f.departure_airport_code,
               f.arrival_timestamp, f.arrival_airport_code, f.base_price, f.status,
               a.airplane_ID, a.seats, a.manufacturer
        FROM flight f
          JOIN airplane a ON a.airplane_ID = f.airplane_ID AND a.owner_name = f.airline_name
          JOIN airport dep ON dep.code = f.departure_airport_code
          JOIN airport arr ON arr.code = f.arrival_airport_code
        WHERE 1=1 {selector}
    """
    cur.execute(query, params)
    rows = cur.fetchall()
    cur.close(); conn.close()

    flights = []
    for r in rows:
        flights.append({
            'airline_name': r[0],
            'flight_number': r[1],
            'departure_timestamp': r[2],
            'departure_airport_code': r[3],
            'arrival_timestamp': r[4],
            'arrival_airport_code': r[5],
            'base_price': r[6],
            'status': r[7],
            'airplane': {
                'id': r[8],
                'seats': r[9],
                'manufacturer': r[10]
            }
        })
    return jsonify({'flights': flights}), 200

@flights_api.route('/create', methods=['POST'])

def create_flight():
    """
    Create a new flight (header-based role check, no login required).
    Requires 'X-User-Id' and 'X-User-Role' headers.
    """
    user_id = request.headers.get('X-User-Id')
    user_role = request.headers.get('X-User-Role')

    if not user_id or user_role != 'staff':
        return jsonify({'msg': 'staff only'}), 403

    try:
        data = request.get_json() or {}

        # Manual parsing
        airline_name = str(data.get('airline_name', '')).strip()
        flight_number = str(data.get('flight_number', '')).strip()
        airplane_ID = str(data.get('airplane_ID', '')).strip()
        departure_timestamp = str(data.get('departure_timestamp', '')).strip()
        arrival_timestamp = str(data.get('arrival_timestamp', '')).strip()
        departure_airport_code = str(data.get('departure_airport_code', '')).strip()
        arrival_airport_code = str(data.get('arrival_airport_code', '')).strip()
        base_price = float(data.get('base_price', 0))
        operating_airline_name= str(data.get('airline_name', '')).strip()
    except Exception as e:
        return jsonify({'msg': f'invalid input: {e}'}), 400

    # Basic validation
    if not all([airline_name, flight_number, airplane_ID, departure_timestamp, arrival_timestamp, departure_airport_code, arrival_airport_code]):
        return jsonify({'msg': 'missing field'}), 422

    conn = getdb()
    cur = conn.cursor()

    try:
        cur.execute(
            "INSERT INTO flight (airline_name, flight_number, operating_airline_name, departure_timestamp, departure_airport_code, "
            "arrival_timestamp, arrival_airport_code, base_price, airplane_ID) "
            "VALUES (%s, %s,%s, %s, %s, %s, %s, %s, %s)",
            (airline_name, flight_number,operating_airline_name, departure_timestamp, departure_airport_code,
             arrival_timestamp, arrival_airport_code, base_price, airplane_ID)
        )
        conn.commit()
    except Exception as e:
        conn.rollback()
        cur.close(); conn.close()
        print("❌ Flight insert error:", e)
        return jsonify({'msg': 'duplicate or invalid'}), 409

    cur.close(); conn.close()
    return jsonify({'msg': 'flight created'}), 201


@flights_api.route('/status', methods=['POST'])
def update_status():
    """
    Update flight status (requires staff role via headers).
    Headers: X-User-Id, X-User-Role
    Body: airline_name, flight_number, departure_timestamp, status
    """
    valid_status = ["scheduled", "ontime", "delayed", "departed", "arrived"]

    user_id = request.headers.get('X-User-Id')
    user_role = request.headers.get('X-User-Role')

    if not user_id or user_role != 'staff':
        return jsonify({'msg': 'staff only'}), 403
    

    try:
        data = request.get_json() or {}
        airline_name = str(data.get('airline_name', '')).strip()
        flight_number = str(data.get('flight_number', '')).strip()
        # Parse incoming string and extract date part only (YYYY-MM-DD)
        departure_timestamp_raw = str(data.get('departure_timestamp', '')).strip()
        try:
            departure_timestamp = datetime.fromisoformat(departure_timestamp_raw).date().isoformat()
        except ValueError:
            return jsonify({'msg': 'Invalid departure_timestamp format, expected ISO datetime'}), 400
        status = str(data.get('status', '')).strip()
        print(departure_timestamp)
    except Exception as e:
        return jsonify({'msg': f'invalid input: {e}'}), 400

    if not all([airline_name, flight_number, departure_timestamp, status]):
        return jsonify({'msg': 'missing field'}), 422
    if status not in valid_status:
        return jsonify({'msg': 'invalid status'}), 409

    conn = getdb(); cur = conn.cursor()
    try:
        print(status)
        print(airline_name)
        print(flight_number)
        print(departure_timestamp)
        cur.execute(
            "UPDATE flight SET status = %s "
            "WHERE airline_name = %s AND flight_number = %s AND DATE(departure_timestamp) = %s",
            (status, airline_name, flight_number, departure_timestamp)
        )

        conn.commit()
    except Exception as e:
        conn.rollback()
        cur.close(); conn.close()
        print("❌ Status update error:", e)
        return jsonify({'msg': 'update failed'}), 500

    cur.close(); conn.close()
    return jsonify({'msg': 'status updated'}), 202




@flights_api.route('/future', methods=['GET'])
def future_flights():
    """
    Public: search future flights (one-way/round-trip).
    Accepts query params:
      - source_airport, destination_airport
      - departure_date (optional, YYYY-MM-DD)
      - return_date (optional, YYYY-MM-DD)
    If no filters are given, return ALL future flights.
    """
    print("✅ Reached /future route")

    # Parse parameters manually
    source_airport = request.args.get('source_airport')
    destination_airport = request.args.get('destination_airport')
    departure_date = request.args.get('departure_date')
    return_date = request.args.get('return_date')

    now = datetime.now()
    conn = getdb()
    cur = conn.cursor(dictionary=True)

    # --- Outbound Flight Query ---
    outbound_sql = " WHERE f.departure_timestamp >= %s"
    outbound_params = [now]

    if source_airport:
        outbound_sql += " AND f.departure_airport_code = %s"
        outbound_params.append(source_airport)
    if destination_airport:
        outbound_sql += " AND f.arrival_airport_code = %s"
        outbound_params.append(destination_airport)
    if departure_date:
        outbound_sql += " AND DATE(f.departure_timestamp) = %s"
        outbound_params.append(departure_date)

    print("🧪 Outbound SQL:", outbound_sql)
    print("🧪 Outbound PARAMS:", outbound_params)

    cur.execute(f"""
        SELECT * FROM flight f
        JOIN airplane a ON a.airplane_ID = f.airplane_ID AND a.owner_name = f.airline_name
        JOIN airport dep ON dep.code = f.departure_airport_code
        JOIN airport arr ON arr.code = f.arrival_airport_code
        {outbound_sql}
    """, tuple(outbound_params))
    response = {'flights_to': cur.fetchall()}

    # --- Return Flight Query (optional) ---
    if return_date:
        return_sql = " WHERE f.departure_timestamp >= %s"
        return_params = [now]

        if source_airport:
            return_sql += " AND f.arrival_airport_code = %s"
            return_params.append(source_airport)
        if destination_airport:
            return_sql += " AND f.departure_airport_code = %s"
            return_params.append(destination_airport)
        return_sql += " AND DATE(f.departure_timestamp) = %s"
        return_params.append(return_date)

        print("🧪 Return SQL:", return_sql)
        print("🧪 Return PARAMS:", return_params)

        cur.execute(f"""
            SELECT * FROM flight f
            JOIN airplane a ON a.airplane_ID = f.airplane_ID AND a.owner_name = f.airline_name
            JOIN airport dep ON dep.code = f.departure_airport_code
            JOIN airport arr ON arr.code = f.arrival_airport_code
            {return_sql}
        """, tuple(return_params))
        response['flights_from'] = cur.fetchall()

    cur.close()
    conn.close()
    return jsonify(response), 200



@flights_api.route('/schedule', methods=['GET'])

def schedule():
    """
    Customer or staff flight schedule (their own bookings).
    Requires param: type, email, optional filters.
    """
    try:
        params = utility.convertParams(
            request.args,
            {
                'email':'email','type':'type','start_date?':'start_date','end_date?':'end_date',
                'destination_city?':'destination_city','destination_airport?':'destination_airport',
                'source_city?':'source_city','source_airport?':'source_airport','airline?':'airline'
            },
            auto_date=True
        )
    except:
        return jsonify({'msg':'invalid field'}),422
    if params is False:
        return jsonify({'msg':'missing field'}),422
    # role match
    if params['type'] != current_user.role:
        return jsonify({'msg':'user type not match'}),403
    conn = getdb(); cur = conn.cursor(dictionary=True)
    # Customer path
    if current_user.role=='customer':
        if params['email'] != current_user.id:
            return jsonify({'msg':'can only view own flights'}),403
        sel = utility.createSqlQuery([
            {'name':'start_date','selector':'DATE(f.departure_timestamp)>=%s'},
            {'name':'end_date','selector':'DATE(f.departure_timestamp)<=%s'},
            {'name':'source_city','selector':'dep.city=%s'},
            {'name':'source_airport','selector':'f.departure_airport_code=%s'},
            {'name':'destination_city','selector':'arr.city=%s'},
            {'name':'destination_airport','selector':'f.arrival_airport_code=%s'}
        ],params)
        query = f"WITH tp AS (SELECT t.ticket_ID,t.email,t.rating,t.comment,f.* FROM ticket t JOIN flight f ON f.flight_number=t.flight_number AND f.departure_timestamp=t.departure_timestamp AND f.airline_name=t.airline_name WHERE t.email=%(email)s) " \
                f"SELECT tp.*, a.seats, a.manufacturer, dep.city as src_city, arr.city as dst_city {sel}"
        cur.execute(query,params)
        flights = cur.fetchall(); cur.close(); conn.close()
        return jsonify({'flights':flights}),200
    # Staff path
    elif current_user.role == 'staff':
        # Must specify airline to view
        if 'airline' not in params or not params['airline']:
            return jsonify({'msg': 'missing field'}), 422
        # Authorization: staff only for their airline
        conn = getdb()
        cur = conn.cursor()
        staff_airline = utility.getStaff(cur, current_user.id, 'employer_name')
        if not staff_airline or staff_airline[0] != params['airline']:
            cur.close(); conn.close()
            return jsonify({'msg': 'Not authorized for this airline'}), 403

        # Build filters
        selector = utility.createSqlQuery([
            {'name':'start_date','selector':'DATE(f.departure_timestamp) >= %s'},
            {'name':'end_date','selector':'DATE(f.departure_timestamp) <= %s'},
            {'name':'source_city','selector':'dep.city = %s'},
            {'name':'source_airport','selector':'f.departure_airport_code = %s'},
            {'name':'destination_city','selector':'arr.city = %s'},
            {'name':'destination_airport','selector':'f.arrival_airport_code = %s'},
        ], params)

        # Query purchases + flight details
        query = f"""
            SELECT p.ticket_ID, p.email, p.rating, p.comment,
                   f.airline_name, f.flight_number, f.departure_timestamp,
                   f.departure_airport_code, f.arrival_timestamp,
                   f.arrival_airport_code, f.base_price, f.status,
                   a.airplane_ID, a.seats, a.manufacturer
            FROM purchases p
            JOIN ticket t ON t.ticket_ID = p.ticket_ID
            JOIN flight f ON f.flight_number = t.flight_number
                AND f.departure_timestamp = t.departure_timestamp
                AND f.airline_name = t.airline_name
            JOIN airplane a ON a.airplane_ID = f.airplane_ID
                AND a.owner_name = f.airline_name
            JOIN airport dep ON dep.code = f.departure_airport_code
            JOIN airport arr ON arr.code = f.arrival_airport_code
            WHERE f.airline_name = %(airline)s {selector}
        """
        cur.execute(query, params)
        rows = cur.fetchall()
        cur.close(); conn.close()

        # Format response
        flights = []
        for r in rows:
            flights.append({
                'ticket_id': r[0],
                'customer_email': r[1],
                'rating': r[2],
                'comment': r[3],
                'airline_name': r[4],
                'flight_number': r[5],
                'departure_timestamp': r[6],
                'departure_airport_code': r[7],
                'arrival_timestamp': r[8],
                'arrival_airport_code': r[9],
                'base_price': r[10],
                'status': r[11],
                'airplane': {
                    'id': r[12],
                    'seats': r[13],
                    'manufacturer': r[14]
                }
            })
        return jsonify({'flights': flights}), 200
    abort(501)  # rip


# note to self: or QUESTIONS FOR DEY 4/27
    """
    1. by default show the future flights for customer
    customer can also see their past reviews / comments on past flights
    staff can see all flights for their airline, including past ones
    
    2. do i need to add a filter function for flights? what does "multiple views mean"??
    customers can also see other ratings and comments for flights (public or their own?? or only staff can see it also??)
    - only customer themselves and staff can see the reviews?
    
    3. staff can see their future flights up to 30 days by default, show by employer, airline
    
    4. what is pID referring to? the customer username?
    what flask examples?? is that in brightspace??
    i've just been generating random passkeys for each session bruhh
    
    5. sql injection protection & normalization stuff
    which files do i need to be careful about this?
    idk ask more about what this instruction means (hi prof, please be more specific & give example if possible ASAP)
    
    6. what should a user dashboard look like? have a navbar with all the functions?
    what should a staff dashboard look like? can he (prof ratan) draw us a mockup or diagram somehow lol
    oh yeah how should user purchase tickets - does he want a separate page for each action (navbar) or just reload the components
    
    
    7. [HELP AHH] VIEW REPORTS - STAFF ONLY (I DIDN'T DO THIS YET AHHH - JW)
    . View reports: Total amounts of ticket sold based on range of dates/last year/last month etc. 
    . Month-wise tickets sold in a bar chart/table. 
    Question: is this for unique sold, the purchase date or the flight date?
    How to: Count entries in ticket table based on last year, last month
    can we just ask prof how to do this and where to put this
    """