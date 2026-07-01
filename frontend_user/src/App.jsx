import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Navbar from './components/navbar';
import Hero from './pages/Hero';
import Services from './pages/services';
import Expertise from './pages/expertise';
import Galerie from './pages/galerie';
import Apropos from './pages/apropos';
import Contact from './pages/contact';
import Footer from './components/footer';
import SelectionServices from './pages/selection_serv';
import Login from './pages/auth/Login';
import Register from './pages/auth/register';
import ClientDashboard from './pages/Dashboard';
import Recapitulatif from './pages/recapitulatif';
import Paiement from './pages/paiement';
import ErrorBoundary from './components/ErrorBoundary';
import NouvelleCommande from './pages/NouvelleCommande';

// ✅ Imports pour les notifications en temps réel
import { NotificationProvider } from './context/NotificationContext';
import { useWebSocketNotifications } from './hooks/useWebSocketNotifications';

// =========================================
// Composant de protection des routes
// =========================================
function ProtectedRoute({ children, allowedRole = 'client' }) {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  if (!token || user.role !== allowedRole) {
    return <Navigate to="/login?create=true" replace />;
  }
  return children;
}

// =========================================
// Sous-composant pour la vitrine One-Page
// =========================================
function AccueilVitrine() {
  return (
    <>
      <section
        id="accueil"
        className="min-h-screen flex items-center bg-white dark:bg-slate-900"
      >
        <Hero />
      </section>
      <section
        id="expertise"
        className="min-h-screen py-16 sm:py-24 bg-slate-50 dark:bg-slate-950"
      >
        <Expertise />
      </section>
      <section
        id="services"
        className="min-h-screen py-16 sm:py-24 bg-white dark:bg-slate-900"
      >
        <Services />
      </section>
      <section
        id="galerie"
        className="min-h-screen py-16 sm:py-24 bg-slate-50 dark:bg-slate-950"
      >
        <Galerie />
      </section>
      <section
        id="a-propos"
        className="min-h-screen py-16 sm:py-24 bg-white dark:bg-slate-900"
      >
        <Apropos />
      </section>
      <section
        id="contact"
        className="min-h-screen py-16 sm:py-24 bg-slate-50 dark:bg-slate-950"
      >
        <Contact />
      </section>
    </>
  );
}

// =========================================
// Composant interne pour activer les notifications
// =========================================
function AppContent() {
  // ✅ Active l'écoute des notifications WebSocket (client)
  useWebSocketNotifications();

  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        {/* Routes publiques */}
        <Route path="/" element={<AccueilVitrine />} />
        <Route path="/selection" element={<SelectionServices />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Routes protégées (client uniquement) */}
        <Route
          path="/client/recapitulatif"
          element={
            <ProtectedRoute>
              <Recapitulatif />
            </ProtectedRoute>
          }
        />
        <Route
          path="/client/dashboard"
          element={
            <ProtectedRoute>
              <ClientDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/client/paiement"
          element={
            <ProtectedRoute>
              <ErrorBoundary>
                <Paiement />
              </ErrorBoundary>
            </ProtectedRoute>
          }
        />{' '}
        <Route path="/client/commandes/:id" element={<ClientDashboard />} />
        <Route
          path="/client/commandes/nouvelle"
          element={
            <ProtectedRoute>
              <ErrorBoundary>
                <NouvelleCommande />
              </ErrorBoundary>
            </ProtectedRoute>
          }
        />
        {/* Page 404 */}
        <Route
          path="*"
          element={<h1 className="text-center p-8">Page non trouvée</h1>}
        />
      </Routes>
    </>
  );
}

// =========================================
// App principal
// =========================================
export default function App() {
  return (
    <Router>
      {/* ✅ Provider des notifications (englobe toute l'application) */}
      <NotificationProvider>
        <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 flex flex-col justify-between transition-colors duration-300">
          {/* Barre de navigation fixe */}
          <header className="fixed top-0 w-full z-50">
            <Navbar />
          </header>

          {/* Contenu principal */}
          <main className="w-full pt-16 flex-grow">
            <AppContent />
          </main>

          {/* Pied de page */}
          <footer className="w-full bg-slate-900 text-white dark:bg-slate-950 border-t border-slate-800/40">
            <Footer />
          </footer>
        </div>
      </NotificationProvider>
    </Router>
  );
}
