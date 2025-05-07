
-- Insert into Airline
INSERT INTO Airline (name) VALUES ('JetBlue');

-- Insert into Airline_Staff and Staff_Phone
INSERT INTO airline_staff (
  username, password, first_name, last_name, date_of_birth, employer_name
)
VALUES (
  'admin',
  SHA2('abcd', 256),  -- hashes 'abcd' using SHA-256
  'Roe',
  'Jones',
  '1978-05-25',
  'JetBlue'
);

INSERT INTO Staff_Email (username, email) VALUES
('admin', 'staff@nyu.edu');

INSERT INTO Staff_Phone (username, phone_number) VALUES
('admin', '111-2222-3333'),
('admin', '444-5555-6666');

-- Insert into Airplane start here
INSERT INTO Airplane ( owner_name, airplane_ID, seats, manufacturer) VALUES
( 'JetBlue',1, 4, 'Boeing'),
( 'JetBlue',2, 4, 'Airbus'),
('JetBlue',3, 50, 'Boeing');

-- Insert into Airport
INSERT INTO Airport (code, name, city, country) VALUES
('JFK','JFK  Airport', 'NYC', 'USA'),
('BOS', 'BOS  Airport','Boston', 'USA'),
('PVG', 'PVG Airport','Shanghai', 'China'),
('BEI', 'BEI  Airport','Beijing', 'China'),
('SFO', 'SFO  Airport','San Francisco', 'USA'),
('LAX', 'LAX  Airport','Los Angeles', 'USA'),
('HKA', 'HKA  Airport','Hong Kong', 'China'),
('SHEN', 'SHEN  Airport','Shenzhen', 'China');

-- Insert into Customer(added last na,e)
INSERT INTO Customer (
  email, password, first_name, last_name, building_number, street, city, state, phone_number,
  passport_number, passport_expiration, passport_country, date_of_birth
) VALUES
('testcustomer@nyu.edu', SHA2('1234', 256), 'Test Customer 1', 'n/a', '1555', 'Jay St', 'Brooklyn', 'New York', '123-4321-4321', '54321', '2025-12-24', 'USA', '1999-12-19'),
('user1@nyu.edu', SHA2('1234', 256), 'User 1', 'n/a', '5405', 'Jay Street', 'Brooklyn', 'New York', '123-4322-4322', '54322', '2025-12-25', 'USA', '1999-11-19'),
('user2@nyu.edu', SHA2('1234', 256), 'User 2', 'n/a', '1702', 'Jay Street', 'Brooklyn', 'New York', '123-4323-4323', '54323', '2025-10-24', 'USA', '1999-10-19'),
('user3@nyu.edu', SHA2('1234', 256), 'User 3', 'n/a', '1890', 'Jay Street', 'Brooklyn', 'New York', '123-4324-4324', '54324', '2025-09-24', 'USA', '1999-09-19');


-- Insert into Flight
INSERT INTO Flight (airline_name, flight_number, departure_airport_code, departure_timestamp, arrival_airport_code, arrival_timestamp, base_price, status, airplane_id, operating_airline_name) VALUES
('JetBlue', 102, 'SFO', '2025-02-12 13:25:25', 'LAX', '2025-02-12 16:50:25', 300, 'on-time', 3,'JetBlue'),
('JetBlue', 104, 'PVG', '2025-03-07 13:25:25', 'BEI', '2025-03-07 16:50:25', 300, 'on-time', 3,'JetBlue'),
('JetBlue', 106, 'SFO', '2025-01-09 13:25:25', 'LAX', '2025-01-09 16:50:25', 350, 'delayed', 3,'JetBlue'),
('JetBlue', 206, 'SFO', '2025-07-01 13:25:25', 'LAX', '2025-07-01 16:50:25', 400, 'on-time', 2,'JetBlue'),
('JetBlue', 207, 'LAX', '2025-08-02 13:25:25', 'SFO', '2025-08-02 16:50:25', 300, 'on-time', 2,'JetBlue'),
('JetBlue', 134, 'JFK', '2024-12-12 13:25:25', 'BOS', '2024-12-12 16:50:25', 300, 'delayed', 3,'JetBlue'),
('JetBlue', 296, 'PVG', '2025-05-30 13:25:25', 'SFO', '2025-05-30 16:50:25', 3000, 'on-time', 1,'JetBlue'),
('JetBlue', 715, 'PVG', '2025-02-28 10:25:25', 'BEI', '2025-02-28 13:50:25', 500, 'delayed', 1,'JetBlue'),
('JetBlue', 839, 'SHEN', '2024-05-26 13:25:25', 'BEI', '2024-05-26 16:50:25', 300, 'on-time', 3,'JetBlue');


