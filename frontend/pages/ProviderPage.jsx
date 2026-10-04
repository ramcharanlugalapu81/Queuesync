import { useCallback, useEffect, useState } from 'react';
import Icon from '../components/Icon.jsx';
import { apiRequest } from '../services/api.js';

function ProviderAuth({ onAuth }) {
  const [mode, setMode] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);
    const form = new FormData(event.currentTarget);
    const body = Object.fromEntries(form.entries());
    body.role = 'provider';
    try {
      const data = await apiRequest(mode === 'login' ? '/auth/login' : '/auth/register', { method: 'POST', body: JSON.stringify(body) });
      localStorage.setItem('queueflow.session', data.token);
      onAuth(data.user);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-card provider-auth" style={{ margin: '2rem auto', maxWidth: '440px', width: '100%' }}>
      <div className="auth-card-heading">
        <span className="eyebrow">{mode === 'login' ? 'PROVIDER ACCESS' : 'BECOME A PROVIDER'}</span>
        <h2>{mode === 'login' ? 'Provider Sign In' : 'Create Provider Account'}</h2>
      </div>
      <div className="auth-tabs">
        <button className={mode === 'login' ? 'auth-tab active' : 'auth-tab'} onClick={() => { setMode('login'); setError(''); }}>Sign in</button>
        <button className={mode === 'register' ? 'auth-tab active' : 'auth-tab'} onClick={() => { setMode('register'); setError(''); }}>Register</button>
      </div>
      <form className="form-stack" onSubmit={handleSubmit}>
        {mode === 'register' && <label className="field-label">Full name<input name="name" autoComplete="name" placeholder="Your name" maxLength="120" required /></label>}
        <label className="field-label">Campus email<input name="email" type="email" autoComplete="email" placeholder="you@campus.edu" required /></label>
        {mode === 'register' && <label className="field-label">Service Desk Name<input name="serviceName" placeholder="e.g. IT Support Desk" required /></label>}
        <label className="field-label">Password
          <div className="password-field">
            <input name="password" type={showPassword ? 'text' : 'password'} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} placeholder="At least 8 characters" minLength="8" required />
            <button type="button" onClick={() => setShowPassword(!showPassword)}><Icon name={showPassword ? 'visibility_off' : 'visibility'} /></button>
          </div>
        </label>
        {error && <p className="form-error" role="alert"><Icon name="error" size={17} />{error}</p>}
        <button className="button button-primary button-full" disabled={loading}>{loading ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'} <Icon name="arrow_forward" /></button>
      </form>
    </div>
  );
}

export default function ProviderPage({ onToast, user, onAuth }) {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busyService, setBusyService] = useState(null);
  const [error, setError] = useState('');

  const refreshOverview = useCallback(async () => {
    try {
      const data = await apiRequest('/provider/overview');
      setOverview(data);
      setError('');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshOverview();
    const timer = window.setInterval(refreshOverview, 5000);
    return () => window.clearInterval(timer);
  }, [refreshOverview]);

  async function callNext(service) {
    setBusyService(service.id);
    try {
      const { ticket } = await apiRequest('/provider/next', { method: 'POST', body: JSON.stringify({ serviceId: service.id }) });
      onToast({ type: 'success', message: ticket.sms?.sent ? `${ticket.ticketCode} called. SMS sent.` : `${ticket.ticketCode} called. The student will see the update in the app.` });
      await refreshOverview();
    } catch (requestError) {
      onToast({ type: 'error', message: requestError.message });
    } finally {
      setBusyService(null);
    }
  }

  async function completeCurrent(service) {
    setBusyService(service.id);
    try {
      await apiRequest(`/provider/${service.current.id}/complete`, { method: 'POST' });
      onToast({ type: 'success', message: `${service.current.ticketCode} marked as complete.` });
      await refreshOverview();
    } catch (requestError) {
      onToast({ type: 'error', message: requestError.message });
    } finally {
      setBusyService(null);
    }
  }

  const needsAuth = error && /sign in|provider account/i.test(error);
  const summary = overview?.summary || { waiting: 0, serving: 0, openDesks: 0, completedToday: 0 };
  
  return (
    <main className="page-width page-content provider-page">
      <div className="page-heading"><div><span className="eyebrow">CAMPUS OPERATIONS</span><h1>Provider console</h1><p>Manage service desks and call the next student in line.</p></div><span className="live-note"><span className="pulse-dot" /> Dispatch board live</span></div>
      <div className="provider-note"><Icon name="info" /><span><strong>Dispatcher view.</strong> Use “Call next” when the current student is finished. MySQL mode requires a provider account; the local demo is open for the hackathon walkthrough.</span></div>
      
      {needsAuth ? (
        <ProviderAuth onAuth={(u) => { onAuth(u); refreshOverview(); }} />
      ) : (
        <>
          {error && <div className="inline-alert"><Icon name="error" />{error}</div>}
          <div className="provider-stats"><div><span className="metric-label">WAITING ACROSS CAMPUS</span><strong>{loading ? '—' : summary.waiting}</strong><span>students in line</span></div><div><span className="metric-label">CURRENTLY SERVING</span><strong>{loading ? '—' : summary.serving}</strong><span>active desks</span></div><div><span className="metric-label">OPEN SERVICE DESKS</span><strong>{loading ? '—' : summary.openDesks}</strong><span>ready to help</span></div><div><span className="metric-label">COMPLETED TODAY</span><strong>{loading ? '—' : summary.completedToday}</strong><span>tickets served</span></div></div>
          <section className="provider-desks"><div className="subsection-heading"><h2>Service desk dispatch</h2><span>Updates every 5 seconds</span></div>{overview?.services.map((service) => <article className="dispatch-card" key={service.id}><div className="dispatch-service"><span className={`service-icon service-icon-${service.id}`}><Icon name={service.icon} /></span><div><h3>{service.name}</h3><span>{service.location}</span><small>{service.waiting.length} {service.waiting.length === 1 ? 'student' : 'students'} waiting · ~{service.estimatedWaitMinutes} min</small></div></div><div className="dispatch-current"><span className="metric-label">NOW SERVING</span>{service.current ? <strong>{service.current.ticketCode}<small> · {service.current.studentName}</small></strong> : <span className="muted-text">No active ticket</span>}</div><div className="dispatch-next"><span className="metric-label">NEXT IN LINE</span>{service.waiting[0] ? <strong>{service.waiting[0].ticketCode}<small> · {service.waiting[0].studentName}</small></strong> : <span className="muted-text">Queue is clear</span>}</div><div className="dispatch-actions">{service.current ? <button className="button button-outline button-small" disabled={busyService === service.id} onClick={() => completeCurrent(service)}><Icon name="task_alt" size={17} /> Complete</button> : <button className="button button-primary button-small" disabled={!service.waiting.length || busyService === service.id} onClick={() => callNext(service)}><Icon name="campaign" size={18} /> {busyService === service.id ? 'Updating…' : 'Call next'}</button>}</div></article>)}{!loading && !overview?.services?.length && <div className="empty-inline">No service desks are configured yet.</div>}</section>
          <p className="device-note"><Icon name="sms" size={16} /> Calling a ticket sends an SMS if Twilio is configured. Without SMS credentials, the student still sees the updated ticket status in the app.</p>
        </>
      )}
    </main>
  );
}
