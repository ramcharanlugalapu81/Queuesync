import { Link } from 'react-router-dom';
import Icon from './Icon.jsx';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-main page-width">
        <div><div className="footer-brand">QueueFlow <span className="version-tag">CAMPUS QUEUE MANAGER</span></div><p>Spend less time waiting. Get back to campus life.</p></div>
        <div className="footer-links"><Link to="/live"><Icon name="monitor_heart" size={16} /> System status</Link><Link to="/services"><Icon name="support_agent" size={16} /> Campus helpdesk</Link></div>
      </div>
      <div className="footer-bottom page-width"><span>© {new Date().getFullYear()} QueueFlow Campus Operations</span><span><i className="pulse-dot" /> Live queue updates · Refreshes every 5 seconds</span></div>
    </footer>
  );
}
