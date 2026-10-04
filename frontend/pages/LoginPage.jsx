import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from '../components/Icon.jsx';
import { apiRequest } from '../services/api.js';

export default function LoginPage({ onAuth }) {
  const [mode, setMode] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);
    const form = new FormData(event.currentTarget);
    const body = Object.fromEntries(form.entries());
    body.role = 'student';
    try {
      const data = await apiRequest(mode === 'login' ? '/auth/login' : '/auth/register', { method: 'POST', body: JSON.stringify(body) });
      localStorage.setItem('queueflow.session', data.token);
      onAuth(data.user);
      navigate('/tickets');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page page-width">
      <div className="auth-aside"><div className="auth-decoration"><span>Q</span></div><span className="eyebrow">QUEUEFLOW CAMPUS OPS</span><h1>More campus.<br /><span>Less waiting.</span></h1><p>Sign in to access your campus account and keep your service tickets close.</p><div className="auth-aside-foot"><Icon name="verified_user" />Secure campus access · SMS queue updates</div></div>
      <section className="auth-card"><div className="auth-card-heading"><span className="eyebrow">{mode === 'login' ? 'WELCOME BACK' : 'GET STARTED'}</span><h2>{mode === 'login' ? 'Sign in to QueueFlow' : 'Create your student account'}</h2><p>{mode === 'login' ? 'Access your campus queue activity.' : 'Register for campus queue access.'}</p></div>
        <div className="auth-tabs"><button className={mode === 'login' ? 'auth-tab active' : 'auth-tab'} onClick={() => { setMode('login'); setError(''); }}>Sign in</button><button className={mode === 'register' ? 'auth-tab active' : 'auth-tab'} onClick={() => { setMode('register'); setError(''); }}>Register</button></div>
        <form className="form-stack" onSubmit={handleSubmit}>
          {mode === 'register' && <label className="field-label">Full name<input name="name" autoComplete="name" placeholder="Your name" maxLength="120" required /></label>}
          <label className="field-label">Campus email<input name="email" type="email" autoComplete="email" placeholder="you@campus.edu" required /></label>
          {mode === 'register' && <label className="field-label">Campus ID <span className="optional-label">OPTIONAL</span><input name="campusId" placeholder="e.g. 2026-CS-041" /></label>}
          {mode === 'register' && <label className="field-label">Mobile number <span className="optional-label">OPTIONAL</span><input name="phone" type="tel" autoComplete="tel" placeholder="+91 98765 43210" /></label>}
          <label className="field-label">Password<div className="password-field"><input name="password" type={showPassword ? 'text' : 'password'} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} placeholder="At least 8 characters" minLength="8" required /><button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword(!showPassword)}><Icon name={showPassword ? 'visibility_off' : 'visibility'} /></button></div></label>
          {error && <p className="form-error" role="alert"><Icon name="error" size={17} />{error}</p>}
          <button className="button button-primary button-full" disabled={loading}>{loading ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'} <Icon name="arrow_forward" /></button>
        </form>
        <div className="auth-footnote"><Icon name="lock" size={16} /><span>Passwords are hashed before storage.</span></div>
        <Link className="back-link" to="/"><Icon name="arrow_back" size={16} />Back to QueueFlow</Link>
      </section>
    </main>
  );
}
