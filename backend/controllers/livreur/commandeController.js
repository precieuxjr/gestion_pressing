import Commande from '../../models/commandes.js';

// ========================================
// 1. Récupérer les commandes du livreur connecté
// ========================================
export const getMesCommandes = async (req, res) => {
  try {
    console.log('req.user:', req.user); // doit afficher { id, email, role, ... }
    const livreurId = req.user.public_id;

    // Vérification de sécurité
    if (!livreurId) {
      return res.status(401).json({
        success: false,
        message: 'Utilisateur non authentifié'
      });}
    const rows = await Commande.findByLivreurId(livreurId);
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ========================================
// 2. Récupérer les commandes disponibles (statut 'En attente')
// ========================================
export const getCommandesDisponibles = async (req, res) => {
  try {
    const livreurId = req.user.id;
    const rows = await Commande.findDisponiblesPourLivreur(livreurId);
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ========================================
// 3. Accepter une commande (s'assigner)
// ========================================
export const accepterCommande = async (req, res) => {
  try {
    const { id } = req.params; // public_id
    const livreurId = req.user.id;

    const commande = await Commande.findByPublicId(id);
    if (!commande) {
      return res.status(404).json({ success: false, message: 'Commande introuvable' });
    }
    if (commande.livreur_id) {
      return res.status(400).json({ success: false, message: 'Cette commande est déjà assignée' });
    }

    await commande.assignerLivreur(livreurId);
    res.json({
      success: true,
      message: 'Commande acceptée avec succès',
      data: commande.toJSON()
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ========================================
// 4. Mettre à jour le statut de livraison
// ========================================
export const updateStatutLivraison = async (req, res) => {
  try {
    const { id } = req.params;
    const { statut_livraison } = req.body;
    const livreurId = req.user.id;

    const commande = await Commande.findByPublicId(id);
    if (!commande) {
      return res.status(404).json({ success: false, message: 'Commande introuvable' });
    }
    if (commande.livreur_id !== livreurId) {
      return res.status(403).json({ success: false, message: 'Vous n\'êtes pas assigné à cette commande' });
    }

    await commande.updateStatutLivraison(statut_livraison);
    if (statut_livraison === 'Livrée') {
      await commande.marquerLivree();
    }

    res.json({
      success: true,
      message: 'Statut de livraison mis à jour',
      data: commande.toJSON()
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ========================================
// 5. Récupérer les statistiques du livreur
// ========================================
export const getMesStatistiques = async (req, res) => {
  try {
    const livreurId = req.user.id;
    // Utilisation de la méthode statique du modèle
    const stats = await Commande.getStatsForLivreur(livreurId);
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ========================================
// 6. Détails d'une commande spécifique (pour le livreur)
// ========================================
export const getCommandeDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const livreurId = req.user.id;

    const commande = await Commande.findByIdWithLivraison(id);
    if (!commande) {
      return res.status(404).json({ success: false, message: 'Commande introuvable' });
    }
    if (commande.livreur_id !== livreurId) {
      return res.status(403).json({ success: false, message: 'Accès non autorisé' });
    }

    const details = await commande.getDetails();
    res.json({
      success: true,
      data: {
        commande: commande.toJSON(),
        details
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ========================================
// 7. Marquer une commande comme payée
// ========================================
export const marquerCommandePayee = async (req, res) => {
  try {
    const { id } = req.params;
    const livreurId = req.user.id;

    const commande = await Commande.findByPublicId(id);
    if (!commande) {
      return res.status(404).json({ success: false, message: 'Commande introuvable' });
    }
    if (commande.livreur_id !== livreurId) {
      return res.status(403).json({ success: false, message: 'Vous n\'êtes pas assigné à cette commande' });
    }
    if (commande.statut !== 'En attente') {
      return res.status(400).json({ success: false, message: 'Cette commande ne peut pas être payée (statut actuel : ' + commande.statut + ')' });
    }

    await commande.marquerPayee();
    res.json({
      success: true,
      message: 'Commande marquée comme payée',
      data: commande.toJSON()
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};