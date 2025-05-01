// src/pages/RateFlight.jsx
import React, { useState } from 'react'
import { ratings } from './services'

export default function RateFlight() {
  const [ticketId, setTicketId] = useState('')
  const [rating, setRating] = useState('')
  const [comment, setComment] = useState('')
  const [message, setMessage] = useState('')
  const [msgType, setMsgType] = useState('') // 'success' or 'error'

  const handleSubmit = async e => {
    e.preventDefault()
    setMessage('')
    setMsgType('')

    try {
      await ratings.create({
        ticket_ID: ticketId,
        rating: parseInt(rating, 10),
        comment: comment || undefined
      })
      setMessage('Rating submitted successfully!')
      setMsgType('success')
      // clear form
      setTicketId('')
      setRating('')
      setComment('')
    } catch (err) {
      setMessage(err.message)
      setMsgType('error')
    }
  }

  return (
    <div className="rate-flight-container max-w-lg mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-semibold mb-4 text-center">Rate and Comment on Flight</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Ticket ID</label>
          <input
            type="text"
            placeholder="Your Ticket ID"
            value={ticketId}
            onChange={e => setTicketId(e.target.value)}
            required
            className="input w-full"
          />
        </div>

        <div>
          <label className="block mb-1">Rating (1-5)</label>
          <input
            type="number"
            min="1"
            max="5"
            step="1"
            placeholder="Rating (1-5)"
            value={rating}
            onChange={e => setRating(e.target.value)}
            required
            className="input w-full"
          />
        </div>

        <div>
          <label className="block mb-1">Comment (Optional)</label>
          <textarea
            placeholder="Write your comment..."
            value={comment}
            onChange={e => setComment(e.target.value)}
            className="input h-24 w-full"
          />
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
          >
            Submit Rating
          </button>
        </div>
      </form>

      {message && (
        <p className={msgType === 'error' ? 'text-red-600 mt-3 text-center' : 'text-green-600 mt-3 text-center'}>
          {message}
        </p>
      )}
    </div>
  )
}