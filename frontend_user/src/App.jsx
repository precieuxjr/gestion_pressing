import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

// 1. Sous-composant pour regrouper la structure de la vitrine One-Page
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

// 2. Composant principal gérant les routes et le thème global
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 flex flex-col justify-between transition-colors duration-300">
        {/* Barre de navigation fixe globale */}
        <header className="fixed top-0 w-full z-50">
          <Navbar />
        </header>

        {/* Zone principale injectée dynamiquement */}
        <main className="w-full pt-16 flex-grow">
          <Routes>
            <Route path="/" element={<AccueilVitrine />} />
            <Route path="/selection" element={<SelectionServices />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
           
            <Route path="/client/dashboard" element={<ClientDashboard />} />
          </Routes>
        </main>

        {/* Pied de page global */}
        <footer className="w-full bg-slate-900 text-white dark:bg-slate-950 border-t border-slate-800/40">
          <Footer />
        </footer>
      </div>
    </Router>
  );
}

export default App;
