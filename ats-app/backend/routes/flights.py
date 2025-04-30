# backend/routes/flights.py
from flask import Blueprint, request, jsonify, abort
from flask_login import login_required, current_user
from db import getdb
import utility
from datetime import datetime
# from ..constant import valid_status
from flask import current_app


# Blueprint for flight management
flights_api = Blueprint('flights_api', __name__, url_prefix='/api/flights')

@flights_api.route('/', methods=['GET'])
@login_required
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

@flights_api.route('/', methods=['POST'])
@login_required
def create_flight():
    """
    Staff-only: create a new flight.
    """

    try:
        body = utility.convertBody(
            request.get_json() or {},
            {
                'airline_name': 'airline_name',
                'flight_number': 'flight_number',
                'operating_airline_name': 'operating_airline_name',
                'airplane_ID': 'airplane_ID',
                'departure_timestamp': 'departure_timestamp',
                'arrival_airport_code': 'arrival_airport_code',
                'departure_airport_code': 'departure_airport_code',
                'arrival_timestamp': 'arrival_timestamp',
                'base_price': 'base_price',
                'status': 'status'
            },
            auto_date=True
        )
    except:
        return jsonify({'msg': 'invalid field'}), 422
    if body is False:
        return jsonify({'msg': 'missing field'}), 422

    # Authorization
    if getattr(current_user, 'role', None) != 'staff':
        return jsonify({'msg': 'staff only'}), 403
    conn = getdb()
    cur = conn.cursor()
    
    # Check airline ownership
    staff_airline = utility.getStaff(cur, current_user.id, 'employer_name')
    if not staff_airline or staff_airline[0] != body['airline_name']:
        cur.close(); conn.close()
        return jsonify({'msg': 'Not authorized'}), 403

    # Insert flight
    try:
        cur.execute(
            "INSERT INTO flight(airline_name,flight_number,departure_timestamp,departure_airport_code,"
            "arrival_timestamp,arrival_airport_code,base_price,status,airplane_ID)"
            " VALUES(%(airline_name)s,%(flight_number)s,%(departure_timestamp)s,%(departure_airport_code)s,"
            "%(arrival_timestamp)s,%(arrival_airport_code)s,%(base_price)s,'scheduled',%(airplane_ID)s)",
            body
        )
        conn.commit()
    except Exception:
        conn.rollback()
        cur.close(); conn.close()
        return jsonify({'msg': 'duplicate or invalid'}), 409
    cur.close(); conn.close()
    return jsonify({'msg': 'flight created'}), 201

@flights_api.route('/status', methods=['POST'])
@login_required
def update_status():
    """
    Staff-only: update flight status.
    Expects JSON: airline_name, flight_number, departure_timestamp, status
    """
    valid_status = ["scheduled", "ontime", "delayed", "departed", "arrived"]
    try:
        body = utility.convertBody(
            request.get_json() or {},
            {'airline_name':'airline_name','flight_number':'flight_number',
             'departure_timestamp':'departure_timestamp','status':'status'},
            auto_date=True
        )
    except:
        return jsonify({'msg':'invalid field'}),422
    if body is False:
        return jsonify({'msg':'missing field'}),422

    if getattr(current_user,'role',None)!='staff':
        return jsonify({'msg':'staff only'}),403
    conn = getdb(); cur = conn.cursor()
    staff_airline = utility.getStaff(cur,current_user.id,'employer_name')
    if not staff_airline or staff_airline[0]!=body['airline_name']:
        cur.close(); conn.close(); return jsonify({'msg':'Not auth'}),403

    if body['status'] not in valid_status:
        cur.close(); conn.close(); return jsonify({'msg':'invalid status'}),409
    
    # Update
    cur.execute(
        "UPDATE flight SET status=%(status)s WHERE airline_name=%(airline_name)s"
        " AND flight_number=%(flight_number)s AND departure_timestamp=%(departure_timestamp)s",
        body
    )
    conn.commit(); cur.close(); conn.close()
    return jsonify({'msg':'status updated'}),202



@flights_api.route('/future', methods=['GET'])
def future_flights():
    """
    Public: search future flights (one-way/round-trip)
    Query params: source_airport, destination_airport, departure_date (optional)
    If no filters are given, return ALL future flights.
    """
    print("✅ Reached /future route")

    params = utility.convertParams(
        request.args,
        {
            'source_city?': 'source_city',
            'source_airport?': 'source_airport',
            'destination_city?': 'destination_city',
            'destination_airport?': 'destination_airport',
            'departure_date?': 'departure_date',
            'return_date?': 'return_date'
        },
        auto_date=True
    )

    if params is False:
        return jsonify({'msg': 'missing field'}), 422

    # Normalize any date fields to string
    for date_key in ['departure_date', 'return_date']:
        if date_key in params and isinstance(params[date_key], datetime):
            params[date_key] = params[date_key].date().isoformat()

    print("🛬 Parsed query params:", params)

    now = datetime.now()
    conn = getdb()
    cur = conn.cursor(dictionary=True)

    # ✈️ OUTBOUND QUERY: always filter by future timestamp
    out_sel = " WHERE f.departure_timestamp >= %s"
    out_vals = [now]

    if 'source_airport' in params:
        out_sel += " AND f.departure_airport_code = %s"
        out_vals.append(params['source_airport'])

    if 'destination_airport' in params:
        out_sel += " AND f.arrival_airport_code = %s"
        out_vals.append(params['destination_airport'])

    if 'departure_date' in params:
        out_sel += " AND DATE(f.departure_timestamp) = %s"
        out_vals.append(params['departure_date'])

    print("🧪 Outbound SQL:", out_sel)
    print("🧪 SQL PARAMS:", out_vals)

    cur.execute(f"""
        SELECT * FROM flight f
        JOIN airplane a ON a.airplane_ID = f.airplane_ID AND a.owner_name = f.airline_name
        JOIN airport dep ON dep.code = f.departure_airport_code
        JOIN airport arr ON arr.code = f.arrival_airport_code
        {out_sel}
    """, tuple(out_vals))
    response = {'flights_to': cur.fetchall()}

    # ✈️ ROUND-TRIP LOGIC (optional)
    if 'return_date' in params:
        back_sel = " WHERE f.departure_timestamp >= %s"
        back_vals = [now]

        if 'source_airport' in params:
            back_sel += " AND f.arrival_airport_code = %s"
            back_vals.append(params['source_airport'])

        if 'destination_airport' in params:
            back_sel += " AND f.departure_airport_code = %s"
            back_vals.append(params['destination_airport'])

        back_sel += " AND DATE(f.departure_timestamp) = %s"
        back_vals.append(params['return_date'])

        print("🧪 Return SQL:", back_sel)
        print("🧪 Return SQL PARAMS:", back_vals)

        cur.execute(f"""
            SELECT * FROM flight f
            JOIN airplane a ON a.airplane_ID = f.airplane_ID AND a.owner_name = f.airline_name
            JOIN airport dep ON dep.code = f.departure_airport_code
            JOIN airport arr ON arr.code = f.arrival_airport_code
            {back_sel}
        """, tuple(back_vals))
        response['flights_from'] = cur.fetchall()

    cur.close()
    conn.close()
    return jsonify(response), 200



@flights_api.route('/schedule', methods=['GET'])
@login_required
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