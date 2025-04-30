// src/pages/ChangeFlightStatus.jsx
import React, { useState } from 'react'
import { flights } from './services'

export default function ChangeFlightStatus() {
  const [airlineName, setAirlineName] = useState('')
  const [flightNumber, setFlightNumber] = useState('')
  const [departureTimestamp, setDepartureTimestamp] = useState('')
  const [status, setStatus] = useState('')
  const [message, setMessage] = useState('')
  const [msgType, setMsgType] = useState('') 

  const handleSubmit = async e => {
    e.preventDefault()
    setMessage('')
    setMsgType('')

    try {
      await flights.updateStatus({
        airline_name: airlineName,
        flight_number: flightNumber,
        departure_timestamp: departureTimestamp,
        status
      })
      setMessage('Status updated successfully!')
      setMsgType('success')
      // or clear only the status field
      setStatus('')
    } catch (err) {
      setMessage(err.message)
      setMsgType('error')
    }
  }

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
          <option value="">Select Status</option>
          <option value="scheduled">Scheduled</option>
          <option value="ontime">On-Time</option>
          <option value="delayed">Delayed</option>
          <option value="departed">Departed</option>
          <option value="arrived">Arrived</option>
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
  )
}