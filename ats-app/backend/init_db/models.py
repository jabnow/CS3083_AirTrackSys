# backend/models.py
# Data-access layer for Air Ticket Reservation System using mysql-connector

from db import getdb

class Airline:
    @staticmethod
    def create(name):
        connection = getdb(); cur = connection.cursor()
        cur.execute("INSERT INTO airline(name) VALUES (%s)", (name,))
        connection.commit(); cur.close(); connection.close()

    @staticmethod
    def get(name):
        connection = getdb(); cur = connection.cursor(dictionary=True)
        cur.execute("SELECT * FROM airline WHERE name=%s", (name,))
        row = cur.fetchone(); cur.close(); connection.close()
        return row

    @staticmethod
    def all():
        connection = getdb(); cur = connection.cursor(dictionary=True)
        cur.execute("SELECT * FROM airline")
        rows = cur.fetchall(); cur.close(); connection.close()
        return rows

class Airport:
    @staticmethod
    def create(code, name, city, country):
        connection = getdb(); cur = connection.cursor()
        cur.execute(
            "INSERT INTO airport(code, name, city, country) VALUES(%s,%s,%s,%s)",
            (code, name, city, country)
        )
        connection.commit(); cur.close(); connection.close()

    @staticmethod
    def get(code):
        connection = getdb(); cur = connection.cursor(dictionary=True)
        cur.execute("SELECT * FROM airport WHERE code=%s", (code,))
        row = cur.fetchone(); cur.close(); connection.close()
        return row

    @staticmethod
    def all():
        connection = getdb(); cur = connection.cursor(dictionary=True)
        cur.execute("SELECT * FROM airport")
        rows = cur.fetchall(); cur.close(); connection.close()
        return rows

class AirlineStaff:
    @staticmethod
    def create(username, employer_name, password, first_name, last_name, date_of_birth):
        connection = getdb(); cur = connection.cursor()
        cur.execute(
            "INSERT INTO airline_staff(username, employer_name, password, first_name, last_name, date_of_birth)"
            " VALUES(%s,%s,%s,%s,%s,%s)",
            (username, employer_name, password, first_name, last_name, date_of_birth)
        )
        connection.commit(); cur.close(); connection.close()

    @staticmethod
    def get(username):
        connection = getdb(); cur = connection.cursor(dictionary=True)
        cur.execute("SELECT * FROM airline_staff WHERE username=%s", (username,))
        row = cur.fetchone(); cur.close(); connection.close()
        return row

class StaffEmail:
    @staticmethod
    def add(username, email):
        connection = getdb(); cur = connection.cursor()
        cur.execute("INSERT INTO Staff_Email(username, email) VALUES(%s,%s)", (username, email))
        connection.commit(); cur.close(); connection.close()

    @staticmethod
    def get_by_staff(username):
        connection = getdb(); cur = connection.cursor(dictionary=True)
        cur.execute("SELECT email FROM Staff_Email WHERE username=%s", (username,))
        rows = cur.fetchall(); cur.close(); connection.close()
        return [r['email'] for r in rows]

class StaffPhone:
    @staticmethod
    def add(username, phone_number):
        connection= getdb(); cur = connection.cursor()
        cur.execute("INSERT INTO Staff_Phone(username,phone_number) VALUES(%s,%s)", (username, phone_number))
        connection.commit(); cur.close(); connection.close()

    @staticmethod
    def get_by_staff(username):
        connection= getdb(); cur = connection.cursor(dictionary=True)
        cur.execute("SELECT phone_number FROM Staff_Phone WHERE username=%s", (username,))
        rows = cur.fetchall(); cur.close(); connection.close()
        return [r['phone_number'] for r in rows]

class Airplane:
    @staticmethod
    def create(airplane_ID, owner_name, seats, manufacturer):
        connection= getdb(); cur = connection.cursor()
        cur.execute(
            "INSERT INTO Airplane(airplane_ID, owner_name, seats, manufacturer) VALUES(%s,%s,%s,%s)",
            (airplane_ID, owner_name, seats, manufacturer)
        )
        connection.commit(); cur.close(); connection.close()

    @staticmethod
    def get(airplane_ID, owner_name):
        connection= getdb(); cur = connection.cursor(dictionary=True)
        cur.execute(
            "SELECT * FROM Airplane WHERE airplane_ID=%s AND owner_name=%s",
            (airplane_ID, owner_name)
        )
        row = cur.fetchone(); cur.close(); connection.close()
        return row

    @staticmethod
    def all_by_owner(owner_name):
        connection= getdb(); cur = connection.cursor(dictionary=True)
        cur.execute("SELECT * FROM Airplane WHERE owner_name=%s", (owner_name,))
        rows = cur.fetchall(); cur.close(); connection.close()
        return rows

