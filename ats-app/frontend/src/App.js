// src/App.js
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './Home';
import Login from './Login';
import Register from './Register';
import CustomerDashboard from './CustomerDashboard';
import StaffDashboard from './StaffDashboard';
import SearchFlights from './SearchFlights';
import MyFlights from './MyFlights';
import PurchaseTicket from './PurchaseTicket';
import CancelTrip from './CancelTrip';
import RateFlight from './RateFlight';
import CreateFlight from './CreateFlight';
import ChangeFlightStatus from './ChangeFlightStatus';
import AddAirplane from './AddAirplane';
import AddAirport from './AddAirport';
import Reports from './Reports';
import ViewFlightRatings from './ViewFlightRatings';

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const handleSetUser = (data) => {
    localStorage.setItem('user', JSON.stringify(data));
    setUser(data);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <div>
      <Navbar user={user} setUser={handleLogout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setUser={handleSetUser} />} />
        <Route path="/register" element={<Register setUser={handleSetUser} />} />

        {/* Customer Routes */}
        <Route path="/customer-dashboard" element={user?.role === 'customer' ? <CustomerDashboard /> : <Navigate to="/login" />} />
        <Route path="/search-flights" element={<SearchFlights />} />
        <Route path="/my-flights" element={<MyFlights user={user} />} />
        <Route path="/purchase-ticket" element={<PurchaseTicket user={user}/>} />
        <Route path="/cancel-trip" element={<CancelTrip user={user}/>} />
        <Route path="/rate-flight" element={<RateFlight />} />

        {/* Staff Routes */}
        <Route path="/staff-dashboard" element={user?.role === 'staff' ? <StaffDashboard /> : <Navigate to="/login" />} />
        <Route path="/create-flight" element={<CreateFlight  user={user}/>} />
        <Route path="/change-flight-status" element={<ChangeFlightStatus  user={user}/>} />
        <Route path="/add-airplane" element={<AddAirplane user={user} />} />
        <Route path="/add-airport" element={<AddAirport  user={user}/>} />
        <Route path="/flight-ratings" element={<ViewFlightRatings user={user} />} />
        <Route path="/reports" element={<Reports user={user} />} />
      </Routes>
    </div>
  );
}
