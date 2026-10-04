import { useState } from 'react';
import Icon from './Icon.jsx';
import { apiRequest, forgetTicketId } from '../services/api.js';

const labels = { waiting: 'Waiting in line', called: 'You’re being called', completed: 'Completed', cancelled: 'Cancelled' };

export default function TicketCard({ ticket, onChanged }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function cancelTicket() {
    if (!window.confirm(`Cancel ticket ${ticket.ticketCode}?`)) return;
    setBusy(true);
    setError('');
    try {
      await apiRequest(`/tokens/${ticket.id}/cancel`, { method: 'POST', body: JSON.stringify({ managementKey: ticket.managementKey }) });
      forgetTicketId(ticket.id);
      onChanged();
    } catch (requestError) {
      setError(requestError.message);
      setBusy(false);
    }
  }

  return (
    <article className={`ticket-card ticket-${ticket.status}`}>
      <div className="ticket-card-head"><span className={`status-badge status-${ticket.status}`}><span />{labels[ticket.status] || ticket.status}</span><span className="ticket-date">Joined {new Date(ticket.joinedAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</span></div>
      <div className="ticket-hero"><div><span className="metric-label">YOUR TICKET</span><div className="ticket-code">{ticket.ticketCode}</div><p>{ticket.serviceName}</p></div><div className="ticket-position"><Icon name={ticket.status === 'called' ? 'campaign' : 'schedule'} size={22} /><strong>{ticket.status === 'waiting' ? `#${ticket.position}` : ticket.status === 'called' ? 'Now' : '—'}</strong><span>{ticket.status === 'waiting' ? 'in line' : ticket.status === 'called' ? 'your turn' : 'position'}</span></div></div>
      {ticket.status === 'waiting' && <div className="wait-callout"><Icon name="hourglass_top" /><div><strong>About {ticket.estimatedWaitMinutes || 0} minutes to go</strong><span>Your place updates here. If campus SMS is enabled, we’ll text when you’re called.</span></div></div>}
      {ticket.status === 'called' && <div className="called-callout"><Icon name="campaign" /><div><strong>Please head to the desk now</strong><span>{ticket.location || 'Your service desk'} is ready for you.</span></div></div>}
      {error && <p className="form-error">{error}</p>}
      <div className="ticket-card-foot"><span><Icon name="location_on" size={16} />{ticket.location}</span>{ticket.status === 'waiting' && <button className="text-button cancel-link" onClick={cancelTicket} disabled={busy}>{busy ? 'Cancelling…' : 'Leave queue'}</button>}</div>
    </article>
  );
}
