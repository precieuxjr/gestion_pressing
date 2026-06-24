import { useNavigate } from 'react-router-dom';

export default function StepButton({
  action,
  label = "Passer à l'étape suivante",
  className = "",
  disabled = false,
  type = "button"
}) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (disabled) return;

    // Vérifier la présence du token et des infos utilisateur
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    // Si pas de token ou pas d'utilisateur → redirection vers login
    if (!token || !userData) {
      navigate('/login?create=true');
      return;
    }

    try {
      const user = JSON.parse(userData);
      // Vérifier que l'utilisateur est bien un client
      if (user.role !== 'client') {
        // Si ce n'est pas un client, on le redirige vers login
        navigate('/login?create=true');
        return;
      }

      // Tout est bon → aller au récapitulatif
      navigate('/client/commandes/nouvelle');
    } catch (error) {
      // En cas d'erreur de parsing, rediriger vers login
      console.error('Erreur lors du parsing user :', error);
      navigate('/login?create=true');
    }
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled}
      className={`
        w-full bg-blue-600 dark:bg-blue-500 
        hover:bg-blue-700 dark:hover:bg-blue-600 
        text-white font-bold py-4 px-6 rounded-2xl 
        flex items-center justify-center gap-2 
        transition-all duration-300 
        shadow-lg shadow-blue-500/10 
        transform hover:-translate-y-0.5 
        cursor-pointer 
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      <span>{label}</span>
    </button>
  );
}