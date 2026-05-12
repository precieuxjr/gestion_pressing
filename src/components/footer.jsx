import Logo from '../assets/logo.png';

export default function Footer() {
  return (
    <section className=' grid grid-cols-2 gap-2 px-20'>
      <div>

      <img src={Logo} alt="" className="w-auto h-40 " />
      <p>
        Pressing by Fortitude, votre partenaire de confiance pour le nettoyage à
        sec, la blanchisserie et les retouches à Kinshasa. Meilleur Ouvrier du
        Congo.
      </p>
      </div>


      <div>
      Liens Rapides
      </div>
    </section>
  );
}
