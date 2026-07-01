// hooks/useWebSocketNotifications.js (pour client)
import { useEffect } from 'react';
import { socket } from '../services/socket';
import { useNotifications } from '../context/NotificationContext';

export const useWebSocketNotifications = () => {
  const { addNotification } = useNotifications();

  useEffect(() => {
    const handleUpdate = (data) => {
      addNotification({
        type: data.type,
        title: '📦 Mise à jour',
        message: data.message || 'Votre commande a été mise à jour',
        link: `/client/commandes/${data.commandeId}`,
        data,
      });
    };

    socket.on('commande_updated', handleUpdate);
    return () => socket.off('commande_updated', handleUpdate);
  }, [addNotification]);
};