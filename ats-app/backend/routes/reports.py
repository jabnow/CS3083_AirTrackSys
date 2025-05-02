from flask import Blueprint, request, jsonify
from db import getdb
from datetime import datetime

reports_api = Blueprint('reports_bp', __name__, url_prefix='/api/reports')

def parse_month(month_str):
    try:
        datetime.strptime(month_str, "%Y-%m")
        return month_str
    except Exception:
        return None

@reports_api.route('/tickets_sold', methods=['GET'])
def tickets_sold_report():


    from_month = parse_month(request.args.get('from_month', ''))
    to_month = parse_month(request.args.get('to_month', ''))
    if not from_month or not to_month:
        return jsonify({'msg': 'invalid month format'}), 422

    params = {'from_month': from_month, 'to_month': to_month}
    conn = getdb(); cur = conn.cursor()
    cur.execute(
        """
        SELECT  p.ticket_ID, t.flight_number,
            DATE_FORMAT(p.purchase_timestamp, '%Y-%m') AS month,
            COUNT(*) AS tickets_sold
        FROM purchases p
        JOIN ticket t ON t.ticket_ID = p.ticket_ID
        WHERE DATE_FORMAT(p.purchase_timestamp, '%Y-%m') BETWEEN %(from_month)s AND %(to_month)s
        GROUP BY t.airline_name, t.flight_number, month
        ORDER BY t.flight_number, month
        """, params
    )

    rows = cur.fetchall(); cur.close(); conn.close()
    print(rows)
    print("why why why")
    

    month_totals = {}
    for _, _, month, count in rows:
        if month not in month_totals:
            month_totals[month] = 0
        month_totals[month] += count

    # Fill missing months with 0
    def next_month(ym):
        y, m = map(int, ym.split('-'))
        return f"{y+1}-01" if m == 12 else f"{y:04d}-{m+1:02d}"

    result = {'tickets_sold': []}
    current = from_month
    while current <= to_month:
        result['tickets_sold'].append({
            'month': current,
            'count': month_totals.get(current, 0)
        })
        current = next_month(current)

    return jsonify(result), 200

@reports_api.route('/tickets_sold_by_flight', methods=['GET'])
def tickets_sold_by_flight():


    from_month = parse_month(request.args.get('from_month', ''))
    to_month = parse_month(request.args.get('to_month', ''))
    if not from_month or not to_month:
        return jsonify({'msg': 'invalid month format'}), 422

    params = {'from_month': from_month, 'to_month': to_month}
    conn = getdb(); cur = conn.cursor()
    print(from_month)
    print(to_month)
    cur.execute(
        """
        SELECT t.flight_number,
               DATE_FORMAT(p.purchase_timestamp, '%Y-%m') AS month,
               COUNT(*) AS tickets_sold
        FROM purchases p
        JOIN ticket t ON t.ticket_ID = p.ticket_ID
        WHERE DATE_FORMAT(p.purchase_timestamp, '%Y-%m') BETWEEN %(from_month)s AND %(to_month)s
        GROUP BY t.flight_number, month
        ORDER BY t.flight_number, month
        """, params
    )
    rows = cur.fetchall(); cur.close(); conn.close()
    print("hi")
    for row in rows:
        print(row)

    def next_month(ym):
        y, m = map(int, ym.split('-'))
        return f"{y+1}-01" if m == 12 else f"{y:04d}-{m+1:02d}"

    report = {}
    for flight_no, month, count in rows:
        key = f"{flight_no}"
        report.setdefault(key, {
            'flight_number': flight_no,
            'counts': {}
        })['counts'][month] = count

    flights = []
    for data in report.values():
        current = from_month
        monthly = []
        while current <= to_month:
            monthly.append({
                'month': current,
                'count': data['counts'].get(current, 0)
            })
            current = next_month(current)
        flights.append({
            'flight_number': data['flight_number'],
            'monthly_sales': monthly
        })

    return jsonify({'flights': flights}), 200
