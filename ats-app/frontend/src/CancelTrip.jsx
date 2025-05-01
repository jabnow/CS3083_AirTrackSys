/* 
Need tickets table, purchased by a customer (so based on their customer email),
ticket should become purchaseable again in the tickets table

(Can't cancel if the flight departs in <24 hours, but this isn't a frontend 
thing)
*/

import React, { useState, useEffect } from 'react'
import { flights, tickets } from './services'

export default function CancelTrips({ user }) {
  const [upcomingFlights, setUpcomingFlights] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    async function fetchTrips() {
      setError('')
      setLoading(true)
      try {
        const now = new Date()
        const res = await flights.schedule({ type: 'customer', email: user.username })
        const allFlights = res.flights || []
        // Only allow cancellation for flights departing more than 24hrs from now
        const cancellable = allFlights.filter(f => {
          const dep = new Date(f.departure_date_time)
          const diffMs = dep - now
          return diffMs > 24 * 60 * 60 * 1000
        })
        setUpcomingFlights(cancellable)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    if (user && user.role === 'customer') fetchTrips()
  }, [user])

  const handleCancel = async ticketId => {
    setError('')
    try {
      await tickets.cancel(ticketId)
      setUpcomingFlights(prev => prev.filter(f => f.ticket_id !== ticketId))
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="cancel-trips-container max-w-3xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-semibold mb-4">Cancel a Trip</h2>
      {error && <div className="text-red-600 mb-4">Error: {error}</div>}
      {loading ? (
        <p>Loading your upcoming trips...</p>
      ) : upcomingFlights.length === 0 ? (
        <p>You have no cancellable upcoming trips (must be less than 24hrs before departure).</p>
      ) : (
        <ul className="space-y-4">
          {upcomingFlights.map(f => (
            <li key={f.ticket_id} className="border p-4 rounded flex justify-between items-center">
              <div>
                <div><strong>{f.airline_name} {f.flight_number}</strong></div>
                <div>Departs: {new Date(f.departure_date_time).toLocaleString()}</div>
                <div>From: {f.departure_airport_code} / To: {f.arrival_airport_code}</div>
              </div>
              <button
                onClick={() => handleCancel(f.ticket_id)}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                Cancel
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}