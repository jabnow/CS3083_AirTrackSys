// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  /*const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }
    // Placeholder for API call for login
    if (email.includes('staff')) {
      setUser({ role: 'staff' });
      navigate('/staff-dashboard');
    } else {
      setUser({ role: 'customer' });
      navigate('/customer-dashboard');
    }
  };*/
  const handleSubmit = (e) => {
    e.preventDefault();
    // Temporary fake login
    setUser({ role: 'customer' }); // or role: 'staff'
    navigate('/customer-dashboard'); // or '/staff-dashboard'
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <p className="error-msg">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;