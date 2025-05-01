// src/SearchFlights.jsx
import React, { useState } from 'react'
import { flights } from './services'

export default function SearchFlights() {
  const [source, setSource] = useState('')
  const [destination, setDestination] = useState('')
  const [departureDate, setDepartureDate] = useState('')
  const [returnDate, setReturnDate] = useState('')
  const [results, setResults] = useState([])
  const [error, setError] = useState(null)

  const onSubmit = async e => {
    e.preventDefault()
    setError(null)
    // Build filters: we'll pass whatever fields the user filled in
    const filters = { departure_date: departureDate }
    if (returnDate) filters.return_date = returnDate

    // treat the single "source" input as both city and airport filter
    if (source) {
      filters.source_city = source
      filters.source_airport = source
    }
    if (destination) {
      filters.destination_city = destination
      filters.destination_airport = destination
    }

    try {
      const data = await flights.future(filters)
      setResults(data.flights_to || [])
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="search-flights-container">
      <h2>Search Flights</h2>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="Source City or Airport"
          value={source}
          onChange={e => setSource(e.target.value)}
        />
        <input
          type="text"
          placeholder="Destination City or Airport"
          value={destination}
          onChange={e => setDestination(e.target.value)}
        />
        <input
          type="date"
          placeholder="Departure Date"
          value={departureDate}
          onChange={e => setDepartureDate(e.target.value)}
          required
        />
        <input
          type="date"
          placeholder="Return Date (Optional)"
          value={returnDate}
          onChange={e => setReturnDate(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {error && <div className="error">Error: {error}</div>}

      {results.length > 0 && (
        <ul className="results">
          {results.map(f => (
            <li key={`${f.airline_name}-${f.flight_number}-${f.departure_date_time}`}>
              <strong>{f.airline_name} {f.flight_number}</strong><br/>
              Departs: {new Date(f.departure_date_time).toLocaleString()} from {f.departure_airport_code}<br/>
              Arrives: {new Date(f.arrival_date_time).toLocaleString()} at {f.arrival_airport_code}<br/>
              Price: ${f.base_price.toFixed(2)} | Status: {f.status}
            </li>
          ))}
        </ul>
      )}

      {results.length === 0 && !error && (
        <p>No flights found. Try adjusting your search.</p>
      )}
    </div>
  )
}



// previous, before the API call

// import React from 'react';


// function SearchFlights() {
//   return (
//     <div className="search-flights-container">
//       <h2>Search Flights</h2>
//       <form>
//         <input type="text" placeholder="Source City or Airport" />
//         <input type="text" placeholder="Destination City or Airport" />
//         <input type="date" placeholder="Departure Date" />
//         <input type="date" placeholder="Return Date (Optional)" />
//         <button type="submit">Search</button>
//       </form>
//     </div>
//   );
// }

// export default SearchFlights;