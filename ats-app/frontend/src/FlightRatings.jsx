// src/pages/FlightRatings.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function FlightRatings({ user }) {
  const [airline, setAirline] = useState('');
  const [flightNo, setFlightNo] = useState('');
  const [depDate, setDepDate] = useState('');
  const [report, setReport] = useState(null);
  const [error, setError] = useState('');

<<<<<<< HEAD
  useEffect(() => {
    async function fetchRatings() {
      try {
        const res = await ratings.list()
        // Filter out future flights based on arrival time
        const pastFlights = (res.ratings || []).filter(flight => 
          new Date(flight.arrival_timestamp) < new Date()
        )
        setRatingsData(pastFlights)
      } catch (err) {
        setError(err.message)
      }
=======
  const fetchRatings = async (e) => {
    e && e.preventDefault();
    setError('');
    setReport(null);

    if (!airline || !flightNo || !depDate) {
      setError('Please enter airline, flight number, and date.');
      return;
>>>>>>> origin/joy_new
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
<<<<<<< HEAD
    <div className="flight-ratings-container max-w-xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-semibold mb-4">Your Past Flight Ratings</h2>
      {error && <div className="text-red-600 mb-4">Error: {error}</div>}
      {ratingsData.length === 0 ? (
        <p className="text-gray-700">You have no past flights to rate yet.</p>
      ) : (
        <ul className="space-y-4">
          {ratingsData.map(r => (
            <li key={r.ticket_ID} className="border p-4 rounded">
              <div className="flex justify-between items-start">
                <div>
                  <div><strong>Ticket ID:</strong> {r.ticket_ID}</div>
                  {r.rating ? (
                    <>
                      <div><strong>Rating:</strong> {r.rating} / 5</div>
                      {r.comment && <div><strong>Comment:</strong> {r.comment}</div>}
                    </>
                  ) : (
                    <div className="text-yellow-600">Flight eligible for rating</div>
                  )}
                </div>
                <div className="text-sm text-gray-500">
                  Flight date: {new Date(r.arrival_timestamp).toLocaleDateString()}
                </div>
              </div>
            </li>
          ))}
        </ul>
=======
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
>>>>>>> origin/joy_new
      )}
    </div>
  );
}