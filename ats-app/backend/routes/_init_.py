# makes routes folder a package, so it can be imported and executed at once hopefully
from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
__all__ = [
    'auth', 'airplanes', 'airports', 'customers',
    'flights', 'public_flights', 'purchases', 'tickets'
]