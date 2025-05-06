import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function CancelTrips({ user }) {
  const [upcomingFlights, setUpcomingFlights] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchMyPurchases() {
      setError('');
      setLoading(true);
      try {
        console.log("📡 Fetching from /api/purchases/my with user:", user);
        const res = await axios.get('http://127.0.0.1:5000/api/purchases/my', {
          withCredentials: false,
          headers: {
            'X-User-Id': user.id
          }
        });

        console.log("🧑 Current user:", user);
        console.log("✅ Response from /api/purchases:", res);

        const cancellable = (res.data.purchases || []);
        setUpcomingFlights(cancellable);
      } catch (err) {
        console.error("❌ Axios error:", err);
        setError(err.response?.data?.msg || err.message);
      } finally {
        setLoading(false);
      }
    }

    console.log("🔍 useEffect triggered with user:", user);
    if (user?.role === 'customer') fetchMyPurchases();
  }, [user]);

  const handleCancel = async (ticket_ID) => {
    setError('');
    console.log("🗑 Attempting to cancel ticket:", ticket_ID);

    try {
      console.log(ticket_ID);
      const res = await axios.delete(`http://127.0.0.1:5000/api/tickets/${ticket_ID}`, {
        withCredentials: false,
        headers: {
          'X-User-Id': user.id,
          'X-Ticket-Id': ticket_ID
          
        },
      });

      console.log("✅ Cancellation success:", res);
      setUpcomingFlights(prev => prev.filter(f => f.ticket_id !== ticket_ID));
    } catch (err) {
      console.error("❌ Cancel error:", err);
      setError(err.response?.data?.msg || err.message);
    }
  };

  return (
    <div className="cancel-trips-container max-w-3xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-semibold mb-4">Cancel a Trip</h2>

      {error && <div className="text-red-600 mb-4">Error: {error}</div>}

      {loading ? (
        <p>Loading your upcoming trips...</p>
      ) : upcomingFlights.length === 0 ? (
        <p>You have no cancellable upcoming trips (must be more than 24 hours before departure).</p>
      ) : (
        <ul className="space-y-4">
         {upcomingFlights.map(f => (
            <li key={f.ticket_ID} className="border p-4 rounded flex justify-between items-center">
              <div>
                <div><strong>{f.airline_name} {f.flight_number}</strong></div>
                <div>Departs: {new Date(f.departure_timestamp).toLocaleString()}</div>
              </div>
              <button
                onClick={() => handleCancel(f.ticket_ID)}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                Cancel
              </button>
            </li>
          ))}

        </ul>
      )}
    </div>
  );
}
