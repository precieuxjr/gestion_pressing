import './App.css'
import Navbar from './components/navbar'
import Hero from './pages/hero'
import Services from './pages/services'

function App() {
  // On ne met plus de switch ici car on veut que tout soit sur la même page (Scroll)
  
  return (  
    <div className="min-h-screen">
      {/* Navbar fixe en haut */}
      <header id="en_tete">
        <Navbar />
      </header>

      <main>
        {/* Ajoute 'pt-20' pour éviter que la navbar ne cache le début du contenu */}
        <section id="accueil" className="min-h-screen pt-20">
          <Hero/>
        </section>

        <section id="services" className="min-h-screen pt-20">
          <h1 className=" text-center"><Services/></h1>
        </section>

        <section id="galerie" className="min-h-screen pt-20">
          <h1 className="text-4xl text-center">Galerie</h1>
        </section>

        {/* Correction de l'ID : "a-propos" au lieu de "a propos" */}
        <section id="a-propos" className="min-h-screen pt-20">
          <h1 className="text-4xl text-center">À Propos</h1>
        </section>

        <section id="contact" className="min-h-screen pt-20">
          <h1 className="text-4xl text-center">Contact</h1>
        </section>
      </main>
    </div>
  )
}

export default App