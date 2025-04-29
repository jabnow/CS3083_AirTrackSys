from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from db import getdb
import utility
from datetime import datetime

reports_api = Blueprint('reports_bp', __name__, url_prefix='/api/reports')

@reports_api.route('/tickets_sold', methods=['GET'])
@login_required
def tickets_sold_report():
    """
    Staff-only: returns monthly ticket counts between from_month and to_month queries (inclusive).
    """
    # Authorization
    if getattr(current_user, 'role', None) != 'staff':
        return jsonify({'msg': 'staff only'}), 403

    from_month = request.args.get('from_month')
    to_month   = request.args.get('to_month')
    if not from_month or not to_month:
        return jsonify({'msg': 'from_month and to_month are required'}), 422
    try:
        # utility.convertMonth returns 'YYYY-MM'
        fm = utility.convertMonth(from_month)
        tm = utility.convertMonth(to_month)
        if not fm or not tm:
            raise ValueError()
    except:
        return jsonify({'msg': 'invalid month format'}), 422

    params = {'from_month': fm, 'to_month': tm}

    # Query database
    conn = getdb()
    cur = conn.cursor()
    cur.execute(
        """
        SELECT DATE_FORMAT(purchase_timestamp, '%%Y-%%m') AS month,
               COUNT(*) AS tickets_sold
          FROM Purchases
         WHERE DATE_FORMAT(purchase_timestamp, '%%Y-%%m') >= %(from_month)s
           AND DATE_FORMAT(purchase_timestamp, '%%Y-%%m') <= %(to_month)s
         GROUP BY month
         ORDER BY month
        """,
        params
    )
    rows = cur.fetchall()
    cur.close()
    conn.close()

    # Build a dict for quick lookup
    counts = {row[0]: row[1] for row in rows}

    # Generate full month list
    def next_month(ym: str) -> str:
        year, month = map(int, ym.split('-'))
        if month == 12:
            return f"{year+1:04d}-01"
        else:
            return f"{year:04d}-{month+1:02d}"

    response = {'tickets_sold': []}
    current = fm
    # Loop inclusive
    while current <= tm:
        response['tickets_sold'].append({
            'month': current,
            'count': counts.get(current, 0)
        })
        current = next_month(current)

    return jsonify(response), 200

@reports_api.route('/tickets_sold_by_flight', methods=['GET'])
@login_required
def tickets_sold_by_flight():
    """
    Staff-only report: returns month-wise ticket counts for each flight between from_month and to_month.
    Query params:
      - from_month (YYYY-MM)
      - to_month   (YYYY-MM)
    """
    # Authorization
    if getattr(current_user, 'role', None) != 'staff':
        return jsonify({'msg': 'staff only'}), 403

    from_month = request.args.get('from_month')
    to_month   = request.args.get('to_month')
    if not from_month or not to_month:
        return jsonify({'msg': 'from_month and to_month are required'}), 422
    try:
        fm = utility.convertMonth(from_month)
        tm = utility.convertMonth(to_month)
        if not fm or not tm:
            raise ValueError()
    except:
        return jsonify({'msg': 'invalid month format'}), 422

    params = {'from_month': fm, 'to_month': tm}

    # Query database
    conn = getdb()
    cur = conn.cursor()
    cur.execute(
        """
        SELECT p.airline_name, p.ticket_ID, t.flight_number,
               DATE_FORMAT(p.purchase_timestamp, '%%Y-%%m') AS month,
               COUNT(*) AS tickets_sold
          FROM purchases p
          JOIN ticket t ON t.ticket_ID = p.ticket_ID
         WHERE DATE_FORMAT(p.purchase_timestamp, '%%Y-%%m') >= %(from_month)s
           AND DATE_FORMAT(p.purchase_timestamp, '%%Y-%%m') <= %(to_month)s
         GROUP BY p.airline_name, t.flight_number, month
         ORDER BY t.flight_number, month
        """,
        params
    )
    rows = cur.fetchall()
    cur.close()
    conn.close()

    # Organize by flight
    report = {}
    for airline, ticket_id, flight_no, month, count in rows:
        key = f"{airline}-{flight_no}"
        if key not in report:
            report[key] = {
                'airline_name': airline,
                'flight_number': flight_no,
                'counts': {}
            }
        report[key]['counts'][month] = count
        
    output = []
    # Generate full month sequence
    def next_month(ym: str) -> str:
        year, mon = map(int, ym.split('-'))
        if mon == 12:
            return f"{year+1:04d}-01"
        else:
            return f"{year:04d}-{mon+1:02d}"

    for flight_key, data in report.items():
        months = []
        current = fm
        while current <= tm:
            months.append({
                'month': current,
                'count': data['counts'].get(current, 0)
            })
            current = next_month(current)
        output.append({
            'airline_name': data['airline_name'],
            'flight_number': data['flight_number'],
            'monthly_sales': months
        })

    return jsonify({'flights': output}), 200