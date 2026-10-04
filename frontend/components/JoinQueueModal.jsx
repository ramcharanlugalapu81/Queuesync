import { useEffect, useState } from 'react';
import Icon from './Icon.jsx';
import { apiRequest, saveTicket } from '../services/api.js';

export default function JoinQueueModal({ service, onClose, onJoined }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const onEscape = (event) => event.key === 'Escape' && onClose();
    window.addEventListener('keydown', onEscape);
    document.body.classList.add('modal-open');
    return () => {
      window.removeEventListener('keydown', onEscape);
      document.body.classList.remove('modal-open');
    };
  }, [onClose]);

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');
    const form = new FormData(event.currentTarget);
    try {
      const { ticket } = await apiRequest('/tokens/join', {
        method: 'POST',
        body: JSON.stringify({ serviceId: service.id, name: form.get('name'), campusId: form.get('campusId'), phone: form.get('phone') }),
      });
      saveTicket(ticket.id, ticket.managementKey);
      onJoined(ticket);
    } catch (requestError) {
      setError(requestError.message);
      setIsSubmitting(false);
    }
  }

  return (
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="join-modal" role="dialog" aria-modal="true" aria-labelledby="join-heading">
        <div className="modal-header">
          <div><span className="eyebrow">TAKE A PLACE IN LINE</span><h2 id="join-heading">Join {service.name}</h2><p>{service.location}</p></div>
          <button className="icon-button modal-close" aria-label="Close" onClick={onClose}><Icon name="close" /></button>
        </div>
        <div className="join-summary"><div><span className="metric-label">CURRENT WAIT</span><strong>{service.waitingCount || 0} <small>ahead of you</small></strong></div><div><span className="metric-label">ESTIMATED TIME</span><strong>~{service.estimatedWaitMinutes || 0} <small>min</small></strong></div></div>
        <form className="form-stack" onSubmit={handleSubmit}>
          <label className="field-label">Your name<input name="name" autoComplete="name" placeholder="e.g. Alex Chen" maxLength="120" required /></label>
          <label className="field-label">Campus ID <span className="optional-label">OPTIONAL</span><input name="campusId" placeholder="e.g. 2026-CS-041" maxLength="60" /></label>
          <label className="field-label">Mobile number<input name="phone" type="tel" autoComplete="tel" placeholder="+91 98765 43210" minLength="7" maxLength="20" required /><small>If campus SMS is enabled, we’ll text you when your ticket is called. Standard SMS charges may apply.</small></label>
          {error && <p className="form-error" role="alert"><Icon name="error" size={17} />{error}</p>}
          <button className="button button-primary button-full" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving your place…' : 'Confirm and get my ticket'} <Icon name="arrow_forward" /></button>
          <p className="privacy-note"><Icon name="lock" size={15} /> Your number is used only for queue updates.</p>
        </form>
      </section>
    </div>
  );
}
