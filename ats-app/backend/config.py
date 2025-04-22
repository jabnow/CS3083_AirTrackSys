import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'change-me')
    SQL_SERVER   = os.getenv('SQL_SERVER', 'dev').lower()

    # Consistent prefix: SQL_HOST_dev, SQL_USER_dev, SQL_PASSWORD_dev, SQL_DB_dev
    SQL_HOST     = os.getenv(f"SQL_HOST_{SQL_SERVER}")
    SQL_USER     = os.getenv(f"SQL_USER_{SQL_SERVER}")
    SQL_PASSWORD = os.getenv(f"SQL_PASSWORD_{SQL_SERVER}")
    SQL_DB       = os.getenv(f"SQL_DB_{SQL_SERVER}", 'air_traffic_reservation_system') # change "ats" to your database name

    SQLALCHEMY_DATABASE_URI = (
        # mysql+mysqlconnector://username:password@localhost/db_name
        f"mysql+mysqlconnector://{SQL_USER}:{SQL_PASSWORD}@{SQL_HOST}/{SQL_DB}"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False