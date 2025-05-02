// src/pages/ChangeFlightStatus.jsx
import React, { useState } from 'react';
import axios from 'axios';

export default function ChangeFlightStatus() {
  const [formData, setFormData] = useState({
    airline_name: '',
    flight_number: '',
    departure_timestamp: '',
    status: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = e => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    // build a payload with seconds appended
    const payload = {
      ...formData,
      // "2024-12-01T10:00" → "2024-12-01T10:00:00"
      departure_timestamp: formData.departure_timestamp + ':00' // format YYYY-MM-DDTHH:MM:SS
    };

    try {
      const res = await axios.post(
        'http://localhost:5000/api/flights_api/status',
        payload,
        { withCredentials: true }
      );
      setMessage(res.data.msg);
    } catch (err) {
      setMessage(err.response?.data?.msg || err.message);
    }
  };

  return (
    <div className="change-flight-status-container max-w-lg mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-semibold mb-4 text-center">Change Flight Status</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="airline_name"
          placeholder="Airline Name"
          value={formData.airline_name}
          onChange={handleChange}
          required
          className="input"
        />
        <input
          type="text"
          name="flight_number"
          placeholder="Flight Number"
          value={formData.flight_number}
          onChange={handleChange}
          required
          className="input"
        />
        <input
          type="datetime-local"
          name="departure_timestamp"
          value={formData.departure_timestamp}
          onChange={handleChange}
          required
          className="input"
          step="60"                     /* only minute‐resolution */
        />
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          required
          className="input"
        >
          <option value="">Select Status</option>
          <option value="On-Time">On-Time</option>
          <option value="Delayed">Delayed</option>
          <option value="Arrived">Arrived</option>
          <option value="Boarding">Boarding</option>
          <option value="Cancelled">Cancelled</option>
        </select>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Update Status
        </button>
      </form>
      {message && <p className="mt-3 text-center text-red-600">{message}</p>}
    </div>
  );
}