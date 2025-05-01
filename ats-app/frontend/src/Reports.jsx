import React, { useState } from 'react';
import axios from 'axios';

export default function Reports({ user }) {
  const [fromMonth, setFromMonth] = useState('');
  const [toMonth, setToMonth] = useState('');
  const [summary, setSummary] = useState([]);
  const [byFlight, setByFlight] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSummary([]);
    setByFlight([]);

    if (!fromMonth || !toMonth) {
      setError('Both From and To months are required');
      return;
    }

    setLoading(true);
    try {
      const headers = {
        'X-User-Id': user.id,
        'X-User-Role': user.role
      };

      // Fetch overall tickets sold
      const sumRes = await axios.get('http://127.0.0.1:5000/api/reports/tickets_sold', {
        params: { from_month: fromMonth, to_month: toMonth },
        headers,
        withCredentials: false
      });
      setSummary(sumRes.data.tickets_sold || []);

      // Fetch tickets sold by flight
      const flightRes = await axios.get('http://127.0.0.1:5000/api/reports/tickets_sold_by_flight', {
        params: { from_month: fromMonth, to_month: toMonth },
        headers,
        withCredentials: false
      });
      setByFlight(flightRes.data.flights || []);
    } catch (err) {
      console.error("❌ Axios error:", err);
      setError(err.response?.data?.msg || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reports-container max-w-4xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-semibold mb-4 text-center">Sales Reports</h2>
      <form onSubmit={handleSubmit} className="flex space-x-4 mb-6">
        <div>
          <label className="block mb-1">From (YYYY-MM)</label>
          <input
            type="month"
            value={fromMonth}
            onChange={e => setFromMonth(e.target.value)}
            required
            className="input"
          />
        </div>
        <div>
          <label className="block mb-1">To (YYYY-MM)</label>
          <input
            type="month"
            value={toMonth}
            onChange={e => setToMonth(e.target.value)}
            required
            className="input"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 self-end"
        >
          {loading ? 'Loading...' : 'Generate'}
        </button>
      </form>

      {error && <div className="text-red-600 mb-4">Error: {error}</div>}

      {summary.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-2">Overall Tickets Sold</h3>
          <table className="w-full table-auto border-collapse border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-2 py-1 text-left">Month</th>
                <th className="border px-2 py-1 text-right">Count</th>
              </tr>
            </thead>
            <tbody>
              {summary.map(row => (
                <tr key={row.month}>
                  <td className="border px-2 py-1">{row.month}</td>
                  <td className="border px-2 py-1 text-right">{row.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {byFlight.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-2">Tickets Sold by Flight</h3>
          {byFlight.map(f => (
            <div key={`${f.airline_name}-${f.flight_number}`} className="mb-6">
              <h4 className="font-semibold mb-1">
                {f.airline_name} {f.flight_number}
              </h4>
              <table className="w-full table-auto border-collapse border">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border px-2 py-1 text-left">Month</th>
                    <th className="border px-2 py-1 text-right">Count</th>
                  </tr>
                </thead>
                <tbody>
                  {f.monthly_sales.map(item => (
                    <tr key={item.month}>
                      <td className="border px-2 py-1">{item.month}</td>
                      <td className="border px-2 py-1 text-right">{item.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
