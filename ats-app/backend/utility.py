# utility functions

# formatting dates
from dateutil import parser, relativedelta
import datetime


def createSqlQuery(scheme: list, fields: dict):
    sql = ""

    for item in scheme:
        if item["name"] not in fields:
            continue

        selector = item["selector"].replace("%s", f"%({item['name']})s")
        sql += " AND " + selector

    return sql


def createSqlUpdate(scheme: list, fields: dict):
    sql = ""

    for item in scheme:
        if item["name"] not in fields:
            continue

        selector = item["selector"].replace("%s", f"%({item['name']})s")
        sql += selector + ", "

    if len(sql) == 0:
        return sql

    return sql[:-2]


def convertDate(date_string):
    """
    Convert a date string to a date object.
    """
    try:
        return parser.parse(date_string).strftime("%Y-%m-%d")
    except ValueError:
        return None
    
def convertDatetime(date_string):
    """
    Convert a date string to a datetime object.
    """
    try:
        return parser.parse(date_string).strftime("%Y-%m-%d %H:%M:%S")
    except ValueError:
        return None

def convertMonth(date_string):
    """
    Convert a date string to a month object.
    """
    try:
        return parser.parse(date_string).strftime("%Y-%m")
    except ValueError:
        return None
    
    
def nextMonth(date):
    if "-" not in date:
        date = date[:4] + "-" + date[4:]
    return (parser.parse(date) + relativedelta.relativedelta(months=1)).strftime("%Y%m")
    
    
def convertBody(body, format, **kwargs):
    result = {}

    for item in format.keys():
        path = format[item].split(".")

        optional = False
        if item[-1] == "?":
            optional = True
            item = item[:-1]

        value = body
        for subpath in path:
            if subpath in value.keys():
                value = value[subpath]
            elif optional:
                value = None
                break
            else:
                return False

        if kwargs.get("auto_date", None) == True and value is not None:
            if "date_time" in item:
                value = convertDatetime(value)
            elif "date" in item:
                value = convertDate(value)
            elif "month" in item:
                value = convertMonth(value)

        result[item] = value

    return result


def convertParams(params, format, **kwargs):
    result = {}

    for item in format.keys():
        path = format[item]

        optional = False
        if item[-1] == "?":
            optional = True
            item = item[:-1]

        if params.get(path) == None:
            if optional:
                continue
            else:
                return False
        else:
            if kwargs.get("auto_date", None) == True:
                if "date_time" in item:
                    result[item] = convertDatetime(params.get(path))
                elif "date" in item:
                    result[item] = convertDate(params.get(path))
                elif "month" in item:
                    result[item] = convertMonth(params.get(path))
                else:
                    result[item] = params.get(path)
            else:
                result[item] = params.get(path)

    return result

# DB QUERIES

def getStaff(cursor, username, *args):
    """
    Query the Airline_Staff table for a specific field of a given username.
    Returns single value or None.
    """
    select = ""
    if len(args) == 0:
        select = "*"
    else:
        for item in args:
            select += item + ", "
        select = select[:-2]
        
    cursor.execute(
        """
        SELECT {select}
            FROM airline_staff
            WHERE username = %s
    """.format(
            select=select
        ),
        {"username": username},
    )
    return cursor.fetchone()

# UNFINISHED

def getCustomer(cursor, email):
    ...
    

def getFlight(cursor, airline, flight_number, departure_date_time):
    ...
    
    

    