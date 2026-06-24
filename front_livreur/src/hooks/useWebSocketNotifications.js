import { useEffect } from 'react';
import { socket } from '../services/socket';
import { useNotifications } from '../context/NotificationContext';

export const useWebSocketNotifications = () => {
  const { addNotification } = useNotifications();

  useEffect(() => {
    const handleCommandeUpdate = (data) => {
      console.log('📢 Événement reçu (livreur) :', data);

      let title = '';
      let message = '';
      let type = 'info';
      let link = null;

      switch (data.type) {
        case 'livreur_assigne':
          title = '🚚 Nouvelle commande assignée';
          message = `Une commande vous a été assignée.`;
          type = 'success';
          link = `/livreur/commandes`;
          break;
        case 'statut_livraison_change':
          title = '📦 Statut de livraison modifié';
          message = `Statut de livraison : "${data.newStatutLivraison}" pour une commande.`;
          type = 'warning';
          link = `/livreur/commandes`;
          break;
        case 'assignation_annulee':
          title = '❌ Assignation annulée';
          message = `L'assignation d'une commande a été annulée.`;
          type = 'error';
          link = `/livreur/commandes`;
          break;
        default:
          title = '🔄 Mise à jour';
          message = `Une modification a été effectuée sur une commande.`;
          type = 'info';
      }

      if (title) {
        addNotification({ type, title, message, link, data });
      }
    };

    socket.on('commande_updated', handleCommandeUpdate);

    return () => {
      socket.off('commande_updated', handleCommandeUpdate);
    };
  }, [addNotification]);
};