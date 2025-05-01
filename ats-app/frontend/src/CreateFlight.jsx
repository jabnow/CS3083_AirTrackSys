import React, { useState } from 'react'
import axios from 'axios'

export default function CreateFlight({ user }) {
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
      const res = await axios.post('http://127.0.0.1:5000/api/flights/create', {
        airline_name: airlineName,
        flight_number: flightNumber,
        departure_timestamp: departureTimestamp,
        departure_airport_code: departureAirport,
        arrival_timestamp: arrivalTimestamp,
        arrival_airport_code: arrivalAirport,
        base_price: parseFloat(basePrice),
        airplane_ID: airplaneId
      }, {
        withCredentials: false,
        headers: {
          'X-User-Id': user.id,
          'X-User-Role': user.role
        }
      })

      console.log("✅ Flight created:", res.data)
      setSuccess(true)
      // clear form
      setAirlineName(''); setFlightNumber(''); setAirplaneId('')
      setDepartureTimestamp(''); setDepartureAirport('')
      setArrivalTimestamp(''); setArrivalAirport(''); setBasePrice('')
    } catch (err) {
      console.error("❌ Flight creation failed:", err)
      const errMsg = err.response?.data?.msg || err.message
      setError(errMsg)
    }
  }

  return (
    <div className="create-flight-container max-w-lg mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4 text-center">Create New Flight</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input type="text" placeholder="Airline Name" value={airlineName} onChange={e => setAirlineName(e.target.value)} required className="input w-full" />
        <input type="text" placeholder="Flight Number" value={flightNumber} onChange={e => setFlightNumber(e.target.value)} required className="input w-full" />
        <input type="text" placeholder="Airplane ID" value={airplaneId} onChange={e => setAirplaneId(e.target.value)} required className="input w-full" />
        <label className="block">Departure Time:</label>
        <input type="datetime-local" value={departureTimestamp} onChange={e => setDepartureTimestamp(e.target.value)} required className="input w-full" />
        <input type="text" placeholder="Departure Airport Code" value={departureAirport} onChange={e => setDepartureAirport(e.target.value)} required className="input w-full" />
        <label className="block">Arrival Time:</label>
        <input type="datetime-local" value={arrivalTimestamp} onChange={e => setArrivalTimestamp(e.target.value)} required className="input w-full" />
        <input type="text" placeholder="Arrival Airport Code" value={arrivalAirport} onChange={e => setArrivalAirport(e.target.value)} required className="input w-full" />
        <input type="number" step="0.01" placeholder="Base Price" value={basePrice} onChange={e => setBasePrice(e.target.value)} required className="input w-full" />
        <button type="submit" className="bg-blue-600 text-white py-2 w-full rounded hover:bg-blue-700">Submit</button>
      </form>
      {success && <div className="text-green-600 mt-3 text-center">Flight <strong>{flightNumber}</strong> created successfully!</div>}
      {error && <div className="text-red-600 mt-3 text-center">Error: {error}</div>}
    </div>
  )
}
