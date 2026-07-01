import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';

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
import { useWebSocketNotificationsLivreur } from './hooks/useWebSocketNotificationsLivreur';
import { connectSocket } from './services/socket';

// Layout Livreur
const DeliveryLayout = () => {
  return (
    <div className="flex relative min-h-screen bg-[#f4f7fb] dark:bg-gray-900">
      <NavLivreur />
      <main className="flex-1 min-h-screen overflow-x-hidden ml-0 lg:ml-64 transition-all duration-300 pt-16 lg:pt-0">
        <Outlet />
      </main>
    </div>
  );
};

// Composant interne
function AppContent() {
  // ✅ Active le hook WebSocket pour le livreur
  useWebSocketNotificationsLivreur();

  // ✅ Connecte la socket si le token existe
  useEffect(() => {
    const token = localStorage.getItem('token_livreur');
    if (token) {
      connectSocket();
    }
  }, []);

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => console.log('Reset de l’erreur')}
    >
      <Routes>
        <Route path="/" element={<Navigate to="/livreur/login" replace />} />
        <Route path="/livreur/login" element={<Livreur_Login />} />
        <Route path="/livreur" element={<DeliveryLayout />}>
          <Route path="dashboard" element={<LivreurDashboard />} />
          <Route path="commandes" element={<LivreurCommandes />} />
          <Route path="livraisons" element={<LivreurLivraisons />} />
          <Route path="parametres" element={<LivreurParametres />} />
          <Route path="profil" element={<LivreurParametres />} />
          <Route index element={<Navigate to="/livreur/dashboard" replace />} />
        </Route>
        <Route path="*" element={<h1 className="p-8 text-center text-gray-500 dark:text-gray-400">Page non trouvée</h1>} />
      </Routes>
    </ErrorBoundary>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <NotificationProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#ffffff',
                color: '#1f2937',
                padding: '16px 20px',
                borderRadius: '12px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.08), 0 6px 10px rgba(0,0,0,0.02)',
                border: '1px solid #f3f4f6',
                fontSize: '14px',
                fontWeight: 500,
              },
              success: {
                style: {
                  background: '#ecfdf5',
                  color: '#065f46',
                  border: '1px solid #a7f3d0',
                },
              },
              error: {
                style: {
                  background: '#fef2f2',
                  color: '#991b1b',
                  border: '1px solid #fca5a5',
                },
              },
            }}
          />
          <AppContent />
        </NotificationProvider>
      </Router>
    </ThemeProvider>
  );
}