// src/pages/CreateFlight.jsx
import React from 'react';

function create_flight() { /* Backend in flights.py create_flight */
  return (
    <div className="create-flight-container">
      <h2>Create New Flight</h2>
      {/* Future: Form for staff to add a new flight */}
      <form method = "POST" action = "/api/flights/"> 
        <input type="text" name="airline_name" placeholder="Airline Name" required />
        <input type="text" name="flight_number" placeholder="Flight Number" required />
        /* Add a default value to this to be the airline_name? */
        <input type="text" name="operating_airline_name" placeholder="Operating Airline Name" required />
        <input type="text" name="airplane_ID" placeholder="Airplane ID" required />
        
        <label>Departure Time:</label>
        <input type="datetime-local" name="departure_timestamp" required />
        
        <input type="text" name="departure_airport_code" placeholder="Departure Airport Code" required />
        <input type="text" name="arrival_airport_code" placeholder="Arrival Airport Code" required />
        
        <label>Expected Arrival Time:</label>
        <input type="datetime-local" name="arrival_timestamp" required />

        <input type="number" step="0.01" name="base_price" placeholder="Base Ticket Price" required />
        
        <select name="status" required>
          <option value="">Select Status</option>
          <option value="On-Time">On-Time</option>
          <option value="Delayed">Delayed</option>
          <option value="Arrived">Arrived</option>
          <option value="Boarding">Boarding</option>
          <option value="Cancelled">Cancelled</option>
        </select>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default create_flight;
