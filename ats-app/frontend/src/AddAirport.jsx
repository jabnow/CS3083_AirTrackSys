// src/pages/AddAirport.jsx
import React, { useState } from 'react'
import { airports } from './services'

export default function AddAirport() {
  const [code, setCode] = useState('')
  const [name, setName] = useState('')
  const [city, setCity] = useState('')
  const [country, setCountry] = useState('')
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async e => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    try {
      await airports.create({ code, name, city, country })
      setSuccess(true)
      // clear fields
      setCode(''); setName(''); setCity(''); setCountry('')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="add-airport-container">
      <h2>Add New Airport</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Airport Code"
          value={code}
          onChange={e => setCode(e.target.value.toUpperCase())}
          required
        />
        <input
          type="text"
          placeholder="Airport Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={e => setCity(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Country"
          value={country}
          onChange={e => setCountry(e.target.value)}
          required
        />
        <button type="submit">Add Airport</button>
      </form>

      {success && (
        <div className="success">
          Airport <strong>{code}</strong> added successfully!
        </div>
      )}
      {error && (
        <div className="error">
          Error: {error}
        </div>
      )}
    </div>
  )
}