import Commande from '../../models/commandes.js';
import User from '../../models/users.js';

// Récupérer les commandes avec filtre dynamique sur le statut
export async function getCommandesLivraison(req, res) {
    try {
        const { statut } = req.query; // ex: ?statut=Prêt
        const commandes = await Commande.findAllWithLivraisonInfo(statut);
        res.json(commandes);
    } catch (error) {
        console.error('❌ Erreur getCommandesLivraison:', error);
        res.status(500).json({ error: error.message });
    }
}

// Récupérer les livreurs disponibles
export async function getLivreursDisponibles(req, res) {
    try {
        const livreurs = await User.findAvailableLivreurs();
        res.json(livreurs);
    } catch (error) {
        console.error('❌ Erreur getLivreursDisponibles:', error);
        res.status(500).json({ error: error.message });
    }
}

// Récupérer tous les livreurs (admin)
export async function getAllLivreurs(req, res) {
    try {
        const livreurs = await User.findAllLivreurs();
        res.json(livreurs);
    } catch (error) {
        console.error('❌ Erreur getAllLivreurs:', error);
        res.status(500).json({ error: error.message });
    }
}
export async function assignerLivreur(req, res) {
    try {
      const { publicId } = req.params;
      const { livreur_id } = req.body;
  
      if (!livreur_id) {
        return res.status(400).json({ error: 'livreur_id requis' });
      }
  
      const commande = await Commande.findByPublicId(publicId);
      if (!commande) {
        return res.status(404).json({ error: 'Commande introuvable' });
      }
  
      // ✅ Autoriser l'assignation uniquement si la commande est 'Payée' ou 'Prêt'
      if (!['Payée', 'Prêt'].includes(commande.statut)) {
        return res.status(400).json({ 
          error: 'La commande doit être payée ou prête pour être assignée à un livreur' 
        });
      }
  
      // Récupérer le livreur
      const livreur = await User.findById(livreur_id);
      if (!livreur) {
        return res.status(404).json({ error: 'Livreur non trouvé' });
      }
  
      // Vérifier la limite de 5 commandes actives
      const activeCount = await Commande.countActiveForLivreur(livreur.public_id, true);
      if (activeCount >= 5) {
        return res.status(400).json({ 
          error: 'Ce livreur a déjà 5 commandes en cours. Maximum atteint.' 
        });
      }
  
      // Mettre à jour la disponibilité du livreur
      if (livreur.disponibilite !== 'En livraison') {
        await User.updateDisponibilite(livreur.public_id, 'En livraison');
      }
  
      // Assigner la commande
      await commande.assignerLivreur(livreur.public_id);
  
      // Si on atteint 5, passer en 'Indisponible'
      const newCount = await Commande.countActiveForLivreur(livreur.public_id, true);
      if (newCount === 5) {
        await User.updateDisponibilite(livreur.public_id, 'Indisponible');
      }
  
      const updated = await Commande.findByIdWithLivraison(publicId);
      res.json(updated);
    } catch (error) {
      console.error('❌ Erreur assignerLivreur:', error);
      res.status(500).json({ error: error.message });
    }
  }
// Mettre à jour le statut de livraison
export async function updateStatutLivraison(req, res) {
    try {
      const { publicId } = req.params;
      const { statut_livraison } = req.body;
  
      if (!statut_livraison) {
        return res.status(400).json({ error: 'statut_livraison requis' });
      }
  
      const commande = await Commande.findByPublicId(publicId);
      if (!commande) {
        return res.status(404).json({ error: 'Commande introuvable' });
      }
  
      // Mettre à jour le statut de livraison
      await commande.updateStatutLivraison(statut_livraison);
  
      // ✅ Si la commande est terminée (Livrée ou Annulée), libérer le livreur si nécessaire
      if (statut_livraison === 'Livrée' || statut_livraison === 'Annulée') {
        if (commande.livreur_id) {
          // Récupérer le public_id du livreur à partir de son ID numérique
          const livreur = await User.findById(commande.livreur_id);
          if (livreur) {
            // Compter les commandes encore actives
            const activeCount = await Commande.countActiveForLivreur(livreur.public_id, true);
            if (activeCount === 0) {
              // Plus aucune commande active → disponible
              await User.updateDisponibilite(livreur.public_id, 'Disponible');
            } else if (activeCount < 5) {
              // Moins de 5 → en livraison (s'il n'est pas déjà en disponibilité)
              const current = await User.findById(livreur.public_id);
              if (current && current.disponibilite === 'Indisponible') {
                await User.updateDisponibilite(livreur.public_id, 'En livraison');
              }
            }
          }
        }
      }
  
      const updated = await Commande.findByIdWithLivraison(publicId);
      res.json(updated);
    } catch (error) {
      console.error('❌ Erreur updateStatutLivraison:', error);
      res.status(500).json({ error: error.message });
    }
  }
// controllers/admin/LivraisonController.js
export async function annulerAssignation(req, res) {
    try {
      const { publicId } = req.params;
  
      const commande = await Commande.findByPublicId(publicId);
      if (!commande) {
        return res.status(404).json({ error: 'Commande introuvable' });
      }
  
      if (!commande.livreur_id) {
        return res.status(400).json({ error: 'Cette commande n\'est pas assignée à un livreur' });
      }
  
      // Désassigner la commande (retourne le public_id du livreur)
      const livreurPublicId = await commande.desassigner();
  
      // Récupérer le livreur par son public_id
      const livreur = await User.findById(livreurPublicId);
      if (!livreur) {
        console.warn(`⚠️ Livreur ${livreurPublicId} introuvable après désassignation`);
        const updated = await Commande.findByIdWithLivraison(publicId);
        return res.json(updated);
      }
  
      // Compter les commandes actives du livreur (avec son public_id)
      const activeCount = await Commande.countActiveForLivreur(livreur.public_id, true);
  
      // Mettre à jour la disponibilité
      if (activeCount === 0) {
        await User.updateDisponibilite(livreur.public_id, 'Disponible');
      } else if (activeCount < 5) {
        await User.updateDisponibilite(livreur.public_id, 'En livraison');
      } else {
        await User.updateDisponibilite(livreur.public_id, 'Indisponible');
      }
  
      const updated = await Commande.findByIdWithLivraison(publicId);
      res.json(updated);
    } catch (error) {
      console.error('❌ Erreur annulerAssignation:', error);
      res.status(500).json({ error: error.message });
    }
  }
  