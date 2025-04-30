const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000/api'

async function request(path, { method='GET', body, headers={}, credentials='include' }={}) {
  const opts = { method, headers, credentials }
  if (body) {
    opts.headers['Content-Type'] = 'application/json'
    opts.body = JSON.stringify(body)
  }
  const res = await fetch(`${API_BASE}${path}`, opts)
  const data = await res.json()
  if (!res.ok) throw new Error(data.msg || res.statusText)
  return data
}

export const auth = {
  register: (user) => request('/auth/register', { method: 'POST', body: user }),
  login:    (creds) => request('/auth/login',    { method: 'POST', body: creds }),
  logout:   ()      => request('/auth/logout',   { method: 'POST' }),
}

export const airports = {
  list: ()       => request('/airports'),
  create: (a)    => request('/airports', { method: 'POST', body: a }),
}

export const airplanes = {
  create: (p)    => request('/airplanes', { method: 'PUT', body: p }),
  listByOwner: (owner) => request(`/airplanes?owner_name=${encodeURIComponent(owner)}`),
}

export const flights = {
  list: (filters) => {
    const qs = new URLSearchParams(filters).toString()
    return request(`/flights?${qs}`)
  },
  future: (filters) => {
    const qs = new URLSearchParams(filters).toString()
    return request(`/flights/future?${qs}`)
  },
  create: (f) => request('/flights', { method: 'POST', body: f }),
  updateStatus: (s) => request('/flights/status', { method: 'POST', body: s }),
  schedule: (params) => request(`/flights/schedule?${new URLSearchParams(params)}`),
}

export const tickets = {
  purchase: (t) => request('/tickets', { method: 'POST', body: t }),
  cancel: (id)  => request(`/tickets/${id}`, { method: 'DELETE' }),
}

export const purchases = {
  list: () => request('/purchases')
}

export const ratings = {
  list: ()   => request('/ratings'),
  create: (r) => request('/ratings', { method: 'POST', body: r }),
}

export const reports = {
  ticketsSold: (from, to) =>
    request(`/reports/tickets_sold?from_month=${from}&to_month=${to}`),
  byFlight: (from, to) =>
    request(`/reports/tickets_sold_by_flight?from_month=${from}&to_month=${to}`),
}