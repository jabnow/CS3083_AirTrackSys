import React, { useState } from 'react'
import { flights } from './services'

export default function CreateFlight() {
  const [airlineName, setAirlineName] = useState('')
  const [flightNumber, setFlightNumber] = useState('')
  const [airplaneId, setAirplaneId] = useState('')
  const [departureTimestamp, setDepartureTimestamp] = useState('')
  const [departureAirport, setDepartureAirport] = useState('')
  const [arrivalTimestamp, setArrivalTimestamp] = useState('')
  const [arrivalAirport, setArrivalAirport] = useState('')
  const [basePrice, setBasePrice] = useState('')
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async e => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    try {
      await flights.create({
        airline_name: airlineName,
        flight_number: flightNumber,
        departure_timestamp: departureTimestamp,
        departure_airport_code: departureAirport,
        arrival_timestamp: arrivalTimestamp,
        arrival_airport_code: arrivalAirport,
        base_price: parseFloat(basePrice),
        airplane_ID: airplaneId
      })
      setSuccess(true)
      // clear form
      setAirlineName('')
      setFlightNumber('')
      setAirplaneId('')
      setDepartureTimestamp('')
      setDepartureAirport('')
      setArrivalTimestamp('')
      setArrivalAirport('')
      setBasePrice('')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="create-flight-container">
      <h2>Create New Flight</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Airline Name"
          value={airlineName}
          onChange={e => setAirlineName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Flight Number"
          value={flightNumber}
          onChange={e => setFlightNumber(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Airplane ID"
          value={airplaneId}
          onChange={e => setAirplaneId(e.target.value)}
          required
        />
        <label>Departure Time:</label>
        <input
          type="datetime-local"
          value={departureTimestamp}
          onChange={e => setDepartureTimestamp(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Departure Airport Code"
          value={departureAirport}
          onChange={e => setDepartureAirport(e.target.value)}
          required
        />
        <label>Expected Arrival Time:</label>
        <input
          type="datetime-local"
          value={arrivalTimestamp}
          onChange={e => setArrivalTimestamp(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Arrival Airport Code"
          value={arrivalAirport}
          onChange={e => setArrivalAirport(e.target.value)}
          required
        />
        <input
          type="number"
          step="0.01"
          placeholder="Base Ticket Price"
          value={basePrice}
          onChange={e => setBasePrice(e.target.value)}
          required
        />
        <button type="submit">Submit</button>
      </form>

      {success && (
        <div className="success">
          Flight <strong>{flightNumber}</strong> created successfully!
        </div>
      )}
      {error && <div className="error">Error: {error}</div>}
    </div>
  )
}