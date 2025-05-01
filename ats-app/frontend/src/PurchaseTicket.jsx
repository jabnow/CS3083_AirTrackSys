import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function PurchaseTicket({ user }) {
  const [flights, setFlights] = useState([]);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [cardNumber, setCardNumber] = useState('');
  const [cardType, setCardType] = useState('credit');
  const [expirationDate, setExpirationDate] = useState('');
  const [nameOnCard, setNameOnCard] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch available future flights
  const fetchAllFutureFlights = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://127.0.0.1:5000/api/flights/future');
      setFlights(response.data.flights_to || []);
    } catch (err) {
      console.error('Error fetching future flights:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch flights on component mount
  useEffect(() => {
    fetchAllFutureFlights();
  }, []);

  // Handle ticket purchase
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!selectedFlight) {
      setError('Please select a flight');
      return;
    }

    // Ensure expiration date is in the yyyy-mm-dd format
    const formattedExpirationDate = expirationDate ? `${expirationDate}-01` : '';

    try {
      // Send the purchase request to the backend
      const response = await axios.post('http://127.0.0.1:5000/api/tickets/buy', {
        flight_number: selectedFlight.flight_number,
        departure_timestamp: new Date(selectedFlight.departure_timestamp).toISOString().slice(0, 10),
        airline_name: selectedFlight.airline_name,
        card_number: cardNumber,
        card_type: cardType,
        card_expiration_date: formattedExpirationDate, // Use formatted expiration date
        name_on_card: nameOnCard,
      });

      setSuccess(`Purchased ticket ${response.data.ticket_ID} for $${response.data.sold_price.toFixed(2)}`);
      setCardNumber('');
      setCardType('credit');
      setExpirationDate('');
      setNameOnCard('');
    } catch (err) {
      setError(err.response?.data?.msg || err.message);
    }
  };

  return (
    <div className="purchase-ticket-container max-w-lg mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-semibold mb-4 text-center">Purchase Ticket</h2>

      {/* Flight selection */}
      <div className="mb-4">
        <label className="block mb-1">Select Flight</label>
        <select
          value={selectedFlight ? selectedFlight.flight_number : ''}
          onChange={(e) => {
            const flight = flights.find(f => f.flight_number === e.target.value);
            setSelectedFlight(flight);
          }}
          className="input w-full"
        >
          <option value="">-- Choose a flight --</option>
          {flights.map((flight) => (
            <option key={flight.flight_number} value={flight.flight_number}>
              {flight.airline_name} {flight.flight_number} - {new Date(flight.departure_timestamp).toLocaleString()}
            </option>
          ))}
        </select>
      </div>

      {/* Payment form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Card Number</label>
          <input
            type="text"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            required
            className="input w-full"
          />
        </div>

        <div>
          <label className="block mb-1">Card Type</label>
          <select
            value={cardType}
            onChange={(e) => setCardType(e.target.value)}
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
            onChange={(e) => setExpirationDate(e.target.value)}
            required
            className="input w-full"
          />
        </div>

        <div>
          <label className="block mb-1">Name on Card</label>
          <input
            type="text"
            value={nameOnCard}
            onChange={(e) => setNameOnCard(e.target.value)}
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

      {/* Success/Error messages */}
      {success && (
        <p className="text-green-600 mt-4 text-center">{success}</p>
      )}
      {error && (
        <p className="text-red-600 mt-4 text-center">Error: {error}</p>
      )}
    </div>
  );
}
