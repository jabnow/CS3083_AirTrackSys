# schema for data and filtering
from flask_login import UserMixin
from app import db
from datetime import datetime

class Airline(db.Model):
    _tablename__ = 'airline'
    name = db.Column(db.String(100), primary_key=True)
    
# see DDL.sql and convert the rest of the tables to models (please somebody else do this TT - JW)

class Airport(db.Model):    
    ...
    
class AirlineStaff(db.Model, UserMixin):    
    __tablename__ = 'Airline_Staff'
    username      = db.Column(db.String(50), primary_key=True)
    employer_name = db.Column(db.String(50), db.ForeignKey('Airline.name'))
    password      = db.Column(db.String(128), nullable=False)
    first_name    = db.Column(db.String(50))
    last_name     = db.Column(db.String(50))
    date_of_birth = db.Column(db.Date)
    # add a simple 'role' property for uniform access
    @property
    def role(self):
        return 'staff'
    
class StaffEmail(db.Model):    
    ...

class StaffPhone(db.Model):    
    ...

class Airplane(db.Model):    
    __tablename__ = 'airplane'
    # Composite primary key on airplane_ID and owner_name
    airplane_ID   = db.Column(db.String(20), primary_key=True)
    owner_name    = db.Column(
        db.String(100),
        db.ForeignKey('airline.name'),
        primary_key=True,
        nullable=False
    )
    seats         = db.Column(db.Integer, nullable=False)
    manufacturer  = db.Column(db.String(100), nullable=False)

    
class Flight(db.Model):
    ...

class Customer(db.Model, UserMixin):    
    ...

class Ticket(db.Model):    
    ...

class PaymentInfo(db.Model):    
    ...

class Purchases(db.Model):    
    ...
