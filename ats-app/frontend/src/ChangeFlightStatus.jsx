import React, { useState } from 'react';
import axios from 'axios';

export default function ChangeFlightStatus({ user }) {
  const [airlineName, setAirlineName] = useState('');
  const [flightNumber, setFlightNumber] = useState('');
  const [departureTimestamp, setDepartureTimestamp] = useState('');
  const [status, setStatus] = useState('');
  const [message, setMessage] = useState('');
  const [msgType, setMsgType] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setMsgType('');

    try {
      const res = await axios.post('http://127.0.0.1:5000/api/flights/status', {
        airline_name: airlineName,
        flight_number: flightNumber,
        departure_timestamp: departureTimestamp,
        status,
      }, {
        headers: {
          'X-User-Id': user.id,
          'X-User-Role': user.role,
        },
      });

      setMessage(res.data.msg || 'Status updated successfully!');
      setMsgType('success');
      setStatus('');
    } catch (err) {
      setMessage(err.response?.data?.msg || err.message);
      setMsgType('error');
    }
  };

  return (
    <div className="change-flight-status-container max-w-lg mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-semibold mb-4 text-center">Change Flight Status</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Airline Name"
          value={airlineName}
          onChange={e => setAirlineName(e.target.value)}
          required
          className="input w-full"
        />
        <input
          type="text"
          placeholder="Flight Number"
          value={flightNumber}
          onChange={e => setFlightNumber(e.target.value)}
          required
          className="input w-full"
        />
        <label>Departure Time:</label>
        <input
          type="datetime-local"
          value={departureTimestamp}
          onChange={e => setDepartureTimestamp(e.target.value)}
          required
          className="input w-full"
        />
        <select
          value={status}
          onChange={e => setStatus(e.target.value)}
          required
          className="input w-full"
        >
           <option value="On-Time">On-Time</option>
           <option value="Delayed">Delayed</option>
           <option value="Arrived">Arrived</option>
           <option value="Boarding">Boarding</option>
           <option value="Cancelled">Cancelled</option>
        </select>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
        >
          Update Status
        </button>
      </form>
      {message && (
        <p className={msgType === 'error' ? 'text-red-600 mt-3 text-center' : 'text-green-600 mt-3 text-center'}>
          {message}
        </p>
      )}
    </div>
  );
}
