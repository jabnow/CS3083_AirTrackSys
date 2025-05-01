import React, { useState, useEffect } from 'react'
import axios from 'axios'

export default function MyFlights({ user }) {
  const [purchases, setPurchases] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {

    async function fetchMyPurchases() {
      setError('')
      setLoading(true)
      try {
        console.log("📡 Fetching from /api/purchases with user:", user );
        const res = await axios.get('http://127.0.0.1:5000/api/purchases/my', {
          withCredentials: false,
          headers: {
            'X-User-Id': user.id
          }
        
        })
        
        console.log("🧑 Current user:", user);
        console.log("✅ Response from /api/purchases:", res)
        setPurchases(res.data.purchases || [])
      } catch (err) {
        
        console.error("❌ Axios error:", err);
        setError(err.response?.data?.msg || err.message)
      }finally {
        setLoading(false)
      }
    }
    console.log("🔍 useEffect triggered with user:", user)
    if (user?.role === 'customer') fetchMyPurchases()
  }, [user])

  const now = new Date()
  const upcoming = purchases.filter(f => new Date(f.departure_timestamp) > now)
  const past     = purchases.filter(f => new Date(f.departure_timestamp) <= now)

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
              <li key={f.ticket_ID} className="border p-4 rounded">
                <div>{f.ticket_ID}</div>
                <div><strong>{f.airline_name} {f.flight_number}</strong></div>
                <div>Departs: {new Date(f.departure_timestamp).toLocaleString()}</div>
                <div>Price: ${f.sold_price.toFixed(2)}</div>
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
              <li key={f.ticket_ID} className="border p-4 rounded">
                <div><strong>{f.airline_name} {f.flight_number}</strong></div>
                <div>On: {new Date(f.departure_timestamp).toLocaleString()}</div>
                {f.rating && (
                  <div className="mt-2">
                    <div><strong>Your Rating:</strong> {f.rating} / 5</div>
                    {f.comment && <div><strong>Comment:</strong> {f.comment}</div>}
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
