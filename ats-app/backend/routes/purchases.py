from flask import Blueprint, jsonify, request
from db import getdb

# 🔧 Define blueprint BEFORE route
purchases_api = Blueprint('purchases_bp', __name__, url_prefix='/api/purchases')

@purchases_api.route('/my', methods=['GET'])
def my_purchases():
  
    print("🔔 /api/purchases endpoint called")

    try:
        user_id = request.headers.get('X-User-Id') or request.args.get('id')
        print("📥 Headers received:", dict(request.headers))
        print("🧾 Query parameters:", dict(request.args))
        print("🔍 Extracted user_id:", user_id)

        if not user_id:
            return jsonify({'msg': 'Missing user id'}), 400

        conn = getdb()
        cur = conn.cursor(dictionary=True)

        cur.execute(
            "SELECT * FROM purchases p JOIN ticket t ON p.ticket_ID = t.ticket_ID WHERE p.email = %s",
            (user_id,)
        )
        rows = cur.fetchall()

        print(f"✅ Retrieved {len(rows)} rows")
        cur.close()
        conn.close()

        return jsonify({'purchases': rows}), 200

    except Exception as e:
        print("💥 Exception in /api/purchases:", str(e))
        return jsonify({'msg': 'Server error', 'error': str(e)}), 500
