import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { reconnectSocket } from './services/socket';
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
      <main className="flex-1 ml-0 lg:ml-64 overflow-x-hidden pt-16 lg:pt-0 transition-all duration-300">
        <Outlet />
      </main>
    </div>
  );
};

// Composant interne qui utilise les hooks de notification
function AppContent() {
  console.log('🔄 AppContent monté (admin)');

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
  useEffect(() => {
    const token = localStorage.getItem('token_admin');
    if (token) {
      reconnectSocket();
      console.log('token recharger ! ')
    }
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
        <Route path="commandes/:id" element={<Commandes />} />
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