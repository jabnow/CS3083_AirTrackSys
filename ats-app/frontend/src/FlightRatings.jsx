import React, { useState, useEffect } from 'react'
import { ratings } from './services'

export default function FlightRatings() {
  const [ratingsData, setRatingsData] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchRatings() {
      try {
        const res = await ratings.list()
        // Filter out future flights based on arrival time
        const pastFlights = (res.ratings || []).filter(flight => 
          new Date(flight.arrival_timestamp) < new Date()
        )
        setRatingsData(pastFlights)
      } catch (err) {
        setError(err.message)
      }
    }
    fetchRatings()
  }, [])

  return (
    <div className="flight-ratings-container max-w-xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-semibold mb-4">Your Past Flight Ratings</h2>
      {error && <div className="text-red-600 mb-4">Error: {error}</div>}
      {ratingsData.length === 0 ? (
        <p className="text-gray-700">You have no past flights to rate yet.</p>
      ) : (
        <ul className="space-y-4">
          {ratingsData.map(r => (
            <li key={r.ticket_ID} className="border p-4 rounded">
              <div className="flex justify-between items-start">
                <div>
                  <div><strong>Ticket ID:</strong> {r.ticket_ID}</div>
                  {r.rating ? (
                    <>
                      <div><strong>Rating:</strong> {r.rating} / 5</div>
                      {r.comment && <div><strong>Comment:</strong> {r.comment}</div>}
                    </>
                  ) : (
                    <div className="text-yellow-600">Flight eligible for rating</div>
                  )}
                </div>
                <div className="text-sm text-gray-500">
                  Flight date: {new Date(r.arrival_timestamp).toLocaleDateString()}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}