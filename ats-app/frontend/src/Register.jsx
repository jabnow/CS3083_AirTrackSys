import React, { useState } from 'react';
import axios from 'axios';

export default function Register() {
  const [role, setRole] = useState('customer');
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRoleChange = (e) => {
    setRole(e.target.value);
    setFormData({});  // reset form
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...formData, role };

    console.log("🚀 Registering user with payload:", payload);

    try {
      const res = await axios.post('http://127.0.0.1:5000/api/auth/register', payload,);
      console.log("✅ Registration successful:", res.data);
      setMessage(`✅ ${res.data.msg}`);
    } catch (error) {
      console.error("❌ Registration failed:", error.response?.data || error.message);
      setMessage(`❌ ${error.response?.data?.msg || 'Registration failed'}`);
    }
  };

  const customerFields = (
    <>
      <input name="email" placeholder="Email" onChange={handleChange} required />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
      <input name="first_name" placeholder="First Name" onChange={handleChange} />
      <input name="last_name" placeholder="Last Name" onChange={handleChange} />
      <input name="building_number" placeholder="Building #" onChange={handleChange} />
      <input name="street" placeholder="Street" onChange={handleChange} />
      <input name="city" placeholder="City" onChange={handleChange} />
      <input name="state" placeholder="State" onChange={handleChange} />
      <input name="phone_number" placeholder="Phone Number" onChange={handleChange} />
      <input name="passport_number" placeholder="Passport #" onChange={handleChange} />
      <input name="passport_expiration" type="date" placeholder="Passport Expiration" onChange={handleChange} />
      <input name="passport_country" placeholder="Passport Country" onChange={handleChange} />
      <input name="date_of_birth" type="date" placeholder="Date of Birth" onChange={handleChange} />
    </>
  );

  const staffFields = (
    <>
      <input name="username" placeholder="Username" onChange={handleChange} required />
      <input name="employer_name" placeholder="Airline (Employer)" onChange={handleChange} />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
      <input name="first_name" placeholder="First Name" onChange={handleChange} />
      <input name="last_name" placeholder="Last Name" onChange={handleChange} />
      <input name="date_of_birth" type="date" placeholder="Date of Birth" onChange={handleChange} />
      <input name="emails" placeholder="Emails (comma-separated)" onChange={handleChange} />
      <input name="phones" placeholder="Phones (comma-separated)" onChange={handleChange} />
    </>
  );

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
      <h2>Register as {role}</h2>
      <label>
        Role:
        <select value={role} onChange={handleRoleChange} style={{ marginLeft: 10 }}>
          <option value="customer">Customer</option>
          <option value="staff">Staff</option>
        </select>
      </label>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 20 }}>
        {role === 'customer' ? customerFields : staffFields}
        <button type="submit">Register</button>
      </form>
      {message && <p style={{ marginTop: 15 }}>{message}</p>}
    </div>
  );
}