-- Ticket insert (custom style format)
INSERT INTO ticket(ticket_ID, flight_number, departure_timestamp, airline_name, email, customer_name, sold_price) 
VALUES 
('1', '102', '2025-02-12 13:25:25', 'JetBlue', 'testcustomer@nyu.edu', 'Test Customer 1', 300),
('2', '102', '2025-02-12 13:25:25', 'JetBlue', 'user1@nyu.edu', 'User 1', 300),
('3', '102', '2025-02-12 13:25:25', 'JetBlue', 'user2@nyu.edu', 'User 2', 300),
('4', '104', '2025-03-07 13:25:25', 'JetBlue', 'user1@nyu.edu', 'User 1', 300),
('5', '104', '2025-03-07 13:25:25', 'JetBlue', 'testcustomer@nyu.edu', 'Test Customer 1', 300),
('6', '106', '2025-01-09 13:25:25', 'JetBlue', 'testcustomer@nyu.edu', 'Test Customer 1', 350),
('7', '106', '2025-01-09 13:25:25', 'JetBlue', 'user3@nyu.edu', 'User 3', 350),
('8', '839', '2024-05-26 13:25:25', 'JetBlue', 'user3@nyu.edu', 'User 3', 300),
('9', '102', '2025-02-12 13:25:25', 'JetBlue', 'user3@nyu.edu', 'User 3', 300),
('11', '134', '2024-12-12 13:25:25', 'JetBlue', 'user3@nyu.edu', 'User 3', 300),
('12', '715', '2025-02-28 10:25:25', 'JetBlue', 'testcustomer@nyu.edu', 'Test Customer 1', 500),
('14', '206', '2025-07-01 13:25:25', 'JetBlue', 'user3@nyu.edu', 'User 3', 400),
('15', '206', '2025-07-01 13:25:25', 'JetBlue', 'user1@nyu.edu', 'User 1', 400),
('16', '206', '2025-07-01 13:25:25', 'JetBlue', 'user2@nyu.edu', 'User 2', 400),
('17', '207', '2025-08-02 13:25:25', 'JetBlue', 'user1@nyu.edu', 'User 1', 300),
('18', '207', '2025-08-02 13:25:25', 'JetBlue', 'testcustomer@nyu.edu', 'Test Customer 1', 300),
('19', '296', '2025-05-30 13:25:25', 'JetBlue', 'user1@nyu.edu', 'Test Customer 1', 3000),
('20', '296', '2025-05-30 13:25:25', 'JetBlue', 'testcustomer@nyu.edu', 'Test Customer 1', 3000);

-- Payment info insert (custom style format)
INSERT INTO payment_info(card_number, card_type, card_expiration_date, name_on_card)
VALUES 
('1111 2222 3333 4444', 'credit', '2030-01-01', 'Dorien X Zhang'),
('0011 2233 4455 6677', 'credit', '2035-01-01', 'User 1'),
('9988 7766 5544 3311', 'debit', '2030-06-01', 'User 2');

INSERT INTO payment_info(card_number, card_type, card_expiration_date, name_on_card)
VALUES ('1111 2222 3333 5555', 'debit', '2030-06-01', 'User 3');



-- Purchase records (custom style format)
INSERT INTO purchases(email, ticket_ID, card_number, comment, rating, purchase_timestamp)
VALUES
('testcustomer@nyu.edu', '1', '1111 2222 3333 4444', NULL, NULL, '2025-01-10 11:55:55'),
('user1@nyu.edu', '2', '1111 2222 3333 5555', NULL, NULL, '2025-01-09 11:55:55'),
('user2@nyu.edu', '3', '1111 2222 3333 5555', NULL, NULL, '2025-02-08 11:55:55'),
('user1@nyu.edu', '4', '1111 2222 3333 5555', NULL, NULL, '2025-01-21 11:55:55'),
('testcustomer@nyu.edu', '5', '1111 2222 3333 4444', NULL, NULL, '2025-02-28 11:55:55'),
('testcustomer@nyu.edu', '6', '1111 2222 3333 4444', NULL, NULL, '2025-01-07 11:55:55'),
('user3@nyu.edu', '7', '1111 2222 3333 5555', NULL, NULL, '2024-12-07 11:55:55'),
('user3@nyu.edu', '8', '1111 2222 3333 5555', NULL, NULL, '2024-05-08 11:55:55'),
('user3@nyu.edu', '9', '1111 2222 3333 5555', NULL, NULL, '2024-12-11 11:55:55'),
('user3@nyu.edu', '11', '1111 2222 3333 5555', NULL, NULL, '2024-10-23 11:55:55'),
('testcustomer@nyu.edu', '12', '1111 2222 3333 4444', NULL, NULL, '2024-10-19 11:55:55'),
('user3@nyu.edu', '14', '1111 2222 3333 5555', NULL, NULL, '2025-04-20 11:55:55'),
('user1@nyu.edu', '15', '1111 2222 3333 5555', NULL, NULL, '2025-04-21 11:55:55'),
('user2@nyu.edu', '16', '1111 2222 3333 5555', NULL, NULL, '2024-02-19 11:55:55'),
('user1@nyu.edu', '17', '1111 2222 3333 5555', NULL, NULL, '2025-01-11 11:55:55'),
('testcustomer@nyu.edu', '18', '1111 2222 3333 4444', NULL, NULL, '2025-02-25 11:55:55'),
('user1@nyu.edu', '19', '1111 2222 3333 4444', NULL, NULL, '2025-04-22 11:55:55'),
('testcustomer@nyu.edu', '20', '1111 2222 3333 4444', NULL, NULL, '2024-12-16 11:55:55');


-- Add ratings and comments to purchases
UPDATE purchases
SET rating = 4, comment = 'Very Comfortable'
WHERE email = 'testcustomer@nyu.edu' AND ticket_ID = '1';

UPDATE purchases
SET rating = 5, comment = 'Relaxing, check-in and onboarding very professional'
WHERE email = 'user1@nyu.edu' AND ticket_ID = '2';

UPDATE purchases
SET rating = 3, comment = 'Satisfied and will use the same flight again'
WHERE email = 'user2@nyu.edu' AND ticket_ID = '3';

UPDATE purchases
SET rating = 1, comment = 'Customer Care services are not good'
WHERE email = 'testcustomer@nyu.edu' AND ticket_ID = '5';

UPDATE purchases
SET rating = 5, comment = 'Comfortable journey and Professional'
WHERE email = 'user1@nyu.edu' AND ticket_ID = '4';
