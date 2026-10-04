import { Link } from 'react-router-dom';
import Icon from '../components/Icon.jsx';
import ServiceCard from '../components/ServiceCard.jsx';

const steps = [
  { number: '01', icon: 'search', title: 'Choose a service', text: 'Compare live wait times and pick the desk that can help.' },
  { number: '02', icon: 'confirmation_number', title: 'Get your ticket', text: 'Take a digital place in line. No more waiting in the hallway.' },
  { number: '03', icon: 'notifications_active', title: 'Come when called', text: 'Track your spot and get a text when it’s your turn.' },
];

export default function HomePage({ services, onJoin, loading, apiError }) {
  const waitingTotal = services.reduce((sum, service) => sum + Number(service.waitingCount || 0), 0);
  const activeService = services.find((service) => service.currentTicket) || services[0];

  return (
    <main>
      <section className="hero-section page-width">
        <div className="hero-copy">
          <span className="hero-kicker"><span className="pulse-dot" /> CAMPUS GRID ACTIVE <span className="kicker-separator">·</span> LESS WAITING, MORE DOING</span>
          <h1>Skip the line.<br /><span>Get on with campus.</span></h1>
          <p className="hero-description">Take your place in a campus service queue from anywhere. We’ll keep you updated, so you can spend your time where it matters.</p>
          <div className="hero-actions"><Link className="button button-primary button-large" to="/services">Find a service <Icon name="arrow_forward" /></Link><Link className="button button-outline button-large" to="/provider"><Icon name="badge" /> Provider portal</Link></div>
          <div className="hero-proof"><div className="proof-avatars"><span>R</span><span>A</span><span>M</span><span>+</span></div><p><strong>Made for campus life</strong><small>Registrar · Financial aid · Health · Labs</small></p></div>
        </div>

        <div className="hero-visual" aria-label="Live campus queue preview">
          <div className="orbit orbit-one" /><div className="orbit orbit-two" />
          <div className="floating-chip chip-top"><span className="pulse-dot" /> LIVE QUEUE STATUS</div>
          <article className="preview-ticket">
            <div className="preview-topline"><span className="status-badge status-called"><span /> NOW SERVING</span><Icon name="more_horiz" /></div>
            <span className="metric-label">{activeService?.name || 'ACADEMIC CERTIFICATES'}</span>
            <div className="preview-code">{activeService?.currentTicket || 'A-104'}</div>
            <p className="preview-location"><Icon name="location_on" size={15} />{activeService?.location || 'Central Registrar · Window 04'}</p>
            <div className="preview-divider" />
            <div className="preview-queue-row"><div><span className="metric-label">IN LINE</span><strong>{activeService?.waitingCount ?? 2} <small>students</small></strong></div><div><span className="metric-label">ESTIMATED WAIT</span><strong>{activeService?.estimatedWaitMinutes ?? 8}<small> min</small></strong></div><span className="sound-wave"><i /><i /><i /><i /><i /></span></div>
            <div className="preview-status"><span><Icon name="verified" size={15} /> Refreshed just now</span><span className="live-label">LIVE</span></div>
          </article>
          <div className="floating-chip chip-bottom"><span className="chip-check"><Icon name="check" size={14} /></span><span><strong>Turn reminders</strong><small>Right to your phone</small></span></div>
          <div className="hero-spark spark-one">✳</div><div className="hero-spark spark-two">✳</div>
        </div>
        <div className="hero-stats"><div><strong>{loading ? '—' : '04'}</strong><span>Campus service desks</span></div><div><strong>{loading ? '—' : waitingTotal.toString().padStart(2, '0')}</strong><span>Students in line</span></div><div><strong>5<span className="stat-unit">s</span></strong><span>Live status refresh</span></div><div><strong>01</strong><span>Simple ticket, zero stress</span></div></div>
      </section>

      {apiError && <div className="page-width inline-alert"><Icon name="cloud_off" /> Queue server is offline. Start the API with <code>npm run dev</code> to load live desk information.</div>}

      <section className="section-block page-width how-section">
        <div className="section-heading"><div><span className="eyebrow">A BETTER WAY TO WAIT</span><h2>Queueing that fits your day.</h2></div><p>From picking a desk to getting your turn, every step is clear and on your phone.</p></div>
        <div className="steps-grid">{steps.map((step) => <article className="step-card" key={step.number}><div className="step-card-top"><span className="step-icon"><Icon name={step.icon} size={22} /></span><span className="step-number">{step.number}</span></div><h3>{step.title}</h3><p>{step.text}</p><div className="step-line" /></article>)}</div>
      </section>

      <section className="section-block page-width services-preview">
        <div className="section-heading"><div><span className="eyebrow">CAMPUS SERVICE HUBS</span><h2>Where do you need to go?</h2></div><Link className="text-link" to="/services">Explore all services <Icon name="arrow_forward" size={17} /></Link></div>
        <div className="service-grid">{services.slice(0, 4).map((service) => <ServiceCard service={service} onJoin={onJoin} compact key={service.id} />)}</div>
        {!services.length && !loading && <div className="empty-inline">Service desks will appear here once the queue server is running.</div>}
      </section>

      <section className="impact-panel page-width"><div className="impact-copy"><span className="eyebrow">MORE TIME FOR WHAT MATTERS</span><h2>Your campus day,<br />without the queue.</h2><p>Know your place, keep moving, and show up when you’re needed. QueueFlow makes the waiting part of campus life a little lighter.</p><Link className="text-link" to="/live">See the live campus board <Icon name="arrow_forward" size={17} /></Link></div><div className="impact-graphic"><div className="impact-number">5<span> min</span></div><div className="impact-caption">BETWEEN LIVE UPDATES</div><div className="mini-chart"><span style={{ height: '26%' }} /><span style={{ height: '42%' }} /><span style={{ height: '37%' }} /><span style={{ height: '64%' }} /><span style={{ height: '52%' }} /><span style={{ height: '82%' }} /><span style={{ height: '71%' }} /><span style={{ height: '96%' }} /></div><div className="chart-foot"><span>Less uncertainty</span><span><Icon name="trending_down" size={16} /> waiting stress</span></div></div><div className="impact-decoration">Q</div></section>

      <section className="last-call page-width"><div><span className="eyebrow">YOUR NEXT STOP STARTS HERE</span><h2>Make your time yours again.</h2><p>Find a service, take a ticket, and keep your day moving.</p></div><Link className="button button-primary" to="/services">Claim a ticket <Icon name="arrow_forward" /></Link></section>
    </main>
  );
}
