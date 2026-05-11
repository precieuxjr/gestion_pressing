import './App.css'
import Navbar from './components/navbar'
import Hero from './pages/hero'
import Services from './pages/services'
import Expertise from './pages/expertise'
import Galerie from './pages/galerie'
import Apropos from './pages/apropos'
import Contact from './pages/contact'


function App() {
  return (  
    <div className="min-h-screen bg-white ">
   
      <header id="en_tete" className="fixed top-0 w-full z-50">
        <Navbar />
      </header>

      <main className="w-full">
  
        <section id="accueil" className="min-h-screen flex items-center bg-gray-50">
          <Hero/>
        </section>

        
        <section id="expertise" className="min-h-screen py-12 md:py-20 px-4 md:px-0">
          <div className="container mx-auto">
             <Expertise />
          </div>
        </section>

        
        <section id="services" className="min-h-screen py-20 bg-gray-50">
          
            <Services />
          
        </section>

        <section id="galerie" className="min-h-screen py-12 md:py-20 px-4 md:px-0">
          <div className="container mx-auto">
             <Galerie />
          </div>
        </section>

        
        <section id="a-propos" className="min-h-screen py-25 px-4  bg-gray-50">
         <Apropos />
        </section>

       
        <section id="contact" className="min-h-screen py-20 ">
          <Contact />
        </section>
      </main>
    </div>
  )
}

export default App