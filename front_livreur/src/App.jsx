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
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from './components/ErrorFallback';

// Notifications
import { NotificationProvider } from './context/NotificationContext';
import { useWebSocketNotifications } from './hooks/useWebSocketNotifications';

// Layout Livreur
const DeliveryLayout = () => {
  console.log('🏗️ DeliveryLayout rendu');
  return (
    <div className="flex relative">
      <NavLivreur />
      <main className="min-h-screen ml-72 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
};

// Composant interne pour activer l'écoute des notifications
function AppContent() {
  console.log('🔄 AppContent (livreur) monté');
  useWebSocketNotifications();

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        console.log('Reset de l’erreur');
      }}
    >
      <Routes>
        {/* Redirection racine */}
        <Route path="/" element={<Navigate to="/livreur/login" replace />} />

        {/* Login public */}
        <Route path="/livreur/login" element={<Livreur_Login/>} />

        {/* Routes protégées (layout avec navbar) */}
        <Route path="/livreur" element={<DeliveryLayout />}>
          <Route path="dashboard" element={<LivreurDashboard />} />
          <Route path="commandes" element={<LivreurCommandes />} />
          <Route path="livraisons" element={<LivreurLivraisons />} />
          <Route path="parametres" element={<LivreurParametres />} />
          <Route index element={<Navigate to="/livreur/dashboard" replace />} />
        </Route>

        {/* Route de test (optionnelle) */}
        <Route path="/livreur/dashboard-test" element={<div>Test Dashboard</div>} />

        {/* 404 */}
        <Route path="*" element={<h1 className="p-8 text-center text-gray-500">Page non trouvée</h1>} />
      </Routes>
    </ErrorBoundary>
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