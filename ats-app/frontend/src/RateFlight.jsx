// src/pages/RateFlight.jsx
import React, { useState } from 'react';
import axios from 'axios';

function RateFlight() {
  const [formData, setFormData] = useState({
    ticket_ID: '',
    rating: '',
    comment: ''
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('/api/ratings/', formData, { withCredentials: true });
      setMessage(res.data.msg || 'Flight rated successfully!');
    } catch (err) {
      const errMsg = err.response?.data?.msg || err.response?.data?.error || 'Submission failed';
      setMessage(errMsg);
    }
  };

  return (
    <div className="rate-flight-container max-w-lg mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-semibold mb-4 text-center">Rate and Comment on Flight</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <div>
          <label className="block mb-1">Ticket ID</label>
          <input
            type="text"
            name="ticket_ID"
            placeholder="Your Ticket ID"
            value={formData.ticket_ID}
            onChange={handleChange}
            required
            className="input"
          />
        </div>

        <div>
          <label className="block mb-1">Rating (0-5)</label>
          <input
            type="number"
            name="rating"
            min="0"
            max="5"
            step="1"
            placeholder="Rating (0-5)"
            value={formData.rating}
            onChange={handleChange}
            required
            className="input"
          />
        </div>

        <div>
          <label className="block mb-1">Comment</label>
          <textarea
            name="comment"
            placeholder="Write your comment..."
            value={formData.comment}
            onChange={handleChange}
            required
            className="input h-24"
          ></textarea>
        </div>

        <div className="text-center">
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Submit Rating
          </button>
        </div>
      </form>

      {message && <p className="mt-3 text-center text-red-600">{message}</p>}
    </div>
  );
}

export default RateFlight;
