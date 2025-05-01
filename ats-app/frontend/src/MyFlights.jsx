import React, { useState, useEffect } from 'react'
import { flights } from './services'

export default function MyFlights({ user }) {
  const [flightsData, setFlightsData] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function fetchMyFlights() {
      setError('')
      setLoading(true)
      try {
        const res = await flights.schedule({
          type: 'customer',
          email: user.username
        })
        setFlightsData(res.flights || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    if (user && user.role === 'customer') fetchMyFlights()
  }, [user])

  const now = new Date()
  const upcoming = flightsData.filter(f => new Date(f.departure_date_time) > now)
  const past     = flightsData.filter(f => new Date(f.departure_date_time) <= now)

  return (
    <div className="my-flights-container max-w-4xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-semibold mb-4">My Flights</h2>
      {error && <div className="text-red-600 mb-4">Error: {error}</div>}
      {loading && <p>Loading your flights...</p>}

      {!loading && upcoming.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Upcoming Flights</h3>
          <ul className="space-y-4">
            {upcoming.map(f => (
              <li key={f.ticket_id} className="border p-4 rounded">
                <div><strong>{f.airline_name} {f.flight_number}</strong></div>
                <div>Departs: {new Date(f.departure_date_time).toLocaleString()} from {f.departure_airport_code}</div>
                <div>Arrives: {new Date(f.arrival_date_time).toLocaleString()} at {f.arrival_airport_code}</div>
                <div>Status: {f.status}</div>
                <div>Price: ${f.calculated_price?.toFixed(2) ?? f.base_price.toFixed(2)}</div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {!loading && past.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Past Flights</h3>
          <ul className="space-y-4">
            {past.map(f => (
              <li key={f.ticket_id} className="border p-4 rounded">
                <div><strong>{f.airline_name} {f.flight_number}</strong></div>
                <div>On: {new Date(f.departure_date_time).toLocaleString()}</div>
                {f.comment && (
                  <div className="mt-2">
                    <div><strong>Your Rating:</strong> {f.comment.rating} / 5</div>
                    {f.comment.comment && <div><strong>Comment:</strong> {f.comment.comment}</div>}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {!loading && upcoming.length === 0 && past.length === 0 && (
        <p className="text-gray-700">You have no flights booked.</p>
      )}
    </div>
  )
}