// src/pages/SearchFlights.jsx
import React from 'react';


function SearchFlights() {
  return (
    <div className="search-flights-container">
      <h2>Search Flights</h2>
      <form>
        <input type="text" placeholder="Source City or Airport" />
        <input type="text" placeholder="Destination City or Airport" />
        <input type="date" placeholder="Departure Date" />
        <input type="date" placeholder="Return Date (Optional)" />
        <button type="submit">Search</button>
      </form>
    </div>
  );
}

export default SearchFlights;
