import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';

// Composants Livreur
import Livreur_Login from './pages/auth/auth_livreur';
import NavLivreur from './components/navbar'; // Assurez-vous que le nom exporté correspond
import LivreurDashboard from './pages/dashboard';
import LivreurCommandes from './pages/commandes';
import LivreurLivraisons from './pages/livraisons';
import LivreurParametres from './pages/parametres';
// Si vous avez une page Profil, importez-la ici

// Layout Livreur (seul layout nécessaire)
const DeliveryLayout = () => {
  return (
    <div className="flex relative">
      <NavLivreur />
      <main className="flex-1 ml-72 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Redirection racine → login livreur */}
        <Route path="/" element={<Navigate to="/livreur/login" replace />} />

        {/* Page de connexion */}
        <Route path="/livreur/login" element={<Livreur_Login />} />

        {/* Routes protégées (layout avec navbar) */}
        <Route path="/livreur" element={<DeliveryLayout />}>
          <Route path="dashboard" element={<LivreurDashboard />} />
          <Route path="commandes" element={<LivreurCommandes />} />
          <Route path="livraisons" element={<LivreurLivraisons />} />
          <Route path="parametres" element={<LivreurParametres />} />
          {/* Si vous avez une page profil : */}
          {/* <Route path="profil" element={<LivreurProfil />} /> */}

          {/* Redirection par défaut dans /livreur */}
          <Route index element={<Navigate to="/livreur/dashboard" replace />} />
        </Route>

        {/* Page 404 */}
        <Route path="*" element={<h1 className="p-8 text-center text-gray-500">Page non trouvée</h1>} />
      </Routes>
    </Router>
  );
}