class Flight:
    @staticmethod
    def create(**kwargs):
        cols = ",".join(kwargs.keys())
        vals = ",".join(["%s"]*len(kwargs))
        sql = f"INSERT INTO Flight({cols}) VALUES({vals})"
        connection= getdb(); cur = connection.cursor()
        cur.execute(sql, tuple(kwargs.values()))
        connection.commit(); cur.close(); connection.close()

    @staticmethod
    def get(flight_number, departure_timestamp, airline_name):
        connection= getdb(); cur = connection.cursor(dictionary=True)
        cur.execute(
            "SELECT * FROM Flight WHERE flight_number=%s AND departure_timestamp=%s AND airline_name=%s",
            (flight_number, departure_timestamp, airline_name)
        )
        row = cur.fetchone(); cur.close(); connection.close()
        return row

    @staticmethod
    def all():
        connection= getdb(); cur = connection.cursor(dictionary=True)
        cur.execute("SELECT * FROM Flight")
        rows = cur.fetchall(); cur.close(); connection.close()
        return rows

class Customer:
    @staticmethod
    def create(**kwargs):
        cols = ",".join(kwargs.keys())
        vals = ",".join(["%s"]*len(kwargs))
        sql = f"INSERT INTO Customer({cols}) VALUES({vals})"
        connection= getdb(); cur = connection.cursor()
        cur.execute(sql, tuple(kwargs.values()))
        connection.commit(); cur.close(); connection.close()

    @staticmethod
    def get(email):
        connection= getdb(); cur = connection.cursor(dictionary=True)
        cur.execute("SELECT * FROM Customer WHERE email=%s", (email,))
        row = cur.fetchone(); cur.close(); connection.close()
        return row

class Ticket:
    @staticmethod
    def create(**kwargs):
        cols = ",".join(kwargs.keys())
        vals = ",".join(["%s"]*len(kwargs))
        sql = f"INSERT INTO Ticket({cols}) VALUES({vals})"
        connection= getdb(); cur = connection.cursor()
        cur.execute(sql, tuple(kwargs.values()))
        connection.commit(); cur.close(); connection.close()

    @staticmethod
    def get(ticket_ID):
        connection= getdb(); cur = connection.cursor(dictionary=True)
        cur.execute("SELECT * FROM Ticket WHERE ticket_ID=%s", (ticket_ID,))
        row = cur.fetchone(); cur.close(); connection.close()
        return row

class PaymentInfo:
    @staticmethod
    def create(card_number, card_type, card_expiration_date, name_on_card):
        connection= getdb(); cur = connection.cursor()
        cur.execute(
            "INSERT INTO payment_info(card_number, card_type, card_expiration_date, name_on_card)"
            " VALUES(%s,%s,%s,%s)",
            (card_number, card_type, card_expiration_date, name_on_card)
        )
        connection.commit(); cur.close(); connection.close()

    @staticmethod
    def get(card_number):
        connection= getdb(); cur = connection.cursor(dictionary=True)
        cur.execute("SELECT * FROM payment_info WHERE card_number=%s", (card_number,))
        row = cur.fetchone(); cur.close(); connection.close()
        return row

class Purchases:
    @staticmethod
    def create(email, ticket_ID, card_number, comment, rating, purchase_timestamp):
        connection= getdb(); cur = connection.cursor()
        cur.execute(
            "INSERT INTO Purchases(email, ticket_ID, card_number, comment, rating, purchase_timestamp)"
            " VALUES(%s,%s,%s,%s,%s,%s)",
            (email, ticket_ID, card_number, comment, rating, purchase_timestamp)
        )
        connection.commit(); cur.close(); connection.close()

    @staticmethod
    def get_by_customer(email):
        connection = getdb(); cur = connection.cursor(dictionary=True)
        cur.execute("SELECT * FROM Purchases WHERE email=%s", (email,))
        rows = cur.fetchall(); cur.close(); connection.close()
        return rows