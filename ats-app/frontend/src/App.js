// src/App.js
import React, { useState } from 'react';
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
import FlightRatings from './FlightRatings';
import Reports from './Reports';

function App() {
  const [user, setUser] = useState(null);

  return (
    <div>
      <Navbar user={user} setUser={setUser} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register setUser={setUser} />} />
        {/* Customer Pages */}
        <Route path="/customer-dashboard" element={user && user.role === 'customer' ? <CustomerDashboard /> : <Navigate to="/login" />} />
        <Route path="/search-flights" element={<SearchFlights />} />
        <Route path="/my-flights" element={<MyFlights />} />
        <Route path="/purchase-ticket" element={<PurchaseTicket />} />
        <Route path="/cancel-trip" element={<CancelTrip />} />
        <Route path="/rate-flight" element={<RateFlight />} />

        {/* Staff Pages */}
        <Route path="/staff-dashboard" element={user && user.role === 'staff' ? <StaffDashboard /> : <Navigate to="/login" />} />
        <Route path="/create-flight" element={<CreateFlight />} />
        <Route path="/change-flight-status" element={<ChangeFlightStatus />} />
        <Route path="/add-airplane" element={<AddAirplane />} />
        <Route path="/add-airport" element={<AddAirport />} />
        <Route path="/flight-ratings" element={<FlightRatings />} />
        <Route path="/reports" element={<Reports />} />
      </Routes>
    </div>
  );
}

export default App;
