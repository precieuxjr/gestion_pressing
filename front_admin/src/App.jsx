import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './components/nav_admin';
import Dashboard from './pages/dashboard';
import Commandes from './pages/commandes';
import AdminLoginPage from './pages/auth/authentification';
import Clients from './pages/clients';
import Services_pressing from './pages/services';

const AdminLayout = () => {
  return (
    <div className="flex relative">
      <Navbar  /> 
      <main className="flex-1 mx-72  ">
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
        </Route>
      </Routes>
    </Router>
  );
}