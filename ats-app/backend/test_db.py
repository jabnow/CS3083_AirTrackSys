from db import getdb

try:
    conn = getdb()
    cursor = conn.cursor()
    cursor.execute("SELECT 1")
    print("DB OK:", cursor.fetchone())
    cursor.close()
    conn.close()
except Exception as e:
    print("DB connection error:", e)