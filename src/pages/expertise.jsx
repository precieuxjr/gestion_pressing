import Specialities from "../components/specialite";

export default function Expertise() {
  return (
    <section className="py-20  min-h-screen">
      <div className="container text-[#111111]mx-auto px-6">  
  
        <div className="text-center mb-16">
          <h2 className="py-2 text-blue-500 font-bold text-sm tracking-[0.3em] uppercase">
            NOTRE EXPERTISE
          </h2> 
          <h1 className="text-[#111111] text-4xl md:text-5xl font-black uppercase tracking-tighter">
            NOS SPÉCIALITÉS
          </h1>
          <div className="w-24 h-1 bg-yellow-500 mx-auto my-6 rounded-full"></div>
          <p className="text-gray-400 italic max-w-2xl mx-auto">
            Un savoir-faire unique reconnu par le titre de Meilleur Ouvrier du Congo
          </p>
        </div>

        <Specialities />
      </div>
    </section>
  );
}