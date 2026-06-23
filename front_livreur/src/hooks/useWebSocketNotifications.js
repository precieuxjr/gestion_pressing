import { useEffect } from 'react';
import { socket } from '../services/socket';
import { useNotifications } from '../context/NotificationContext';

export const useWebSocketNotifications = () => {
  const { addNotification } = useNotifications();

  useEffect(() => {
    // Récupérer l'utilisateur connecté (livreur)
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const livreurId = user?.public_id || null;

    const handleCommandeUpdate = (data) => {
      console.log('📢 Événement reçu (livreur) :', data);

      // Filtrer : ne garder que les événements concernant ce livreur
      // On suppose que data.livreurId ou data.userId correspond au livreur
      // Dans vos événements, vous avez userId (le client) et livreurId (pour assignation)
      // On vérifie si l'événement concerne ce livreur
      if (livreurId) {
        // Si l'événement a un livreurId et qu'il ne correspond pas, on ignore
        if (data.livreurId && data.livreurId !== livreurId) {
          console.log('⏩ Notification ignorée (pas pour ce livreur)');
          return;
        }
        // Si l'événement a un userId et que c'est le livreur (cas où livreurId est aussi userId ?), on garde
        // En pratique, on peut aussi filtrer sur data.type pour ne garder que ce qui concerne le livreur
        // On garde tout sauf si explicitement un autre livreur
        // Pour l'instant, on garde tout, mais on pourrait ajouter plus de filtres
      }

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
        // Ajouter d'autres cas pertinents pour le livreur
        default:
          title = '🔄 Mise à jour';
          message = `Une modification a été effectuée sur une commande.`;
          type = 'info';
      }

      // Ne pas ajouter de notification si titre vide (pour éviter les notifications vides)
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