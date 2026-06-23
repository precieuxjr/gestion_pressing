import Commande from '../../models/commandes.js';
import User from '../../models/users.js';

export const getCommandesPayees = async (req, res) => {
  try {
    const commandes = await Commande.findAllWithLivraisonInfo('Payée');
    res.json(commandes);
  } catch (error) {
    console.error('❌ Erreur getCommandesPayees:', error);
    res.status(500).json({ error: error.message });
  }
};

export async function getCommandesLivraison(req, res) {
  try {
    const { statut } = req.query;
    const commandes = await Commande.findAllWithLivraisonInfo(statut);
    res.json(commandes);
  } catch (error) {
    console.error('❌ Erreur getCommandesLivraison:', error);
    res.status(500).json({ error: error.message });
  }
};

export async function getLivreursDisponibles(req, res) {
  try {
    const livreurs = await User.findAvailableLivreurs();
    res.json(livreurs);
  } catch (error) {
    console.error('❌ Erreur getLivreursDisponibles:', error);
    res.status(500).json({ error: error.message });
  }
};

export async function getAllLivreurs(req, res) {
  try {
    const livreurs = await User.findAllLivreurs();
    res.json(livreurs);
  } catch (error) {
    console.error('❌ Erreur getAllLivreurs:', error);
    res.status(500).json({ error: error.message });
  }
};

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
    if (commande.statut_livraison === 'Livrée') {
      return res.status(400).json({ error: 'Impossible d\'assigner une commande déjà livrée' });
    }

    if (!['Payée', 'Prêt'].includes(commande.statut)) {
      return res.status(400).json({
        error: 'La commande doit être payée ou prête pour être assignée à un livreur'
      });
    }

    const livreur = await User.findByPublicId(livreur_id);
    if (!livreur) {
      return res.status(404).json({ error: 'Livreur non trouvé' });
    }

    const activeCount = await Commande.countActiveForLivreur(livreur.public_id, true);
    if (activeCount >= 5) {
      return res.status(400).json({
        error: 'Ce livreur a déjà 5 commandes en cours. Maximum atteint.'
      });
    }

    if (livreur.disponibilite !== 'En livraison') {
      await User.updateDisponibilite(livreur.public_id, 'En livraison');
    }

    await commande.assignerLivreur(livreur.public_id);

    const newCount = await Commande.countActiveForLivreur(livreur.public_id, true);
    if (newCount === 5) {
      await User.updateDisponibilite(livreur.public_id, 'Indisponible');
    }

    const updated = await Commande.findByIdWithLivraison(publicId);

    const io = req.app.get('io');
    if (io) {
      const client = await User.findById(commande.user_id);
      const clientPublicId = client?.public_id || null;
      const payload = {
        type: 'livreur_assigne',
        commandeId: publicId,
        livreurId: livreur.public_id,
        updatedAt: new Date()
      };
      if (clientPublicId) {
        io.to(`user_${clientPublicId}`).emit('commande_updated', payload);
      }
      io.to(`user_${livreur.public_id}`).emit('commande_updated', payload);
    }

    res.json(updated);
  } catch (error) {
    console.error('❌ Erreur assignerLivreur:', error);
    res.status(500).json({ error: error.message });
  }
};

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

    const livreurActuel = await User.findById(commande.livreur_id);
    const livreurPublicId = livreurActuel?.public_id || null;

    await commande.desassigner();

    if (livreurActuel) {
      const activeCount = await Commande.countActiveForLivreur(livreurActuel.public_id, true);
      if (activeCount === 0) {
        await User.updateDisponibilite(livreurActuel.public_id, 'Disponible');
      } else if (activeCount < 5) {
        await User.updateDisponibilite(livreurActuel.public_id, 'En livraison');
      } else {
        await User.updateDisponibilite(livreurActuel.public_id, 'Indisponible');
      }
    }

    const updated = await Commande.findByIdWithLivraison(publicId);

    const io = req.app.get('io');
    if (io) {
      const client = await User.findById(commande.user_id);
      const clientPublicId = client?.public_id || null;
      const payload = {
        type: 'assignation_annulee',
        commandeId: publicId,
        updatedAt: new Date()
      };
      if (clientPublicId) {
        io.to(`user_${clientPublicId}`).emit('commande_updated', payload);
      }
      if (livreurPublicId) {
        io.to(`user_${livreurPublicId}`).emit('commande_updated', payload);
      }
    }

    res.json(updated);
  } catch (error) {
    console.error('❌ Erreur annulerAssignation:', error);
    res.status(500).json({ error: error.message });
  }
};

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

    await commande.updateStatutLivraison(statut_livraison);

    if (statut_livraison === 'Livrée' || statut_livraison === 'Annulée') {
      if (commande.livreur_id) {
        const livreur = await User.findById(commande.livreur_id);
        if (livreur) {
          const activeCount = await Commande.countActiveForLivreur(livreur.public_id, true);
          if (activeCount === 0) {
            await User.updateDisponibilite(livreur.public_id, 'Disponible');
          } else if (activeCount < 5) {
            const current = await User.findByPublicId(livreur.public_id);
            if (current && current.disponibilite === 'Indisponible') {
              await User.updateDisponibilite(livreur.public_id, 'En livraison');
            }
          }
        }
      }
    }

    const updated = await Commande.findByIdWithLivraison(publicId);

    const io = req.app.get('io');
    if (io) {
      let livreurPublicId = null;
      if (commande.livreur_id) {
        const livreur = await User.findById(commande.livreur_id);
        livreurPublicId = livreur?.public_id || null;
      }
      const client = await User.findById(commande.user_id);
      const clientPublicId = client?.public_id || null;
      const payload = {
        type: 'statut_livraison_change',
        commandeId: publicId,
        newStatutLivraison: statut_livraison,
        updatedAt: new Date()
      };
      if (livreurPublicId) {
        io.to(`user_${livreurPublicId}`).emit('commande_updated', payload);
      }
      if (clientPublicId) {
        io.to(`user_${clientPublicId}`).emit('commande_updated', payload);
      }
    }

    res.json(updated);
  } catch (error) {
    console.error('❌ Erreur updateStatutLivraison:', error);
    res.status(500).json({ error: error.message });
  }
};