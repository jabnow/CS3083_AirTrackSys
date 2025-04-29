// src/pages/AddAirplane.jsx
import React, { useState } from 'react';
import axios from 'axios';

function AddAirplane() {
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
    try {
      const res = await axios.put('/api/airplane/', formData);
      setMessage(res.data.msg || 'Airplane added!');
    } catch (err) {
      const errMsg = err.response?.data?.msg || err.response?.data?.error || 'Submission failed';
      setMessage(errMsg);
    }
  };

  return (
    <div className="add-airplane-container max-w-md mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Add New Airplane</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input type="text" name="airplane_ID" placeholder="Airplane ID" value={formData.airplane_ID} onChange={handleChange} required className="input" />
        <input type="text" name="owner_name" placeholder="Owner Name" value={formData.owner_name} onChange={handleChange} required className="input" />
        <input type="number" name="seats" placeholder="Number of Seats" value={formData.seats} onChange={handleChange} required className="input" />
        <input type="text" name="manufacturer" placeholder="Manufacturer" value={formData.manufacturer} onChange={handleChange} required className="input" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Submit</button>
      </form>
      {message && <p className="mt-2 text-red-600">{message}</p>}
    </div>
  );
}

export default AddAirplane;
