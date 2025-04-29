// src/pages/AddAirplane.jsx
import React from 'react';


function add_airplane() { /* Backend in airports.py add_airplane */
  return (
    <div className="add-airplane-container">
      <h2>Add New Airplane</h2>
      {/* Future: Form for staff to add a new airplane */}
      <form>
        <input type="text" placeholder="Airplane ID" required />
        <input type="text" placeholder="Owner Airline Name" required />
        <input type="number" placeholder="Seat Capacity" required />
        <input type="text" placeholder="Manufacturer" required />
        <button type="submit">Add Airplane</button>
      </form>
    </div>
  );
}

export default add_airplane;
