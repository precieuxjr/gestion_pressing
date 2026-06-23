import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { socket } from './services/socket';
import { NotificationProvider } from './context/NotificationContext';
import { useWebSocketNotifications } from './hooks/useWebSocketNotifications';

import Navbar from './components/nav_admin';
import Dashboard from './pages/dashboard';
import Commandes from './pages/commandes';
import AdminLoginPage from './pages/auth/authentification';
import Clients from './pages/clients';
import Services_pressing from './pages/services';
import Paiements from './pages/paiements';
import Livraisons from './pages/livraison';
import Parametres from './pages/parametre';
import ErrorBoundary from './components/ErrorBoundary';
import MesCommandes from './pages/recuperer_commande';

const AdminLayout = () => {
  return (
    <div className="flex relative min-h-screen">
      <Navbar />
      <main className="flex-1 ml-72 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
};

// Composant interne qui utilise les hooks de notification
function AppContent() {
  console.log('🔄 AppContent monté (admin)');

  // Active l'écoute des notifications WebSocket
  useWebSocketNotifications();

  useEffect(() => {
    const onConnect = () => {
      console.log('✅ Socket connecté, activation des écouteurs');
    };
  
    socket.on('connect', onConnect);
  
    if (socket.connected) {
      onConnect();
    }
  
    return () => {
      socket.off('connect', onConnect);
    };
  }, []);

  return (
    <Routes>
      {/* Page de connexion */}
      <Route path="/" element={<AdminLoginPage />} />

      {/* Routes Admin */}
      <Route
        path="/admin"
        element={
          <ErrorBoundary>
            <AdminLayout />
          </ErrorBoundary>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="commandes" element={<Commandes />} />
        <Route path="clients" element={<Clients />} />
        <Route path="services" element={<Services_pressing />} />
        <Route path="paiements" element={<Paiements />} />
        <Route path="recuperer" element={<MesCommandes />} />
        <Route path="livraisons" element={<Livraisons />} />
        <Route path="parametre" element={<Parametres />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <NotificationProvider>
        <Toaster position="top-right" />
        <AppContent />
      </NotificationProvider>
    </Router>
  );
}