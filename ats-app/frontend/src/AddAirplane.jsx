import React, { useState } from 'react';
import axios from 'axios';

export default function AddAirplane({ user }) {
  const [formData, setFormData] = useState({
    airplane_ID: '',
    owner_name: '',
    seats: '',
    manufacturer: ''
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
    setMessage('');
    console.log("🛫 Submitting airplane form:", formData);

    try {
      const res = await axios.put('http://127.0.0.1:5000/api/airplane/', formData, {
        headers: {
          'X-User-Id': user.id
        }
      });

      console.log("✅ Airplane added:", res.data);
      setMessage(res.data.msg || 'Airplane added!');
    } catch (err) {
      console.error("❌ Error adding airplane:", err);
      const errMsg = err.response?.data?.msg || err.response?.data?.error || 'Submission failed';
      setMessage(errMsg);
    }
  };

  return (
    <div className="add-airplane-container max-w-md mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4 text-center">Add New Airplane</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input type="text" name="airplane_ID" placeholder="Airplane ID" value={formData.airplane_ID} onChange={handleChange} required className="input w-full" />
        <input type="text" name="owner_name" placeholder="Owner Name" value={formData.owner_name} onChange={handleChange} required className="input w-full" />
        <input type="number" name="seats" placeholder="Number of Seats" value={formData.seats} onChange={handleChange} required className="input w-full" />
        <input type="text" name="manufacturer" placeholder="Manufacturer" value={formData.manufacturer} onChange={handleChange} required className="input w-full" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full">Submit</button>
      </form>
      {message && <p className="mt-3 text-center text-red-600">{message}</p>}
    </div>
  );
}
