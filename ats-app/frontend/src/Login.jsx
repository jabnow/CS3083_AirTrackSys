import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function Login({ setUser }) {
  const [role, setRole] = useState('customer')
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!identifier || !password) {
      setError('Username/Email and password are required')
      return
    }

    // Build payload with role and identifier
    const payload = {
      role: role,
      password: password,
      ...(role === 'staff' ? { username: identifier } : { email: identifier })
    }

    try {
      const res = await axios.post(
        'http://127.0.0.1:5000/api/auth/login',
        payload,
        { withCredentials: true }
      )

      // Backend returns id and role
      const userData = { id: res.data.id, role: res.data.role }
      setUser(userData)
      // Navigate based on role
      navigate(userData.role === 'staff' ? '/staff-dashboard' : '/customer-dashboard')
    } catch (err) {
      console.error('Login failed', err)
      setError(err.response?.data?.msg || 'Login failed')
    }
  }

  return (
    <div className="login-container max-w-md mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-semibold mb-4 text-center">Log In</h2>
      {error && <p className="text-red-600 mb-2 text-center">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <label>
          Role:
          <select
            value={role}
            onChange={e => setRole(e.target.value)}
            className="input w-full mt-1"
          >
            <option value="customer">Customer</option>
            <option value="staff">Staff</option>
          </select>
        </label>

        <input
          type="text"
          name={role === 'staff' ? 'username' : 'email'}
          placeholder={role === 'staff' ? 'Username' : 'Email'}
          value={identifier}
          onChange={e => setIdentifier(e.target.value)}
          required
          className="input w-full"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          className="input w-full"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Log In
        </button>
      </form>
    </div>
  )
}