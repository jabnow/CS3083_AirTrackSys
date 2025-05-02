// src/pages/FlightRatings.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function FlightRatings({ user }) {
  const [airline, setAirline] = useState('');
  const [flightNo, setFlightNo] = useState('');
  const [depDate, setDepDate] = useState('');
  const [report, setReport] = useState(null);
  const [error, setError] = useState('');

  const fetchRatings = async (e) => {
    e && e.preventDefault();
    setError('');
    setReport(null);

    if (!airline || !flightNo || !depDate) {
      setError('Please enter airline, flight number, and date.');
      return;
    }

    try {
      const res = await axios.get('/api/ratings/flight', {
        params: { airline_name: airline, flight_number: flightNo, departure_timestamp: depDate },
        withCredentials: true,
      });
      setReport(res.data);
    } catch (err) {
      setError(err.response?.data?.msg || err.message);
    }
  };

  // Auto-fetch on mount if you want defaults
  useEffect(() => {
    // e.g. fetchRatings();
  }, []);

  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow rounded">
      <h2 className="text-xl mb-4">Flight Ratings Report</h2>

      <form onSubmit={fetchRatings} className="space-y-4 mb-6">
        <input
          type="text"
          placeholder="Airline Name"
          value={airline}
          onChange={e => setAirline(e.target.value)}
          className="input w-full"
          required
        />
        <input
          type="text"
          placeholder="Flight Number"
          value={flightNo}
          onChange={e => setFlightNo(e.target.value)}
          className="input w-full"
          required
        />
        <input
          type="date"
          placeholder="Departure Date"
          value={depDate}
          onChange={e => setDepDate(e.target.value)}
          className="input w-full"
          required
        />
        <button type="submit" className="btn w-full">
          Load Ratings
        </button>
      </form>

      {error && <div className="text-red-600 mb-4">Error: {error}</div>}

      {report && (
        <div className="space-y-4">
          <div>
            <strong>Avg Rating:</strong> {report.average_rating ?? 'N/A'}
          </div>
          <div>
            <strong>Reviews:</strong>
            <ul className="mt-2 space-y-2">
              {report.reviews.map((r, i) => (
                <li key={i} className="border p-3 rounded">
                  <div><strong>{r.email}</strong> on {new Date(r.purchase_timestamp).toLocaleString()}</div>
                  <div>Rating: {r.rating} / 5</div>
                  <div>Comment: {r.comment}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}