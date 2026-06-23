// src/hooks/useWebSocketNotifications.js
import { useEffect } from 'react';
import { socket } from '../services/socket';
import { useNotifications } from '../context/NotificationContext';

export const useWebSocketNotifications = () => {
  const { addNotification } = useNotifications();

  useEffect(() => {
    // Récupérer l'utilisateur connecté
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const clientId = user?.public_id || null;

    const handleCommandeUpdate = (data) => {
      console.log('📢 Événement reçu (client) :', data);

      // Si le client est connecté et que la commande ne lui appartient pas, on ignore
      if (clientId && data.userId && data.userId !== clientId) {
        console.log('⏩ Notification ignorée (pas pour ce client)');
        return;
      }

      let title = '';
      let message = '';
      let type = 'info';
      let link = null;

      switch (data.type) {
        case 'status_changed':
          title = '📊 Statut de votre commande';
          message = `Votre commande est maintenant "${data.newStatus}"`;
          type = 'info';
          link = `/client/commandes/${data.commandeId}`;
          break;
        case 'livreur_assigne':
          title = '🚚 Livreur assigné';
          message = `Un livreur a pris en charge votre commande`;
          type = 'success';
          link = `/client/commandes/${data.commandeId}`;
          break;
        case 'statut_livraison_change':
          title = '📦 Avancement livraison';
          message = `Statut de livraison : "${data.newStatutLivraison}"`;
          type = 'warning';
          link = `/client/commandes/${data.commandeId}`;
          break;
        case 'commande_deleted':
          title = '🗑️ Commande annulée';
          message = `Votre commande a été annulée`;
          type = 'error';
          link = `/client/commandes`;
          break;
        default:
          title = '🔄 Mise à jour';
          message = `Une modification a été effectuée sur votre commande`;
          type = 'info';
      }

      addNotification({
        type,
        title,
        message,
        link,
        data
      });
    };

    socket.on('commande_updated', handleCommandeUpdate);

    return () => {
      socket.off('commande_updated', handleCommandeUpdate);
    };
  }, [addNotification]);
};