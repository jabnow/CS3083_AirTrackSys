// src/pages/StaffDashboard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import StaffImage from './components/plane2.jpeg'; // assuming you named the new image 'image2.jpeg'

function StaffDashboard() {
  return (
    <>
      <style>
        {`
          .dashboard-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            background: linear-gradient(to bottom right, #e6f0ff, #ffffff);
            min-height: 100vh;
            padding: 30px;
          }

          .dashboard-title {
            font-size: 2.5rem;
            color: #003366;
            margin-bottom: 20px;
          }

          .staff-image {
            width: 250px;
            height: auto;
            margin-bottom: 30px;
            border-radius: 12px;
            box-shadow: 0px 4px 12px rgba(0,0,0,0.1);
          }

          ul {
            list-style: none;
            padding: 0;
            width: 100%;
            max-width: 600px;
          }

          li {
            margin: 10px 0;
          }

          li a {
            text-decoration: none;
            font-size: 1.2rem;
            background-color: #0077cc;
            color: white;
            padding: 12px 20px;
            display: block;
            text-align: center;
            border-radius: 8px;
            transition: background-color 0.3s;
          }

          li a:hover {
            background-color: #005fa3;
          }
        `}
      </style>

      <div className="dashboard-container">
        <h2 className="dashboard-title">Staff Dashboard</h2>
        <img src={StaffImage} alt="Staff Dashboard" className="staff-image" />

        <ul>
          <li><Link to="/create-flight">Create Flight</Link></li>
          <li><Link to="/change-flight-status">Change Flight Status</Link></li>
          <li><Link to="/add-airplane">Add Airplane</Link></li>
          <li><Link to="/add-airport">Add Airport</Link></li>
          <li><Link to="/flight-ratings">View Flight Ratings</Link></li>
          <li><Link to="/reports">View Reports</Link></li>
        </ul>
      </div>
    </>
  );
}

export default StaffDashboard;