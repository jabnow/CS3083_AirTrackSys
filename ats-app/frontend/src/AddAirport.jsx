import React, { useState } from 'react'
import axios from 'axios'

export default function AddAirport({ user }) {
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
      const res = await axios.post('http://127.0.0.1:5000/api/airports/', {
        code,
        name,
        city,
        country
      }, {
        withCredentials: false,
        headers: {
          'X-User-Id': user.id
        }
      })

      console.log("✅ Airport added:", res.data)
      setSuccess(true)
      setCode(''); setName(''); setCity(''); setCountry('')
    } catch (err) {
      console.error("❌ Error adding airport:", err)
      const errMsg = err.response?.data?.msg || err.response?.data?.error || err.message
      setError(errMsg)
    }
  }

  return (
    <div className="add-airport-container max-w-md mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4 text-center">Add New Airport</h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="Airport Code"
          value={code}
          onChange={e => setCode(e.target.value.toUpperCase())}
          required
          className="input w-full"
        />
        <input
          type="text"
          placeholder="Airport Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          className="input w-full"
        />
        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={e => setCity(e.target.value)}
          required
          className="input w-full"
        />
        <input
          type="text"
          placeholder="Country"
          value={country}
          onChange={e => setCountry(e.target.value)}
          required
          className="input w-full"
        />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Add Airport</button>
      </form>

      {success && (
        <div className="text-green-600 mt-2 text-center">
          Airport <strong>{code}</strong> added successfully!
        </div>
      )}
      {error && (
        <div className="text-red-600 mt-2 text-center">
          Error: {error}
        </div>
      )}
    </div>
  )
}
