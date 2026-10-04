import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import Icon from './Icon.jsx';

const navigation = [
  { label: 'Home', to: '/' },
  { label: 'Services', to: '/services' },
  { label: 'My tickets', to: '/tickets' },
  { label: 'Live board', to: '/live' },
  { label: 'Provider console', to: '/provider' },
];

export default function Header({ user, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="brand" to="/" onClick={closeMenu} aria-label="QueueFlow home">
          <span className="brand-mark"><Icon name="account_tree" size={23} /></span>
          <span className="brand-copy"><strong>QueueFlow</strong><small>CAMPUS OPS</small></span>
        </Link>
        <nav className={`main-nav ${menuOpen ? 'nav-open' : ''}`} aria-label="Main navigation">
          {navigation.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === '/'} onClick={closeMenu} className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="header-actions">
          <span className="system-pill"><span className="pulse-dot" /> Queues operational</span>
          {user ? <div className="signed-in"><Link className="avatar-link" to="/provider" aria-label="Open account"><span className="avatar">{user.name?.charAt(0)?.toUpperCase() || 'U'}</span><span className="signed-name">{user.name?.split(' ')[0]}</span></Link><button className="signout-button" onClick={onLogout}>Sign out</button></div> : <Link className="signin-link" to="/login">Sign in <Icon name="arrow_outward" size={15} /></Link>}
          <button className="icon-button menu-toggle" aria-label="Toggle navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><Icon name={menuOpen ? 'close' : 'menu'} /></button>
        </div>
      </div>
    </header>
  );
}
