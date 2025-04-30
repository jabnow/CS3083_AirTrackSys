// src/pages/CancelTicket.jsx
import React, { useState } from 'react';
import axios from 'axios';

function CancelTicket() {
  const [ticketId, setTicketId] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.delete(`/api/tickets/${ticketId}`, {
        withCredentials: true,
      });
      setMessage(res.data.msg || 'Ticket cancelled successfully!');
    } catch (err) {
      const errMsg = err.response?.data?.msg || err.response?.data?.error || 'Cancellation failed';
      setMessage(errMsg);
    }
  };

  return (
    <div className="cancel-ticket-container max-w-md mx-auto p-6 bg-white shadow-md rounded-xl">
      <h2 className="text-2xl font-semibold mb-4 text-center">Cancel a Ticket</h2>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block mb-1">Ticket ID</label>
          <input
            type="text"
            name="ticket_id"
            placeholder="Enter Ticket ID"
            value={ticketId}
            onChange={(e) => setTicketId(e.target.value)}
            required
            className="input"
          />
        </div>

        <div className="text-center">
          <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
            Cancel Ticket
          </button>
        </div>
      </form>

      {message && <p className="mt-3 text-center text-red-600">{message}</p>}
    </div>
  );
}

export default CancelTicket;
