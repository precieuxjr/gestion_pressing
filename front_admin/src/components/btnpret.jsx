import { motion } from 'framer-motion';

export default function ReadyButton({ command, onReady }) {
  const isDisabled = command.status === 'Prêt' || command.status === 'Terminé';

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onReady(command.id)}
      disabled={isDisabled}
      className="bg-blue-500 p-1 text-white font-semibold rounded-3xl text-[11px]"
    >
      {command.status === 'Prêt' ? '' : 'Prêt'}
    </motion.button>
  );
}