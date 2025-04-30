// src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    navigate('/');
  };

  return (
    <>
      <style>
        {`
          .navbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background-color: #003366;
            padding: 15px 30px;
            color: white;
            box-shadow: 0px 4px 8px rgba(0,0,0,0.1);
          }

          .nav-logo {
            font-size: 1.8rem;
            color: white;
            text-decoration: none;
            font-weight: bold;
          }

          .nav-links {
            display: flex;
            align-items: center;
            gap: 20px;
          }

          .nav-links a {
            color: white;
            text-decoration: none;
            font-size: 1rem;
            transition: color 0.3s;
          }

          .nav-links a:hover {
            color: #66b2ff;
          }

          .nav-links button {
            background: none;
            border: 1px solid white;
            color: white;
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 1rem;
            transition: background-color 0.3s, color 0.3s;
          }

          .nav-links button:hover {
            background-color: white;
            color: #003366;
          }
        `}
      </style>

      <nav className="navbar">
        <Link to="/" className="nav-logo">AirTrackSys</Link>
        <div className="nav-links">
          {!user && (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
          {user && user.role === 'customer' && (
            <>
              <Link to="/customer-dashboard">Dashboard</Link>
              <button onClick={handleLogout}>Logout</button>
            </>
          )}
          {user && user.role === 'staff' && (
            <>
              <Link to="/staff-dashboard">Dashboard</Link>
              <button onClick={handleLogout}>Logout</button>
            </>
          )}
        </div>
      </nav>
    </>
  );
}

export default Navbar;
