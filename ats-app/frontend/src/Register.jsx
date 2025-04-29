// src/Register.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register({ setUser }) {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState(''); // for staff
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Base payload
    const payload = {
      password,
      role,
    };

    if (role === 'staff') {
      payload.username = username;
      payload.employer_name = 'Delta'; // Or from a select input
      payload.first_name = 'Jane'; // You can collect these from form if needed
      payload.last_name = 'Doe';
      payload.date_of_birth = '1990-01-01';
    } else {
      payload.email = email;
      payload.first_name = 'John';
      payload.last_name = 'Smith';
      payload.building_number = '123';
      payload.street = 'Main St';
      payload.city = 'New York';
      payload.state = 'NY';
      payload.phone_number = '1234567890';
      payload.passport_number = 'A1234567';
      payload.passport_expiration = '2030-01-01';
      payload.passport_country = 'USA';
      payload.date_of_birth = '1990-01-01';
    }

    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', payload, {
        withCredentials: true,
      });
      console.log(res);
      setUser({ role });
      if (role === 'staff') {
        navigate('/staff-dashboard');
      } else {
        navigate('/customer-dashboard');
      }
    } catch (err) {
      const errMsg = err.response?.data?.msg || 'Registration failed';
      setMessage(errMsg);
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        {role === 'staff' ? (
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        ) : (
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        )}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="customer">Customer</option>
          <option value="staff">Airline Staff</option>
        </select>
        <button type="submit">Register</button>
      </form>
      {message && <p className="error-msg">{message}</p>}
    </div>
  );
}

export default Register;