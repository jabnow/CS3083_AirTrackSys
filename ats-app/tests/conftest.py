# import pytest
from backend.db import getdb

# check if connection can be made to MYSQL
# pass condition: is run bash: pytest -q

def test_mysql_connection():
    conn = getdb()
    cur = conn.cursor()
    cur.execute("SELECT 1")
    result = cur.fetchone()
    cur.close()
    conn.close()
    assert result[0] == 1
