import { useMemo, useState } from 'react';
import Icon from '../components/Icon.jsx';
import ServiceCard from '../components/ServiceCard.jsx';

export default function ServicesPage({ services, onJoin, loading }) {
  const [search, setSearch] = useState('');
  const [showOpenOnly, setShowOpenOnly] = useState(false);
  const filtered = useMemo(() => services.filter((service) => {
    const matches = `${service.name} ${service.category} ${service.location}`.toLowerCase().includes(search.toLowerCase());
    return matches && (!showOpenOnly || service.isOpen);
  }), [services, search, showOpenOnly]);

  return (
    <main className="page-width page-content">
      <div className="page-heading"><div><span className="eyebrow">FIND YOUR CAMPUS DESK</span><h1>Explore services</h1><p>Check live wait times and choose the desk that can help.</p></div><div className="live-note"><span className="pulse-dot" /> Updating every 5 seconds</div></div>
      <div className="service-tools"><label className="search-field"><Icon name="search" /><input aria-label="Search services" placeholder="Search by service, category, or location" value={search} onChange={(event) => setSearch(event.target.value)} /><kbd>⌘ K</kbd></label><button className={`filter-button ${showOpenOnly ? 'filter-active' : ''}`} onClick={() => setShowOpenOnly(!showOpenOnly)}><Icon name="tune" size={18} /> Open desks <span className="filter-toggle">{showOpenOnly ? 'On' : 'Off'}</span></button></div>
      {loading && <div className="loading-state"><span className="spinner" /> Loading service desks…</div>}
      <div className="service-grid service-grid-wide">{filtered.map((service) => <ServiceCard service={service} onJoin={onJoin} key={service.id} />)}</div>
      {!loading && filtered.length === 0 && <div className="empty-state"><span className="empty-icon"><Icon name="search_off" size={27} /></span><h2>No desks found</h2><p>Try another search or turn off the open desks filter.</p><button className="button button-outline" onClick={() => { setSearch(''); setShowOpenOnly(false); }}>Clear filters</button></div>}
      <div className="sms-note"><Icon name="sms" /><div><strong>Text updates keep you in the loop.</strong><span>Enter your mobile number when joining a queue. You can check your live place here at any time.</span></div><Icon name="arrow_forward" className="sms-note-arrow" /></div>
    </main>
  );
}
