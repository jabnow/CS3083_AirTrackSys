# utility functions

# formatting dates
from dateutil import parser, relativedelta
import datetime

def convertDate(date_string):
    """
    Convert a date string to a date object.
    """
    try:
        return parser.parse(date_string).strftime("%Y-%m-%d")
    except ValueError:
        return None
    
def convert_Datetime(date_string):
    """
    Convert a date string to a datetime object.
    """
    try:
        return parser.parse(date_string).strftime("%Y-%m-%d %H:%M:%S")
    except ValueError:
        return None

def convert_Month(date_string):
    """
    Convert a date string to a month object.
    """
    try:
        return parser.parse(date_string).strftime("%Y-%m")
    except ValueError:
        return None
    
    
def convert_body(input_json: dict, field_map: dict, auto_date: bool = False) -> dict:
    """
    Rename and validate fields from input_json according to field_map.
    field_map keys are expected in input_json; values are target names.
    If auto_date=True, fields ending in '_date' will be parsed as ISO dates.

    Returns a new dict with mapped keys, or False if a field is missing.
    Raises ValueError on invalid date formats when auto_date is enabled.
    """
    result = {}
    for input_field, target_field in field_map.items():
        if input_field not in input_json:
            return False
        value = input_json[input_field]
        if auto_date and input_field.lower().endswith('_date'):
            # parse ISO8601 date or datetime
            try:
                # Accept both date and datetime strings
                parsed = datetime.datetime.fromisoformat(value)
            except Exception as e:
                raise ValueError(f"Invalid date format for '{input_field}': {e}")
            result[target_field] = parsed
        else:
            result[target_field] = value
    return result


def get_staff(cursor, username: str, field_name: str) -> str:
    """
    Query the Airline_Staff table for a specific field of a given username.
    Returns single value or None.
    """
    query = f"SELECT {field_name} FROM Airline_Staff WHERE username = %s"
    cursor.execute(query, (username,))
    return cursor.fetchone()