import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SmartPressingDashboard from './pages/dashboard'; // Ajuste le chemin si nécessaire
import { AdminLoginPage } from './pages/auth/authentification';

function App() {
  return (<section className='bg-gray-50'>
    <Router>
      <Routes>
        {/* 1. La racine "/" affiche TOUJOURS la page de connexion en premier */}
        <Route path="/" element={<AdminLoginPage />} />

        {/* 2. L'adresse "/admin/dashboard" affichera le tableau de bord après la connexion */}
        <Route path="/admin/dashboard" element={<SmartPressingDashboard />} />
      </Routes>
    </Router>
    </section>
  );
}

export default App;