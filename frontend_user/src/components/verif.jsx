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

    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (token && user) {
      action();
    } else {
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