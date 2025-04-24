import os
from db import admin_connection, app_connection

"""
Resets the MySQL database by dropping any existing schema and
loading schema and data from DDL.sql and inserts.sql.
"""

SQL_DIR = os.path.dirname(os.path.abspath(__file__))
DDL_FILE  = os.path.join(SQL_DIR, 'DDL.sql')
DATA_FILE = os.path.join(SQL_DIR, 'inserts.sql')

def runSqlFile(cursor, file_path):
    """
    Read the sql files, execute statements up to each ';' and commit.
    """
    with open(file_path, 'r', encoding='utf-8') as f:
        sql = f.read()
    for stmt in sql.split(';'):
        stmt = stmt.strip()
        if stmt:
            cursor.execute(stmt)
            
            
def main():
    cursor = admin_connection.cursor()
    # Drop, remake DB
    cursor.execute('DROP DATABASE IF EXISTS air_traffic_reservation_system')
    cursor.execute('CREATE DATABASE air_traffic_reservation_system')
    cursor.execute('USE air_traffic_reservation_system')

    # Load DDL and DATA
    runSqlFile(cursor, DDL_FILE)
    runSqlFile(cursor, DATA_FILE)
    admin_connection.commit()

    cursor.close()
    admin_connection.close()
    print('Database has been successfully reset!')
    
    
if __name__=='__main__':
    main()