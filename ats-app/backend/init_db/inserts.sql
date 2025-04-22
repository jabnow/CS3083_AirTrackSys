-- Dorien Zhang (dxz207), Joy Wang (jw8392), Vihan Vora (vnv2005)
-- CS-3083 Intro to Databases Project Part 2 Part 3
-- 04/06/25

-- a 
INSERT INTO Airline (name) 
VALUES ('Jet Blue');

-- b
INSERT INTO airport(code, name, city, country) 
VALUES
('JFK', 'John F. Kennedy International Airport', 'New York City', 
    'United States of America'), 
('PVG', 'Shanghai Pudong International Airport', 'Shanghai', 'China');

-- c
INSERT INTO customer(email, first_name, last_name, password, building_number, 
    street, city, state, phone_number, passport_number, passport_expiration, 
    passport_country, date_of_birth) 
VALUES
('dxz207@nyu.edu', 'Dorien', 'Zhang', 'password123', '370', 'Jay St.', 
    'New York City', 'New York', '800 555 1234', 'A11110000', '2035-12-31', 
    'United States of America', '2005-01-20'), 
('jw8392@nyu.edu', 'Joy', 'Wang', '123password', '370', 'Jay St.', 
    'New York City', 'New York', '800 555 4321', 'Z123456789', '2035-12-31', 
    'United States of America', '2004-10-15'),
('vnv2005@nyu.edu', 'Vihan', 'Vora', '1password', '370', 'Jay St.', 
    'New York City', 'New York', '800 555 5678', 'V10002000', '2035-12-31', 
    'India', '2005-05-10');

-- d
INSERT INTO Airplane(airplane_ID, owner_name, seats, manufacturer) 
VALUES('D0R13N', 'Jet Blue', 246, 'Boeing'), 
('V1H4NV', 'Jet Blue', 220, 'Airbus'), 
('J0YW4N', 'Jet Blue', 156, 'Airbus');

-- e
INSERT INTO Airline_Staff(username, employer_name, password, first_name, 
    last_name, date_of_birth) 
VALUES('jdyjohn', 'Jet Blue', 'securepassword', 'John', 'Yuan', '2005-10-26');
INSERT INTO Staff_Email(username, email) 
VALUES('jdyjohn', 'jdyjohn@mail.com');
INSERT INTO Staff_Phone(username, phone_number) 
VALUES('jdyjohn', '8585552005');

-- f
INSERT INTO flight(airline_name, flight_number, operating_airline_name, 
    airplane_id, departure_timestamp, arrival_airport_code, 
    departure_airport_code, arrival_timestamp, base_price, status) 
VALUES 
('Jet Blue', 'JBU000', 'Jet Blue', 'D0R13N', '2020-01-01 09:00:00', 'PVG', 
    'JFK', '2020-01-01 22:00:00', 1000, 'On Time'),
('Jet Blue', 'JBU111', 'Jet Blue', 'D0R13N', '2021-01-01 09:00:00', 'JFK', 
    'PVG', '2021-01-01 22:00:00', 1000, 'On Time'),
('Jet Blue', 'JBU000', 'Jet Blue', 'D0R13N', '2024-01-01 09:00:00', 'PVG', 
    'JFK', '2024-01-01 23:00:00', 1000, 'Delayed'),
('Jet Blue', 'JBU222', 'Jet Blue', 'V1H4NV', '2024-06-01 06:00:00', 'JFK', 
    'PVG', '2024-06-01 19:00:00', 1000, 'On Time'),
('Jet Blue', 'JBU333', 'Jet Blue', 'V1H4NV', '2024-09-01 06:00:00', 'PVG', 
    'JFK', '2024-06-01 21:00:00', 1000, 'Delayed'),
('Jet Blue', 'JBU222', 'Jet Blue', 'V1H4NV', '2025-06-01 06:00:00', 'JFK', 
    'PVG', '2024-06-01 19:00:00', 1000, 'On Time'),
('Jet Blue', 'JBU444', 'Jet Blue', 'J0YW4N', '2025-06-01 14:00:00', 'JFK', 
    'PVG', '2025-06-02 02:00:00', 1000, 'Delayed'),
('Jet Blue', 'JBU555', 'Jet Blue', 'J0YW4N', '2025-08-01 14:00:00', 'PVG', 
    'JFK', '2025-08-02 02:00:00', 1000, 'On Time');

INSERT INTO ticket(ticket_ID, flight_number, departure_timestamp, airline_name, 
    email, customer_name, sold_price) 
VALUES('T0001', 'JBU000', '2020-01-01 09:00:00', 'Jet Blue', 'dxz207@nyu.edu', 
    'Dorien Zhang', 1200),
('T0002', 'JBU111', '2021-01-01 09:00:00', 'Jet Blue', 'dxz207@nyu.edu', 
    'Dorien Zhang', 1130),
('T0003', 'JBU444', '2025-06-01 14:00:00', 'Jet Blue', 'jw8392@nyu.edu', 
    'Joy Wang', 1000),
('T0004', 'JBU555', '2025-08-01 14:00:00', 'Jet Blue', 'vnv2005@nyu.edu', 
    'Vihan Vora', 1200);

INSERT INTO payment_info(card_number, card_type, card_expiration_date, 
    name_on_card)
VALUES ('1111 2222 3333 4444', 'credit', '2030-01-01', 'Dorien X Zhang'),
('0011 2233 4455 6677', 'credit', '2035-01-01', 'Joy Wang'),
('9988 7766 5544 3311', 'debit', '2030-06-01', 'Vihan Vora');

INSERT INTO purchases(email, ticket_ID, card_number, comment, rating, 
    purchase_timestamp) 
VALUES
('dxz207@nyu.edu', 'T0001', '1111 2222 3333 4444', 'Good service, no complaints', 
    5, '2025-05-01 20:00:00'),
('jw8392@nyu.edu', 'T0003', '0011 2233 4455 6677', NULL, NULL, 
    '2025-04-20 15:30:00'),
('vnv2005@nyu.edu', 'T0004', '9988 7766 5544 3311', NULL, NULL, 
    '2025-01-13 00:02:00');


