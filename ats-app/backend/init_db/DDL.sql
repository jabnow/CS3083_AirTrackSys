-- Dorien Zhang (dxz207), Joy Wang (jw8392), Vihan Vora (vnv2005)
-- CS-3083 Intro to Databases Project Part 2 Part 2
-- 04/06/25

CREATE TABLE IF NOT EXISTS airline (
    name VARCHAR(100), -- Primary key
    -- CONSTRAINT
    PRIMARY KEY (name)
);

CREATE TABLE IF NOT EXISTS airport (
    code VARCHAR(10), -- Primary key
    name VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    -- CONSTRAINT
    PRIMARY KEY (code)
);

CREATE TABLE IF NOT EXISTS airline_staff (
    username VARCHAR(50), -- Primary key
    employer_name VARCHAR(100) NOT NULL,  -- Foreign key to Airline(name)
    password VARCHAR(256) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    date_of_birth DATE,
    -- CONSTRAINT
    PRIMARY KEY (username),
    FOREIGN KEY (employer_name) REFERENCES Airline(name)
);

CREATE TABLE IF NOT EXISTS Staff_Email (
    email VARCHAR(100), -- Primary key
    username VARCHAR(50), -- Primary key
    -- CONSTRAINT
    PRIMARY KEY (email, username),
    FOREIGN KEY (username) REFERENCES Airline_Staff(username)
);

CREATE TABLE IF NOT EXISTS Staff_Phone (
    phone_number VARCHAR(20), -- Primary key
    username VARCHAR(50), -- Primary key
    -- CONSTRAINT
    PRIMARY KEY (phone_number, username),
    FOREIGN KEY (username) REFERENCES Airline_Staff(username)
);

CREATE TABLE IF NOT EXISTS Airplane (
    airplane_ID VARCHAR(20), -- Primary key
    owner_name VARCHAR(100) NOT NULL,  -- Foreign key to airline(name)
    seats INT NOT NULL,
    manufacturer VARCHAR(100) NOT NULL,
    -- CONSTRAINT
    PRIMARY KEY (airplane_ID, owner_name),
    FOREIGN KEY (owner_name) REFERENCES airline(name)
);

CREATE TABLE IF NOT EXISTS Flight (
    airline_name VARCHAR(100) NOT NULL,  -- Foreign key to Airline(name) 
    flight_number VARCHAR(20), -- Primary key
    operating_airline_name VARCHAR(100) NOT NULL, -- Foreign key to Airplane(name)
    airplane_ID VARCHAR(20) NOT NULL, -- Foreign key to Airplane(airplane_ID)
    departure_timestamp TIMESTAMP NOT NULL, -- Primary key
    arrival_airport_code VARCHAR(10) NOT NULL,   -- Foreign key to Airport(code)
    departure_airport_code VARCHAR(10) NOT NULL, -- Foreign key to Airport(code)
    arrival_timestamp TIMESTAMP, -- Can be NULL for future flights, delays, etc.
    base_price FLOAT NOT NULL,
    status ENUM(
        'On-Time', 
        'Delayed', 
        'Arrived', 
        'Boarding', 
        'Cancelled'
        ) NOT NULL,
    -- CONSTRAINT
    PRIMARY KEY (flight_number, departure_timestamp, airline_name),
    FOREIGN KEY (airline_name) REFERENCES airline(name),
    FOREIGN KEY (airplane_ID, operating_airline_name) 
        REFERENCES airplane(airplane_ID, owner_name),
    FOREIGN KEY (arrival_airport_code) REFERENCES airport(code),
    FOREIGN KEY (departure_airport_code) REFERENCES airport(code)
);

CREATE TABLE IF NOT EXISTS Customer (
    email VARCHAR(100), -- Primary Key 
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    password VARCHAR(256) NOT NULL,
    building_number VARCHAR(10) NOT NULL,
    street VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    passport_number VARCHAR(50) NOT NULL,
    passport_expiration DATE NOT NULL,
    passport_country VARCHAR(50) NOT NULL,
    date_of_birth DATE NOT NULL,
    -- CONSTRAINT
    PRIMARY KEY (email)
);

CREATE TABLE IF NOT EXISTS Ticket (
    ticket_ID VARCHAR(20), -- Primary Key
    flight_number VARCHAR(20), -- Foreign key to flight(flight_number)
    departure_timestamp TIMESTAMP, -- Foreign key to flight(departure_timestamp)
    airline_name VARCHAR(100) NOT NULL, -- Foreign key to flight(airline_name)
    email VARCHAR(100) NOT NULL, -- Foreign key to customer(email)
    customer_name VARCHAR(100) NOT NULL, 
    sold_price FLOAT NOT NULL,
    -- CONSTRAINT
    PRIMARY KEY(ticket_ID),
    FOREIGN KEY (email) REFERENCES Customer(email),
    FOREIGN KEY (flight_number, departure_timestamp, airline_name)
        REFERENCES Flight(flight_number, departure_timestamp, airline_name)
);

CREATE TABLE IF NOT EXISTS payment_info (
    card_number VARCHAR(20), -- Primary Key
    card_type VARCHAR(50) NOT NULL,
    card_expiration_date DATE NOT NULL,
    name_on_card VARCHAR(100) NOT NULL,
    -- CONSTRAINT
    PRIMARY KEY (card_number)
);

CREATE TABLE IF NOT EXISTS Purchases (
    email VARCHAR(100) NOT NULL, -- Foreign key to customer(email)
    ticket_ID VARCHAR(20) NOT NULL, -- Foreign key to ticket(ticket_ID)
    card_number VARCHAR(20) NOT NULL, -- Foreign key to payment_info(card_number)
    comment TEXT,
    rating NUMERIC(1,0) CHECK (rating BETWEEN 1 AND 5),
    purchase_timestamp TIMESTAMP NOT NULL,
    -- CONSTRAINT
    PRIMARY KEY (email, ticket_ID, card_number),
    FOREIGN KEY (email) REFERENCES Customer(email),
    FOREIGN KEY (ticket_ID) REFERENCES Ticket(ticket_ID),
    FOREIGN KEY (card_number) REFERENCES payment_info(card_number)
);
