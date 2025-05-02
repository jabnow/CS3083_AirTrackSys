import React, { useState } from 'react';
import axios from 'axios';

export default function SearchFlights() {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResults([]);

    const params = {};

    if (source) {
      params.source_airport = source;
      // params.source_city = source;
    }
    if (destination) {
      params.destination_airport = destination;
      // params.destination_city = destination;
    }
    if (departureDate) {
      params.departure_date = departureDate; // Already YYYY-MM-DD
    }
    if (returnDate) {
      params.return_date = returnDate; // Already YYYY-MM-DD
    }

    try {
      console.log("📡 Sending flight search with:", params);
      const res = await axios.get('http://127.0.0.1:5000/api/flights/future', {
        params,
        withCredentials: false,
      });
      console.log("✅ Flights received:", res.data);
      setResults(res.data.flights_to || []);
    } catch (err) {
      console.error("❌ Search error:", err);
      setError(err.response?.data?.msg || err.message);
    }
  };

  return (
    <div className="search-flights-container max-w-3xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-semibold mb-4 text-center">Search Flights</h2>

      <form onSubmit={onSubmit} className="space-y-3">
        <input type="text" placeholder="Source City or Airport" value={source} onChange={e => setSource(e.target.value)} className="input w-full" />
        <input type="text" placeholder="Destination City or Airport" value={destination} onChange={e => setDestination(e.target.value)} className="input w-full" />
        <input type="date" value={departureDate} onChange={e => setDepartureDate(e.target.value)} required className="input w-full" />
        <input type="date" value={returnDate} onChange={e => setReturnDate(e.target.value)} className="input w-full" />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Search</button>
      </form>

      {error && <div className="text-red-600 mt-4">Error: {error}</div>}

      {results.length > 0 && (
        <ul className="mt-6 space-y-4">
          {results.map((f) => (
            <li key={`${f.airline_name}-${f.flight_number}-${f.departure_timestamp}`} className="p-4 border rounded">
              <strong>{f.airline_name} {f.flight_number}</strong><br />
              Departs: {new Date(f.departure_timestamp).toLocaleString()} from {f.departure_airport_code}<br />
              Arrives: {new Date(f.arrival_timestamp).toLocaleString()} at {f.arrival_airport_code}<br />
              Price: ${f.base_price.toFixed(2)} | Status: {f.status}
            </li>
          ))}
        </ul>
      )}

      {results.length === 0 && !error && (
        <p className="mt-4 text-center text-gray-600">No flights found. Try adjusting your search.</p>
      )}
    </div>
  );
}
