// src/pages/Register.jsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth } from './services'

export default function Register({ setUser }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('customer')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    if (!email || !password) {
      setError('Email and password are required')
      return
    }

    try {
      // Call the register endpoint
      const res = await auth.register({ email, password, role })
      // Expecting { username, type } in response
      setUser({ username: res.username, role: res.type })
      // Redirect based on role
      if (res.type === 'staff') {
        navigate('/staff-dashboard')
      } else {
        navigate('/customer-dashboard')
      }
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="register-container max-w-md mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-semibold mb-4 text-center">Register</h2>
      {error && <div className="text-red-600 mb-2 text-center">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="input w-full"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          className="input w-full"
        />
        <select
          value={role}
          onChange={e => setRole(e.target.value)}
          className="input w-full"
        >
          <option value="customer">Customer</option>
          <option value="staff">Airline Staff</option>
        </select>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Register
        </button>
      </form>
    </div>
  )
}