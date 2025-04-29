// src/pages/ViewFlightRatings.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ViewFlightRatings() {
  const [ratings, setRatings] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const res = await axios.get('/api/ratings/');
        setRatings(res.data || []);
      } catch (err) {
        setError('Failed to load ratings.');
      }
    };

    fetchRatings();
  }, []);

  return (
    <div className="view-flight-ratings-container max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6 text-center">Flight Ratings and Comments</h2>

      {error && <p className="text-red-600 text-center">{error}</p>}

      <div className="space-y-4">
        {ratings.length === 0 && !error && (
          <p className="text-center">No ratings available yet.</p>
        )}
        
        {ratings.map((rating) => (
          <div
            key={rating.ticket_ID}
            className="p-4 border rounded shadow hover:bg-gray-50 transition"
          >
            <div className="flex justify-between mb-2">
              <div><strong>Ticket ID:</strong> {rating.ticket_ID}</div>
              <div><strong>Rating:</strong> {rating.rating} ⭐</div>
            </div>
            <div className="mb-2">
              <strong>Comment:</strong>
              <p className="ml-2">{rating.comment}</p>
            </div>
            <div className="text-sm text-gray-500">
              <strong>Customer:</strong> {rating.email}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ViewFlightRatings;
