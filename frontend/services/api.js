const API_URL = import.meta.env.VITE_API_URL || '/api';
const TICKETS_KEY = 'queueflow.tickets';

export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem('queueflow.session');
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'The server could not complete that request.');
  return data;
}

export function getSavedTickets() {
  try {
    return JSON.parse(localStorage.getItem(TICKETS_KEY) || '[]');
  } catch {
    return [];
  }
}

export function saveTicket(id, managementKey) {
  const tickets = getSavedTickets().filter((ticket) => Number(ticket.id) !== Number(id));
  localStorage.setItem(TICKETS_KEY, JSON.stringify([{ id: Number(id), managementKey }, ...tickets]));
}

export function forgetTicketId(id) {
  localStorage.setItem(TICKETS_KEY, JSON.stringify(getSavedTickets().filter((ticket) => Number(ticket.id) !== Number(id))));
}
