// src/Register.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register({ setUser }) { // 🛠 Accept setUser from props
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const navigate = useNavigate(); // 🛠 Define navigate

  const handleSubmit = (e) => {
    e.preventDefault();
    setUser({ role: role }); // 🛠 No error now
    if (role === 'customer') {
      navigate('/customer-dashboard'); // 🛠 No error now
    } else {
      navigate('/staff-dashboard');
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="customer">Customer</option>
          <option value="staff">Airline Staff</option>
        </select>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
