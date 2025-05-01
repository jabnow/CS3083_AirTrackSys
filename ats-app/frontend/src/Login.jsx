// src/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login({ setUser }) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (!identifier || !password) {
      setError('Username/Email and password are required');
      return;
    }

    try {
      const payload = {
        password,
        role,
        ...(role === 'staff' ? { username: identifier } : { email: identifier }),
      };

      const res = await axios.post('http://127.0.0.1:5000/api/auth/login', payload, {
        withCredentials: true,
      });

      const userData = { id: res.data.id, role: res.data.role };
      console.log('✅ Login successful:', userData);
      setUser(userData);

      navigate(res.data.role === 'staff' ? '/staff-dashboard' : '/customer-dashboard');
    } catch (err) {
      console.error('❌ Login failed:', err);
      setError(err.response?.data?.msg || err.message);
    }
  };

  return (
    <div className="login-container max-w-md mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-semibold mb-4 text-center">Login</h2>
      {error && <p className="text-red-600 mb-2 text-center">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <select value={role} onChange={e => setRole(e.target.value)} className="input w-full">
          <option value="customer">Customer</option>
          <option value="staff">Staff</option>
        </select>

        <input
          type="text"
          placeholder={role === 'staff' ? 'Username' : 'Email'}
          value={identifier}
          onChange={e => setIdentifier(e.target.value)}
          required
          className="input w-full"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          className="input w-full"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Log In
        </button>
      </form>
    </div>
  );
}
