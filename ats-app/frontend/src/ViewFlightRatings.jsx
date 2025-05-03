import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ViewFlightRatings({ user }) {
  const [airlineName, setAirlineName] = useState('');
  const [flightNumber, setFlightNumber] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [ratings, setRatings] = useState([]);
  const [averageRating, setAverageRating] = useState(null);
  const [error, setError] = useState('');
  const [filtered, setFiltered] = useState(false); // track if user searched

  const fetchAllRatings = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:5000/api/ratings/all');
      setRatings(res.data.ratings || []);
      setAverageRating(null);
      setFiltered(false);
    } catch (err) {
      console.error("❌ Error fetching all ratings:", err);
      setError('Failed to load ratings.');
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    setAverageRating(null);

    // If all fields are empty, restore full list
    if (!airlineName && !flightNumber && !departureDate) {
      fetchAllRatings();
      return;
    }

    try {
      const res = await axios.get('http://127.0.0.1:5000/api/ratings/flight', {
        params: {
          airline_name: airlineName,
          flight_number: flightNumber,
          departure_timestamp: departureDate,
        },
        headers: {
          'X-User-Id': user.id,
          'X-User-Role': user.role,
        },
      });

      setAverageRating(res.data.average_rating);
      setRatings(res.data.reviews || []);
      setFiltered(true);
    } catch (err) {
      console.error("❌ Error fetching flight ratings:", err);
      setError('Failed to fetch flight ratings.');
    }
  };

  useEffect(() => {
    if (user?.id) fetchAllRatings();
  }, [user]);

  return (
    <div className="view-flight-ratings-container max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6 text-center">Flight Ratings and Comments</h2>

      <form onSubmit={handleSearch} className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-6">
        <input
          type="text"
          value={airlineName}
          onChange={(e) => setAirlineName(e.target.value)}
          placeholder="Airline Name"
          className="p-2 border rounded"
        />
        <input
          type="text"
          value={flightNumber}
          onChange={(e) => setFlightNumber(e.target.value)}
          placeholder="Flight Number"
          className="p-2 border rounded"
        />
        <input
          type="date"
          value={departureDate}
          onChange={(e) => setDepartureDate(e.target.value)}
          className="p-2 border rounded"
        />
        <button
          type="submit"
          className="col-span-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          {filtered ? 'Search Again or Clear' : 'Search Specific Flight'}
        </button>
      </form>

      {error && <p className="text-red-600 text-center">{error}</p>}

      {averageRating !== null && (
        <div className="mb-6 text-center">
          <h3 className="text-xl font-medium">Average Rating: {averageRating} ⭐</h3>
        </div>
      )}

      <div className="space-y-4">
        {ratings.length === 0 && !error && (
          <p className="text-center">No ratings available.</p>
        )}

        {ratings.map((rating, idx) => (
          <div
            key={idx}
            className="p-4 border rounded shadow hover:bg-gray-50 transition"
          >
            <div className="flex justify-between mb-2">
              <div><strong>Email:</strong> {rating.email}</div>
              <div><strong>Rating:</strong> {rating.rating} ⭐</div>
            </div>
            <div className="mb-2">
              <strong>Comment:</strong>
              <p className="ml-2">{rating.comment}</p>
            </div>
            <div className="text-sm text-gray-500">
              <strong>Purchased on:</strong> {new Date(rating.purchase_timestamp).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ViewFlightRatings;
