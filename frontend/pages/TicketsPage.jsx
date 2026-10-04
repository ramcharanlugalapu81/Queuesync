import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/Icon.jsx';
import TicketCard from '../components/TicketCard.jsx';
import { apiRequest, getSavedTickets } from '../services/api.js';

export default function TicketsPage({ onRefresh }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refreshTickets = useCallback(async () => {
    const savedTickets = getSavedTickets().filter((saved) => saved.managementKey);
    if (!savedTickets.length) { setTickets([]); setLoading(false); return; }
    try {
      const results = await Promise.all(savedTickets.map((saved) => apiRequest(`/tokens/${saved.id}/track`, { method: 'POST', body: JSON.stringify({ managementKey: saved.managementKey }) }).catch(() => null)));
      const nextTickets = results.map((result, index) => result ? { ...result.ticket, managementKey: savedTickets[index].managementKey } : null).filter(Boolean);
      setTickets(nextTickets);
      setError('');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshTickets();
    const timer = window.setInterval(refreshTickets, 5000);
    return () => window.clearInterval(timer);
  }, [refreshTickets]);

  function handleChanged() {
    refreshTickets();
    onRefresh?.();
  }

  const active = tickets.filter((ticket) => ['waiting', 'called'].includes(ticket.status));
  const past = tickets.filter((ticket) => !['waiting', 'called'].includes(ticket.status));

  return (
    <main className="page-width page-content">
      <div className="page-heading"><div><span className="eyebrow">YOUR QUEUE ACTIVITY</span><h1>My tickets</h1><p>Keep an eye on your place. We’ll let you know when it’s your turn.</p></div><span className="live-note"><span className="pulse-dot" /> Live tracking</span></div>
      {error && <div className="inline-alert"><Icon name="error" />{error}</div>}
      {loading && <div className="loading-state"><span className="spinner" /> Finding your tickets…</div>}
      {!loading && active.length > 0 && <section className="tickets-section"><div className="subsection-heading"><h2>Active tickets <span>{active.length}</span></h2><span>Refreshes automatically</span></div><div className="ticket-grid">{active.map((ticket) => <TicketCard ticket={ticket} onChanged={handleChanged} key={ticket.id} />)}</div></section>}
      {!loading && active.length === 0 && <div className="empty-state tickets-empty"><span className="empty-icon"><Icon name="confirmation_number" size={28} /></span><h2>No active tickets</h2><p>Find a service and take a place in line to see your queue status here.</p><Link className="button button-primary" to="/services">Explore campus services <Icon name="arrow_forward" /></Link></div>}
      {!loading && past.length > 0 && <section className="tickets-section past-section"><div className="subsection-heading"><h2>Recent tickets</h2><span>Stored on this device</span></div><div className="ticket-grid">{past.map((ticket) => <TicketCard ticket={ticket} onChanged={handleChanged} key={ticket.id} />)}</div></section>}
      <p className="device-note"><Icon name="devices" size={16} /> Tickets are saved on this device. Keep this browser open to follow them.</p>
    </main>
  );
}
