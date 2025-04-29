// src/pages/CreateFlight.jsx
import React, { useState } from 'react';
import axios from 'axios';

function CreateFlight() {
  const [formData, setFormData] = useState({
    airline_name: '',
    flight_number: '',
    departure_timestamp: '',
    departure_airport_code: '',
    arrival_timestamp: '',
    arrival_airport_code: '',
    base_price: '',
    airplane_ID: ''
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('/api/flights/', formData, { withCredentials: true });
      setMessage(res.data.msg || 'Flight created successfully!');
    } catch (err) {
      const errMsg = err.response?.data?.msg || err.response?.data?.error || 'Submission failed';
      setMessage(errMsg);
    }
  };

  return (
    <div className="create-flight-container max-w-xl mx-auto p-6 bg-white shadow-md rounded-xl">
      <h2 className="text-2xl font-semibold mb-4 text-center">Create New Flight</h2>
      
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block mb-1">Airline Name</label>
          <input
            type="text"
            name="airline_name"
            placeholder="Airline Name"
            value={formData.airline_name}
            onChange={handleChange}
            required
            className="input"
          />
        </div>

        <div>
          <label className="block mb-1">Flight Number</label>
          <input
            type="text"
            name="flight_number"
            placeholder="Flight Number"
            value={formData.flight_number}
            onChange={handleChange}
            required
            className="input"
          />
        </div>

        <div>
          <label className="block mb-1">Departure Time</label>
          <input
            type="datetime-local"
            name="departure_timestamp"
            value={formData.departure_timestamp}
            onChange={handleChange}
            required
            className="input"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Departure Airport Code</label>
            <input
              type="text"
              name="departure_airport_code"
              placeholder="e.g., JFK"
              value={formData.departure_airport_code}
              onChange={handleChange}
              required
              className="input"
            />
          </div>
          <div>
            <label className="block mb-1">Arrival Airport Code</label>
            <input
              type="text"
              name="arrival_airport_code"
              placeholder="e.g., LAX"
              value={formData.arrival_airport_code}
              onChange={handleChange}
              required
              className="input"
            />
          </div>
        </div>

        <div>
          <label className="block mb-1">Expected Arrival Time</label>
          <input
            type="datetime-local"
            name="arrival_timestamp"
            value={formData.arrival_timestamp}
            onChange={handleChange}
            required
            className="input"
          />
        </div>

        <div>
          <label className="block mb-1">Base Ticket Price ($)</label>
          <input
            type="number"
            step="0.01"
            name="base_price"
            placeholder="e.g., 199.99"
            value={formData.base_price}
            onChange={handleChange}
            required
            className="input"
          />
        </div>

        <div>
          <label className="block mb-1">Airplane ID</label>
          <input
            type="text"
            name="airplane_ID"
            placeholder="Airplane ID"
            value={formData.airplane_ID}
            onChange={handleChange}
            required
            className="input"
          />
        </div>

        {/* Status field removed because backend hardcodes it to 'scheduled' */}

        <div className="text-center">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Submit
          </button>
        </div>
      </form>

      {message && <p className="mt-3 text-center text-red-600">{message}</p>}
    </div>
  );
}

export default CreateFlight;
