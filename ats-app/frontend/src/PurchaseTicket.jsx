// src/pages/PurchaseTicket.jsx
import React, { useState } from 'react'
import { tickets } from './services'

/**
 * PurchaseTicket component
 * Props:
 *   - flight: {
 *       airline_name: string,
 *       flight_number: string,
 *       departure_date_time: string (ISO),
 *       departure_airport_code: string,
 *       arrival_airport_code: string,
 *       base_price: number
 *     }
 */
export default function PurchaseTicket({ flight }) {
  const [cardNumber, setCardNumber] = useState('')
  const [cardType, setCardType] = useState('credit')
  const [expirationDate, setExpirationDate] = useState('')
  const [nameOnCard, setNameOnCard] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      const res = await tickets.purchase({
        airline_name: flight.airline_name,
        flight_number: flight.flight_number,
        departure_timestamp: flight.departure_date_time,
        card_number: cardNumber,
        card_type: cardType,
        card_expiration_date: expirationDate,
        name_on_card: nameOnCard
      })
      
      setSuccess(
        `Purchased ticket ${res.ticket_ID} for $${res.sold_price.toFixed(2)}`
      )
      // clear payment fields
      setCardNumber('')
      setCardType('credit')
      setExpirationDate('')
      setNameOnCard('')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="purchase-ticket-container max-w-md mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-semibold mb-4 text-center">Purchase Ticket</h2>

      {/* Flight details */}
      <div className="mb-4 space-y-1">
        <p><strong>Flight:</strong> {flight.airline_name} {flight.flight_number}</p>
        <p><strong>Departs:</strong> {new Date(flight.departure_date_time).toLocaleString()}</p>
        <p><strong>Route:</strong> {flight.departure_airport_code} → {flight.arrival_airport_code}</p>
        <p><strong>Price:</strong> ${flight.base_price.toFixed(2)}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Card Number</label>
          <input
            type="text"
            value={cardNumber}
            onChange={e => setCardNumber(e.target.value)}
            required
            className="input w-full"
          />
        </div>
        <div>
          <label className="block mb-1">Card Type</label>
          <select
            value={cardType}
            onChange={e => setCardType(e.target.value)}
            className="input w-full"
          >
            <option value="credit">Credit</option>
            <option value="debit">Debit</option>
          </select>
        </div>
        <div>
          <label className="block mb-1">Expiration Date</label>
          <input
            type="month"
            value={expirationDate}
            onChange={e => setExpirationDate(e.target.value)}
            required
            className="input w-full"
          />
        </div>
        <div>
          <label className="block mb-1">Name on Card</label>
          <input
            type="text"
            value={nameOnCard}
            onChange={e => setNameOnCard(e.target.value)}
            required
            className="input w-full"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Confirm Purchase
        </button>
      </form>

      {success && (
        <p className="text-green-600 mt-4 text-center">{success}</p>
      )}
      {error && (
        <p className="text-red-600 mt-4 text-center">Error: {error}</p>
      )}
    </div>
  )
}