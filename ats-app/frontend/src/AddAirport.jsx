// src/pages/AddAirport.jsx
import React, { useState } from 'react';
import axios from 'axios';

function AddAirport() {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    city: '',
    country: ''
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
      const res = await axios.post('/api/airports/', formData, { withCredentials: true });
      setMessage(res.data.msg || 'Airport created successfully!');
    } catch (err) {
      const errMsg = err.response?.data?.msg || err.response?.data?.error || 'Submission failed';
      setMessage(errMsg);
    }
  };

  return (
    <div className="add-airport-container max-w-md mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-semibold mb-4 text-center">Add New Airport</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="code" placeholder="Airport Code (e.g. JFK)" value={formData.code} onChange={handleChange} required className="input" />
        <input type="text" name="name" placeholder="Airport Name" value={formData.name} onChange={handleChange} required className="input" />
        <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} required className="input" />
        <input type="text" name="country" placeholder="Country" value={formData.country} onChange={handleChange} required className="input" />
        
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Submit
        </button>
      </form>
      {message && <p className="mt-3 text-center text-red-600">{message}</p>}
    </div>
  );
}

export default AddAirport;
