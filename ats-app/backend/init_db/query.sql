-- Dorien Zhang (dxz207), Joy Wang (jw8392), Vihan Vora (vnv2005)
-- CS-3083 Intro to Databases Project Part 2 Part 4
-- 04/06/25

-- a
SELECT *
FROM Flight
WHERE departure_timestamp > CURRENT_TIMESTAMP;

-- b
SELECT *
FROM Flight
WHERE status = 'delayed';

-- c
SELECT DISTINCT first_name, last_name
FROM customer, purchases
WHERE customer.email = purchases.email;

-- d
SELECT *
FROM airplane
WHERE owner_name = 'Jet Blue';
