import Icon from './Icon.jsx';

export default function ServiceCard({ service, onJoin, compact = false }) {
  const waiting = Number(service.waitingCount || 0);
  return (
    <article className={`service-card ${compact ? 'service-card-compact' : ''}`}>
      <div className="service-card-top">
        <span className={`service-icon service-icon-${service.id}`}><Icon name={service.icon} size={23} /></span>
        <span className={`open-badge ${service.isOpen ? '' : 'closed'}`}><span />{service.isOpen ? 'Open now' : 'Closed'}</span>
      </div>
      <p className="eyebrow service-category">{service.category}</p>
      <h3>{service.name}</h3>
      {!compact && <p className="service-description">{service.description}</p>}
      <div className="service-location"><Icon name="location_on" size={16} /><span>{service.location}</span></div>
      <div className="service-metrics">
        <div><span className="metric-label">IN LINE</span><strong>{waiting}<small> {waiting === 1 ? 'student' : 'students'}</small></strong></div>
        <div><span className="metric-label">EST. WAIT</span><strong>{service.estimatedWaitMinutes || 0}<small> min</small></strong></div>
      </div>
      <button className="button button-secondary service-join" disabled={!service.isOpen} onClick={() => onJoin(service)}>
        Join this queue <Icon name="arrow_forward" size={18} />
      </button>
    </article>
  );
}
