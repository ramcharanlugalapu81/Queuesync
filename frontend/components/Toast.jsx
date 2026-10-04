import { useEffect } from 'react';
import Icon from './Icon.jsx';

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(onClose, 4600);
    return () => window.clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;
  return (
    <div className={`toast toast-${toast.type || 'success'}`} role="status">
      <Icon name={toast.type === 'error' ? 'error' : 'check_circle'} />
      <span>{toast.message}</span>
      <button aria-label="Dismiss message" className="icon-button toast-close" onClick={onClose}><Icon name="close" /></button>
    </div>
  );
}
