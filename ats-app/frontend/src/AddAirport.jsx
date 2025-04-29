// src/pages/AddAirport.jsx
import React from 'react';


function create_airport() { /* Backend in airports.py create_airport */
  return (
    <div className="add-airport-container">
      <h2>Add New Airport</h2>
      {/* Future: Form for staff to add a new airport */}
      <form method = "POST" action = "/api/airports/">
        <input type="text" placeholder="Airport Code" required />
        <input type="text" placeholder="Airport Name" required />
        <input type="text" placeholder="City" required />
        <input type="text" placeholder="Country" required />
        <button type="submit">Add Airport</button>
      </form>
    </div>
  );
}

export default create_airport;
