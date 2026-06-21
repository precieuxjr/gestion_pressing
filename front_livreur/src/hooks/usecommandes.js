import { useState, useEffect } from 'react';
import { commandeService } from '../services/commandeService';

export const useCommandes = () => {
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCommandes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await commandeService.getMesCommandes();
      setCommandes(data);
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const changerStatut = async (commandeId, action) => {
    try {
      switch (action) {
        case 'accepter':
          await commandeService.accepterCommande(commandeId);
          break;
        case 'livrer':
          await commandeService.updateStatutLivraison(commandeId, 'Livrée');
          break;
        case 'collecter':
          await commandeService.updateStatutLivraison(commandeId, 'Collectée');
          break;
        case 'payer':
          await commandeService.marquerPayee(commandeId);
          break;
        default:
          throw new Error('Action non prise en charge');
      }
      // Recharger la liste
      await fetchCommandes();
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  useEffect(() => {
    fetchCommandes();
  }, []);

  return { commandes, loading, error, fetchCommandes, changerStatut };
};