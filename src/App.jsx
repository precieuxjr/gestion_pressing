import './App.css'
import Navbar from './components/navbar'
import Hero from './pages/hero'
import Services from './pages/services'
import Galerie from './pages/galerie'


function App() {
  return (  
    <div className="min-h-screen bg-white ">
   
      <header id="en_tete" className="fixed top-0 w-full z-50">
        <Navbar />
      </header>

      <main className="w-full">
        {/* HERO : On utilise 'min-h-screen' pour occuper tout l'espace */}
        <section id="accueil" className="min-h-screen flex items-center bg-gray-50">
          <Hero/>
        </section>

        {/* SERVICES : Padding réactif (plus petit sur mobile, plus grand sur PC) */}
        <section id="services" className="min-h-screen py-12 md:py-20 px-4 md:px-0">
          <div className="container mx-auto">
             <Services/>
          </div>
        </section>

        
        <section id="galerie" className="min-h-screen py-20 bg-gray-50">
          
            <Galerie />
          
        </section>

        
        <section id="a-propos" className="min-h-screen py-20">
          <h1 className="text-3xl md:text-5xl font-black text-center dark:text-white uppercase">
            À Propos
          </h1>
        </section>

       
        <section id="contact" className="min-h-screen py-20 bg-gray-50">
          <h1 className="text-3xl md:text-5xl font-black text-center dark:text-white uppercase">
            Contact
          </h1>
        </section>
      </main>
    </div>
  )
}

export default App