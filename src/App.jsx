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

  // On importe ton nouveau composant avec la sélection des prix
  import SelectionServices from './pages/selection_serv'; 

  // 1. On crée un sous-composant pour ta page d'accueil vitrine actuelle
  function AccueilVitrine() {
    return (
      <>
        <section id="accueil" className="min-h-screen flex items-center bg-gray-50">
          <Hero />
        </section>

        <section id="expertise" className="min-h-screen py-20 px-4">
          <Expertise />
        </section>

        <section id="services" className="min-h-screen py-20 bg-gray-50">
          <Services />
        </section>

        <section id="galerie" className="min-h-screen py-20 px-4">
          <Galerie />
        </section>

        <section id="a-propos" className="min-h-screen py-20 bg-gray-50">
          <Apropos />
        </section>

        <section id="contact" className="min-h-screen py-20">
          <Contact />
        </section>
      </>
    );
  }

  // 2. Le composant principal App gère le routage global
  function App() {
    return (
      <Router>
        <div className="min-h-screen bg-white flex flex-col justify-between">
          
          {/* La barre de navigation reste visible sur TOUTES les pages */}
          <header className="fixed top-0 w-full z-50">
            <Navbar />
          </header>

          {/* Le routeur décide dynamiquement de ce qui s'affiche ici */}
          <main className="w-full pt-20"> {/* Ajout d'un petit padding-top pour pas que la navbar fixe cache le haut */}
            <Routes>
              {/* Si l'utilisateur est sur l'accueil, on affiche tout ton site vitrine */}
              <Route path="/" element={<AccueilVitrine />} />

              {/* Si l'utilisateur clique sur Commander, on affiche la page de sélection */}
              <Route path="/selection" element={<SelectionServices />} />
            </Routes>
          </main>

          {/* Le footer reste visible partout */}
          <footer>
            <Footer />
          </footer>
          
        </div>
      </Router>
    );
  }

  export default App;