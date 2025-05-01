import React, { useState, useEffect } from 'react'
import { ratings } from './services'

export default function FlightRatings() {
  const [ratingsData, setRatingsData] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchRatings() {
      try {
        const res = await ratings.list()
        setRatingsData(res.ratings || [])
      } catch (err) {
        setError(err.message)
      }
    }
    fetchRatings()
  }, [])

  return (
    <div className="flight-ratings-container max-w-xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-semibold mb-4">Your Flight Ratings</h2>
      {error && <div className="text-red-600 mb-4">Error: {error}</div>}
      {ratingsData.length === 0 ? (
        <p className="text-gray-700">You have not rated any flights yet.</p>
      ) : (
        <ul className="space-y-4">
          {ratingsData.map(r => (
            <li key={r.ticket_ID} className="border p-4 rounded">
              <div><strong>Ticket ID:</strong> {r.ticket_ID}</div>
              <div><strong>Rating:</strong> {r.rating} / 5</div>
              {r.comment && <div><strong>Comment:</strong> {r.comment}</div>}
              <div className="text-sm text-gray-500">
                Rated on: {new Date(r.purchase_timestamp).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}