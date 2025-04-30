// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import PlaneImage from './components/plane.jpeg';
import axios from 'axios';

export default function Home() {
  const [roundTrip, setRoundTrip] = useState(false);
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [flightResults, setFlightResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    // Load all future flights on mount
    async function loadAll() {
      setLoading(true)
      setError('')
      try {
        const today = new Date().toISOString().slice(0, 10)
        const res = await axios.get('/api/flights/future', { params: { departure_date: today }, withCredentials: true })
        setFlightResults(res.data.flights_to || [])
        setFlightResults(res.flights_to || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    loadAll()
  }, [])

  const handleCheckboxChange = (e) => {
    setRoundTrip(e.target.checked);
  };

  const handleSearchFlights = async (e) => {
    e.preventDefault();
    setLoading(true)
    setError('')
    try {
      const response = await axios.get('/api/flights/future', {
        params: {
          source_city: source,
          source_airport: source,
          destination_city: destination,
          destination_airport: destination,
          departure_date: departureDate,
          return_date: roundTrip ? returnDate : undefined
        },
        withCredentials: true
      });
      console.log(response.data);
      // Handle response data (e.g., display flights)
    } catch (error) {
      console.error('Error searching flights:', error);
    }
  };

  return (
    <>
      <style>
        {`
          .home-container { display: flex; flex-direction: column; align-items: center; padding: 30px; background: linear-gradient(to bottom right, #f0f8ff, #e6f7ff); min-height: 100vh; }
          .home-banner { display: flex; align-items: center; justify-content: center; gap: 40px; background-color: #ffffff; padding: 20px 40px; border-radius: 12px; box-shadow: 0px 4px 12px rgba(0,0,0,0.1); margin-bottom: 40px; width: 100%; max-width: 1200px; }
          .plane-image { width: 300px; height: auto; border-radius: 10px; object-fit: cover; }
          .home-title { font-size: 2.8rem; color: #003366; margin-bottom: 10px; }
          .home-subtitle { font-size: 1.4rem; color: #336699; }
          .search-flights-box { background-color: #ffffff; padding: 30px 40px; border-radius: 12px; box-shadow: 0px 4px 12px rgba(0,0,0,0.1); width: 100%; max-width: 800px; text-align: center; }
          .search-flights-title { font-size: 2rem; color: #004080; margin-bottom: 20px; }
          .search-flights-form { display: flex; flex-direction: column; gap: 20px; }
          .search-inputs { display: flex; gap: 20px; justify-content: center; }
          .search-input { padding: 10px 15px; font-size: 1rem; width: 100%; max-width: 350px; border: 1px solid #ccc; border-radius: 6px; }
          .search-button { margin-top: 20px; padding: 12px 25px; font-size: 1.1rem; color: #ffffff; background-color: #0077cc; border: none; border-radius: 8px; cursor: pointer; transition: background-color 0.3s ease; }
          .search-button:hover { background-color: #005fa3; }
          .checkbox-roundtrip { display: flex; align-items: center; gap: 10px; justify-content: center; margin-top: 10px; }
        `}
      </style>

      <div className="home-container">
      {/* Banner */}
      <div className="home-banner">
        <img src={PlaneImage} alt="Airplane" className="plane-image" />
        <div className="home-text">
          <h1 className="home-title">Welcome to Air Ticket Reservation System</h1>
          <p className="home-subtitle">Book your flights with ease and comfort.</p>
        </div>
      </div>

      {/* Search Form */}
      <div className="search-flights-box">
        <h2 className="search-flights-title">Find Your Perfect Flight</h2>
        <form className="search-flights-form" onSubmit={handleSearchFlights}>
          <div className="search-inputs">
            <input
              type="text"
              placeholder="Source City or Airport"
              className="search-input"
              value={source}
              onChange={e => setSource(e.target.value)}
            />
            <input
              type="text"
              placeholder="Destination City or Airport"
              className="search-input"
              value={destination}
              onChange={e => setDestination(e.target.value)}
            />
          </div>
          <div className="search-inputs">
            <input
              type="date"
              className="search-input"
              value={departureDate}
              onChange={e => setDepartureDate(e.target.value)}
            />
            {roundTrip && (
              <input
                type="date"
                className="search-input"
                value={returnDate}
                onChange={e => setReturnDate(e.target.value)}
              />
            )}
          </div>
          <div className="checkbox-roundtrip">
            <input
              type="checkbox"
              id="roundTrip"
              checked={roundTrip}
              onChange={handleCheckboxChange}
            />
            <label htmlFor="roundTrip">Round Trip</label>
          </div>
          <button type="submit" className="search-button">Search Flights</button>
        </form>
      </div>

      {/* Results List, well crap, I can't make this work */}
      <div className="results-container max-w-3xl mx-auto mt-8">
        {loading && <p>Loading flights...</p>}
        {error && <p className="text-red-600">Error: {error}</p>}
        {!loading && !error && (
          <ul className="space-y-4">
            {flightResults.map(f => (
              <li key={`${f.airline_name}-${f.flight_number}-${f.departure_date_time}`} className="border p-4 rounded">
                <div><strong>{f.airline_name} {f.flight_number}</strong></div>
                <div>Departure: {new Date(f.departure_date_time).toLocaleString()}</div>
                <div>From: {f.departure_airport_code} → To: {f.arrival_airport_code}</div>
                <div>Price: ${f.base_price.toFixed(2)}</div>
                <div>Status: {f.status}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
      {/* list of search results dsiplayed below */}
    </>
  );
}