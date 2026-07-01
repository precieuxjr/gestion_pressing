import Paiement from '../../models/paiements.js';
import Commande from '../../models/commandes.js';
import Notification from '../../models/Notification.js';
import db from '../../config/db.js';
export const getAllPaiements = async (req, res) => {
    try {
      const filters = {
        statut: req.query.statut,
        mode_paiement: req.query.mode_paiement,
        date_debut: req.query.date_debut,
        date_fin: req.query.date_fin,
      };
      const paiements = await Paiement.findAll(filters);
      res.json({ success: true, data: paiements });
    } catch (error) {
      console.error('❌ Erreur getAllPaiements:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  };
  
  // ==========================================
  // ADMIN – Récupérer un paiement par public_id
  // ==========================================
  export const getPaiementById = async (req, res) => {
    try {
      const { publicId } = req.params;
      const paiement = await Paiement.findByPublicId(publicId);
      if (!paiement) {
        return res.status(404).json({ success: false, message: 'Paiement introuvable' });
      }
      res.json({ success: true, data: paiement });
    } catch (error) {
      console.error('❌ Erreur getPaiementById:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  };
  
  // ==========================================
  // ADMIN – Récupérer tous les paiements d'une commande
  // ==========================================
  export const getPaiementsByCommande = async (req, res) => {
    try {
      const { commandeId } = req.params;
      const paiements = await Paiement.findByCommandeId(commandeId);
      res.json({ success: true, data: paiements });
    } catch (error) {
      console.error('❌ Erreur getPaiementsByCommande:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  };
  
  // ==========================================
  // ADMIN – Créer un paiement
  // ==========================================
  export const createPaiement = async (req, res) => {
    try {
      const { commande_public_id, montant, mode_paiement, transaction_id, statut } = req.body;
  
      if (!commande_public_id || !montant || montant <= 0 || !mode_paiement) {
        return res.status(400).json({ error: 'commande_public_id, montant et mode_paiement sont requis' });
      }
  
      const paiement = await Paiement.createForAdmin(
        commande_public_id,
        montant,
        mode_paiement,
        transaction_id,
        statut
      );
  
      res.status(201).json({
        success: true,
        message: 'Paiement créé avec succès',
        data: paiement.toJSON(),
      });
    } catch (error) {
      // ... gestion d'erreur
    }
  };
  
  // ==========================================
  // ADMIN – Mettre à jour le statut d'un paiement
  // ==========================================
  export const updatePaiementStatut = async (req, res) => {
    try {
      const { publicId } = req.params;
      const { statut } = req.body;
      const paiement = await Paiement.findByPublicId(publicId);
      if (!paiement) {
        return res.status(404).json({ success: false, message: 'Paiement introuvable' });
      }
      await paiement.updateStatut(statut);
      res.json({ success: true, message: 'Statut mis à jour', data: paiement.toJSON() });
    } catch (error) {
      console.error('❌ Erreur updatePaiementStatut:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  };
  
  // ==========================================
  // ADMIN – Mettre à jour la note d'un paiement
  // ==========================================
  export const updatePaiementNote = async (req, res) => {
    try {
      const { publicId } = req.params;
      const { note } = req.body;
  
      const paiement = await Paiement.findByPublicId(publicId);
      if (!paiement) {
        return res.status(404).json({ success: false, message: 'Paiement introuvable' });
      }
  
      await paiement.updateNote(note);
      res.json({ success: true, message: 'Note mise à jour', data: paiement.toJSON() });
    } catch (error) {
      console.error('❌ Erreur updatePaiementNote:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  };
  
  // ==========================================
  // ADMIN – Supprimer un paiement
  // ==========================================
  export const deletePaiement = async (req, res) => {
    try {
      const { publicId } = req.params;
      await Paiement.delete(publicId);
      res.json({ success: true, message: 'Paiement supprimé' });
    } catch (error) {
      console.error('❌ Erreur deletePaiement:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  };
  
  // ==========================================
  // ADMIN – Statistiques globales des paiements
  // ==========================================
  export const getPaiementsStats = async (req, res) => {
    try {
      const stats = await Paiement.getStats();
      res.json({ success: true, data: stats });
    } catch (error) {
      console.error('❌ Erreur getPaiementsStats:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  };
  