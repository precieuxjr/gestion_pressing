import { useNavigate } from 'react-router-dom';

export default function StepButton({ action, label = "Passer à l'étape suivante" }) {
  const navigate = useNavigate();

  const handleClick = () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (token && user) {
      // ✅ Connecté – exécuter l’action
      action();
    } else {
      // ❌ Non connecté – rediriger vers login avec option création compte
      navigate('/login?create=true');
    }
  };

  return (
    <button
      onClick={handleClick}
      className="w-full bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-blue-500/10 transform hover:-translate-y-0.5 cursor-pointer"
    >
      <span>{label}</span>
    </button>
  );
}