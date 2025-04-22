import os
from dotenv import load_dotenv
import mysql.connector

load_dotenv()

# Ensure this matches Config.SQL_SERVER var name
SQL_SERVER = os.getenv('SQL_SERVER', 'dev').lower()

# Consistent prefix: SQL_HOST_dev, etc.
SQL_HOST     = os.getenv(f"SQL_HOST_{SQL_SERVER}")
SQL_USER     = os.getenv(f"SQL_USER_{SQL_SERVER}")
SQL_PASSWORD = os.getenv(f"SQL_PASSWORD_{SQL_SERVER}")
# default to your actual DB name
SQL_DB       = os.getenv(f"SQL_DB_{SQL_SERVER}", 'air_ticket_reservation')


def get_db():
    """Return a new MySQL connection using environment-configured credentials."""
    return mysql.connector.connect(
        host     = SQL_HOST,
        user     = SQL_USER,
        password = SQL_PASSWORD,
        database = SQL_DB,
    )