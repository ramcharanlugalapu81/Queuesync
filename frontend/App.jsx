import { useCallback, useEffect, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Footer from './components/Footer.jsx';
import Header from './components/Header.jsx';
import Icon from './components/Icon.jsx';
import JoinQueueModal from './components/JoinQueueModal.jsx';
import Toast from './components/Toast.jsx';
import HomePage from './pages/HomePage.jsx';
import LivePage from './pages/LivePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import ProviderPage from './pages/ProviderPage.jsx';
import ServicesPage from './pages/ServicesPage.jsx';
import TicketsPage from './pages/TicketsPage.jsx';
import { apiRequest } from './services/api.js';

export default function App() {
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [apiError, setApiError] = useState('');
  const [selectedService, setSelectedService] = useState(null);
  const [toast, setToast] = useState(null);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const refreshServices = useCallback(async () => {
    try {
      const data = await apiRequest('/services');
      setServices(data.services);
      setApiError('');
    } catch (error) {
      setApiError(error.message);
    } finally {
      setLoadingServices(false);
    }
  }, []);

  useEffect(() => {
    refreshServices();
    const timer = window.setInterval(refreshServices, 5000);
    return () => window.clearInterval(timer);
  }, [refreshServices]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  useEffect(() => {
    if (!localStorage.getItem('queueflow.session')) return;
    apiRequest('/auth/me').then(({ user: savedUser }) => setUser(savedUser)).catch(() => {
      localStorage.removeItem('queueflow.session');
      setUser(null);
    });
  }, []);

  const handleToast = useCallback((nextToast) => setToast(nextToast), []);
  function handleJoined(ticket) {
    setSelectedService(null);
    setToast({ type: 'success', message: ticket.sms?.sent ? `${ticket.ticketCode} is yours. SMS confirmation sent.` : `${ticket.ticketCode} is yours. Follow the live status in My tickets.` });
    refreshServices();
    navigate('/tickets');
  }

  function handleLogout() {
    localStorage.removeItem('queueflow.session');
    setUser(null);
    setToast({ type: 'success', message: 'You have signed out.' });
    navigate('/');
  }

  return (
    <div className="app-shell">
      <Header user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<HomePage services={services} loading={loadingServices} apiError={apiError} onJoin={setSelectedService} />} />
        <Route path="/services" element={<ServicesPage services={services} onJoin={setSelectedService} loading={loadingServices} />} />
        <Route path="/tickets" element={<TicketsPage onRefresh={refreshServices} />} />
        <Route path="/live" element={<LivePage services={services} loading={loadingServices} />} />
        <Route path="/provider" element={<ProviderPage onToast={handleToast} user={user} onAuth={setUser} />} />
        <Route path="/login" element={<LoginPage onAuth={setUser} />} />
        <Route path="*" element={<main className="page-width not-found"><Icon name="explore_off" size={38} /><h1>That page isn’t here.</h1><button className="button button-primary" onClick={() => navigate('/')}>Back to home</button></main>} />
      </Routes>
      <Footer />
      {selectedService && <JoinQueueModal service={selectedService} onClose={() => setSelectedService(null)} onJoined={handleJoined} />}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
