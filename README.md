# CS3083_AirTrackSys
Implementation Air Ticket Reservation System as a web-based application POC
# Online Air Ticket Reservation System

## Project Overview
This is the semester project for "Intro to Databases (CS-UY 3083)" course at NYU Tandon with Professor RatanDey. It involves designing, implementing, and deploying an online Air Ticket Reservation System, covering the full database development lifecycle: conceptual design, logical design, database implementation, and the creation of an associated web-based application.

### Team Members:
- Joy Wang
- Vihan Vora
- Dorien Zhang

## Project Parts and Deliverables

### Part 1: ER Diagram
Design an ER diagram for the online Air Ticket Reservation System based on the provided description. Ensure clarity in entity sets, attributes, relationship sets, and cardinality constraints.

**Deadline:** 03/21/2025 11:59 PM

#### ER Diagram:
Upload your ER Diagram here:

![ER Diagram](https://github.com/user-attachments/assets/6506136a-31e2-4d9e-aaa5-50de3d019c92)

---

### Part 2: Relational Schema Design
Derive a relational schema from your ER diagram. Underline primary keys and use arrows to indicate foreign key constraints clearly. Write and execute SQL statements to:
- Create tables with reasonable data types.
- Insert test data (airlines, airports, customers, airplanes, staff, flights, and tickets).
- Execute and provide SQL queries and results for:
  - Future flights
  - Delayed flights
  - Customers who purchased tickets
  - Airplanes owned by Jet Blue

**Deadline:** 04/04/2025 11:59 PM

#### Relational Schema Diagram:
Upload your Relational Schema Diagram here:

![Relational Schema Diagram](https://github.com/user-attachments/assets/0704a8e7-e6b3-443b-a1f7-533e2c21d055)
![Screenshot 2025-05-06 202155](https://github.com/user-attachments/assets/9545069d-6706-43d5-97c4-b6344419f753)

---

### Part 3: Web Application Development
Implement the Air Ticket Reservation System as a web-based application using your relational schema. The application must include:
- Home page functionalities (logged-in and not logged-in)
- User authentication (customer and airline staff)
- Customer use cases (view flights, search flights, purchase tickets, cancel trips, rating/commenting)
- Airline staff use cases (view flights, create flights, update status, manage airplanes/airports, view ratings, reports)

---
### How to setup and run the application on localhost:
Prereqs:
MySQL server (or MariaDB) running locally on port 3306.
Node.js v14+ and npm.
Python 3.9+ and pip.

1. Clone this repository
```
git clone https://github.com/jabnow/CS3083_AirTrackSys
```
3. Initialize DB and load data
```
mysql -u [username] -p [password] < [sql file name].sql
mysql -u [username] -p [password] air_traffic_reservation_system < inserts.sql
-- default user: root
-- default pass: none
```
3. Create and activate virtual environment
```
python -m venv venv
# macOS/Linux
source venv/bin/activate
# Windows
.venv\Scripts\activate
```
4. Install dependencies
```
pip install -r requirements.txt
# (optional) edit SECRET_KEY, DB_ settings as needed
# cp .env.example .env
```
5. Run backend/server
```
# make sure MysQL is running before
cd ats-app/backend
flask --app app.py run
```
6. Start the frontend/development server
```
# open new terminal
cd ats-app/frontend
npm start
```
7. btw
to kill either process, `Ctrl + C`
to see interactions, open developer tools `Ctrl + Shift + I` or see terminal
login password can be set by making credentials.py file which is in .gitignore, or hashing plaintext, 256 char
---

**Some progress photos:**
![Screenshot 2025-05-06 202236](https://github.com/user-attachments/assets/9fd95a2a-d760-434f-b3d6-a83d0f452cb7)
![Screenshot 2025-05-06 202246](https://github.com/user-attachments/assets/42e65a02-7e0a-4790-8179-be409b81a101)
![Screenshot 2025-05-01 013332](https://github.com/user-attachments/assets/ede28187-ac97-4e62-b55a-c7990e66628a)
![Screenshot 2025-05-01 013352](https://github.com/user-attachments/assets/a4e91022-642d-4fa8-bc40-8856e844688e)
![Screenshot 2025-05-01 013419](https://github.com/user-attachments/assets/361d04e7-9acb-45ad-86ca-7ce0ef876c26)
![Screenshot 2025-05-01 013050](https://github.com/user-attachments/assets/3536c26a-9edf-484d-8404-53bef04f94d2)

**Deadline:** 05/01/2025 11:59 PM

### Required Technical Implementation:
- Enforce complex constraints at server-side.
- Implement secure session management.
- Use prepared statements or validate inputs to prevent SQL injection.
- Prevent cross-site scripting (XSS) vulnerabilities.
- Provide user-friendly, role-specific interfaces.

### Tech Stack:
- Database: MySQL
- Backend: Python/Flask
- Frontend: React/Java, CSS
- API: express, axios
---

## Contribution Statement:
Clearly state the tasks completed by each team member:
- Joy: backend, DB, server config in Flask, API endpoints, session mgmt, auth
- Vihan: frontend in React, cookies, server debugging, DB testing, demo
- Dorien: backend routes, documentation

---

## Final Submission Requirements:
- Source code with clear documentation.
- Description of each file and functionality.
- Detailed use case explanations with SQL queries.
- Team contribution summary.
- Demonstration of the project (scheduled separately).

---

Ensure all project components are complete and submitted according to deadlines. Good luck!

