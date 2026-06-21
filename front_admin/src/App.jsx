import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './components/nav_admin';
import Dashboard from './pages/dashboard';
import Commandes from './pages/commandes';
import AdminLoginPage from './pages/auth/authentification';
import Clients from './pages/clients';
import Services_pressing from './pages/services';
import Paiements from './pages/paiements';
import Livraisons from './pages/livraison';
import Parametres from './pages/parametre';
const AdminLayout = () => {
  return (
    <div className="flex relative min-h-screen">
      <Navbar /> 
      <main className="flex-1 ml-72 overflow-x-hidden ">
        <Outlet />
      </main>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Page de connexion */}
        <Route path="/" element={<AdminLoginPage />} />
        
        {/* Routes Admin - CORRECTION ICI */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="commandes" element={<Commandes />} />
          <Route path='clients' element ={<Clients />} />
          <Route path='services' element ={<Services_pressing />}/>
          <Route path='paiements' element ={<Paiements />}/>
          <Route path='livraisons' element ={<Livraisons />}/>
          <Route path='parametre' element ={<Parametres />}/>
        </Route>
      </Routes>
    </Router>
  );
}