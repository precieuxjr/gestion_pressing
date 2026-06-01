import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './components/nav_admin';
import Dashboard from './pages/dashboard';
import Commandes from './pages/commandes';
import AdminLoginPage from './pages/auth/authentification';

const AdminLayout = () => {
  return (
    <div className="flex">
      <Navbar  /> 
      <main className="flex-1 pl-70">
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
        </Route>
      </Routes>
    </Router>
  );
}