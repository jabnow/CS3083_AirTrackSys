// src/pages/CustomerDashboard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import PlaneImage from './components/plane2.jpeg'; // 🛫 Make sure the plane2.jpeg is correctly placed <li><Link to="/search-flights">Search Flights</Link></li>

function CustomerDashboard() {
  return (
    <>
      <style>
        {`
          .dashboard-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            background: linear-gradient(to bottom right, #f0f8ff, #ffffff);
            min-height: 100vh;
            padding: 30px;
          }

          .dashboard-title {
            font-size: 2.5rem;
            color: #003366;
            margin-bottom: 20px;
          }

          .customer-image {
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
            background-color: #0099cc;
            color: white;
            padding: 12px 20px;
            display: block;
            text-align: center;
            border-radius: 8px;
            transition: background-color 0.3s;
          }

          li a:hover {
            background-color: #0077aa;
          }
        `}
      </style>

      <div className="dashboard-container">
        <h2 className="dashboard-title">Customer Dashboard</h2>
        <img src={PlaneImage} alt="Customer Dashboard" className="customer-image" />

        <ul>
          
          <li><Link to="/my-flights">View My Flights</Link></li>
          <li><Link to="/purchase-ticket">Purchase Ticket</Link></li>
          <li><Link to="/cancel-trip">Cancel Trip</Link></li>
          <li><Link to="/rate-flight">Rate Flight</Link></li>
        </ul>
      </div>
    </>
  );
}

export default CustomerDashboard;
