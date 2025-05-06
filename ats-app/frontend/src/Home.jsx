// src/pages/Home.jsx
import React, { useState } from 'react';
import PlaneImage from './components/plane.jpeg';
import axios from 'axios';
import { useEffect } from 'react';


export default function Home() {
  const [roundTrip, setRoundTrip] = useState(false);
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [flightResults, setFlightResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

<<<<<<< HEAD
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

=======
  const handleCheckboxChange = (e) => setRoundTrip(e.target.checked);
>>>>>>> 314022ba289213974eb697bb8fa7df8fde3a447e
  const handleSearchFlights = async (e) => {
    e.preventDefault();
    setError(null);
    setFlightResults([]);
    const params = {};
  
    if (source) {
      params.source_airport = source;
      params.source_city = source;
    }
    if (destination) {
      params.destination_airport = destination;
      params.destination_city = destination;
    }
    if (departureDate) {
      params.departure_date = departureDate;
    }
    if (roundTrip && returnDate) {
      params.return_date = returnDate;
    }
  
    console.log("📡 Sending flight search with:", params);
  
    try {
      const res = await axios.get('http://127.0.0.1:5000/api/flights/future', {
        params,
        withCredentials: false,
      });
      console.log("✅ Flights received:", res.data);
      setFlightResults(res.data.flights_to || []);
    } catch (err) {
      console.error("❌ Search error:", err);
      setError(err.response?.data?.msg || err.message);
    }
  };
  


  useEffect(() => {

    const fetchAllFutureFlights = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://127.0.0.1:5000/api/flights/future');
        setFlightResults(response.data.flights_to || []);
      } catch (err) {
        console.error('Error fetching default future flights:', err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchAllFutureFlights();
  }, []);
  
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', background: '#f4f8fc', minHeight: '100vh', padding: '40px' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#fff',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        padding: '20px',
        borderRadius: '12px',
        marginBottom: '40px',
        maxWidth: '1000px',
        margin: 'auto'
      }}>
        <img src={PlaneImage} alt="Airplane" style={{ width: '200px', borderRadius: '10px', marginRight: '30px' }} />
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '10px', color: '#003366' }}>Air Ticket Reservation System</h1>
          <p style={{ fontSize: '1.1rem', color: '#555' }}>Book your flights with ease and comfort.</p>
        </div>
      </div>

      <div style={{
        backgroundColor: '#ffffff',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.08)',
        maxWidth: '800px',
        margin: 'auto'
      }}>
        <h2 style={{ marginBottom: '20px', color: '#004080' }}>Find Your Perfect Flight</h2>
        <form onSubmit={handleSearchFlights} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', gap: '20px' }}>
            <input type="text" placeholder="Source Airport Code (e.g. PVG)" value={source}
              onChange={e => setSource(e.target.value)}
              style={inputStyle} />
            <input type="text" placeholder="Destination Airport Code (e.g. JFK)" value={destination}
              onChange={e => setDestination(e.target.value)}
              style={inputStyle} />
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <input type="date" value={departureDate}
              onChange={e => setDepartureDate(e.target.value)}
              style={inputStyle} />
            {roundTrip &&
              <input type="date" value={returnDate}
                onChange={e => setReturnDate(e.target.value)}
                style={inputStyle} />}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input type="checkbox" id="roundTrip" checked={roundTrip} onChange={handleCheckboxChange} />
            <label htmlFor="roundTrip">Round Trip</label>
          </div>
          <button type="submit" style={buttonStyle}>Search Flights</button>
          {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
        </form>
      </div>

      <div style={{ maxWidth: '800px', margin: '40px auto 0' }}>
        {loading && <p>Loading flights...</p>}
        {!loading && flightResults.length > 0 && (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {flightResults.map(f => (
              <li key={`${f.airline_name}-${f.flight_number}-${f.departure_timestamp}`} style={cardStyle}>
                <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{f.airline_name} {f.flight_number}</div>
                <div>Departure: {new Date(f.departure_timestamp).toLocaleString()}</div>
                <div>From: {f.departure_airport_code} → To: {f.arrival_airport_code}</div>
                <div>Price: ${parseFloat(f.base_price).toFixed(2)}</div>
                <div>Status: {f.status}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

const inputStyle = {
  flex: 1,
  padding: '10px',
  borderRadius: '6px',
  border: '1px solid #ccc',
  fontSize: '1rem',
  width: '100%'
};

const buttonStyle = {
  padding: '12px',
  fontSize: '1rem',
  backgroundColor: '#0077cc',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  marginTop: '10px'
};

const cardStyle = {
  border: '1px solid #ddd',
  borderRadius: '10px',
  padding: '20px',
  backgroundColor: '#fff',
  marginBottom: '20px',
  boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
};
