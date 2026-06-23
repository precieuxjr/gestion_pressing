// src/App.jsx (livreur)
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Composants Livreur
import Livreur_Login from './pages/auth/auth_livreur';
import NavLivreur from './components/navbar';
import LivreurDashboard from './pages/dashboard';
import LivreurCommandes from './pages/commandes';
import LivreurLivraisons from './pages/livraisons';
import LivreurParametres from './pages/parametres';

// ✅ Notifications
import { NotificationProvider } from './context/NotificationContext';
import { useWebSocketNotifications } from './hooks/useWebSocketNotifications';

// Layout Livreur
const DeliveryLayout = () => {
  return (
    <div className="flex relative">
      <NavLivreur />
      <main className="min-h-screen ml-72 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
};

// ✅ Composant interne pour activer l'écoute des notifications
function AppContent() {
  useWebSocketNotifications(); // écoute les événements WebSocket
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/livreur/login" replace />} />
      <Route path="/livreur/login" element={<Livreur_Login />} />
      <Route path="/livreur" element={<DeliveryLayout />}>
        <Route path="dashboard" element={<LivreurDashboard />} />
        <Route path="commandes" element={<LivreurCommandes />} />
        <Route path="livraisons" element={<LivreurLivraisons />} />
        <Route path="parametres" element={<LivreurParametres />} />
        <Route index element={<Navigate to="/livreur/dashboard" replace />} />
      </Route>
      <Route path="*" element={<h1 className="p-8 text-center text-gray-500">Page non trouvée</h1>} />
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