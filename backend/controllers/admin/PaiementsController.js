import Paiement from '../../models/paiements.js';

// Récupérer tous les paiements (avec filtres optionnels)
export async function getAllPaiements(req, res) {
    try {
        const { statut, mode_paiement, date_debut, date_fin } = req.query;
        const filters = {};
        if (statut) filters.statut = statut;
        if (mode_paiement) filters.mode_paiement = mode_paiement;
        if (date_debut) filters.date_debut = date_debut;
        if (date_fin) filters.date_fin = date_fin;
        
        const paiements = await Paiement.findAll(filters);
        res.json(paiements);
    } catch (error) {
        console.error('❌ Erreur getAllPaiements:', error);
        res.status(500).json({ error: error.message });
    }
}

// Récupérer un paiement par son public_id
export async function getPaiementById(req, res) {
    try {
        const { publicId } = req.params;
        const paiement = await Paiement.findByPublicId(publicId);
        if (!paiement) {
            return res.status(404).json({ error: 'Paiement non trouvé' });
        }
        res.json(paiement);
    } catch (error) {
        console.error('❌ Erreur getPaiementById:', error);
        res.status(500).json({ error: error.message });
    }
}

// Récupérer tous les paiements d'une commande
export async function getPaiementsByCommande(req, res) {
    try {
        const { commandeId } = req.params;
        const paiements = await Paiement.findByCommandeId(commandeId);
        res.json(paiements);
    } catch (error) {
        console.error('❌ Erreur getPaiementsByCommande:', error);
        res.status(500).json({ error: error.message });
    }
}

// Créer un nouveau paiement
export async function createPaiement(req, res) {
    try {
        const { commande_id, montant, mode_paiement, note } = req.body;
        
        if (!commande_id || !montant || !mode_paiement) {
            return res.status(400).json({ error: 'commande_id, montant et mode_paiement sont requis' });
        }
        
        const paiement = new Paiement({
            commande_id,
            montant,
            mode_paiement,
            note: note || null
        });
        
        await paiement.creer();
        res.status(201).json(paiement);
    } catch (error) {
        console.error('❌ Erreur createPaiement:', error);
        res.status(500).json({ error: error.message });
    }
}

// Mettre à jour le statut d'un paiement
export async function updatePaiementStatut(req, res) {
    try {
        const { publicId } = req.params;
        const { statut } = req.body;
        
        if (!statut) {
            return res.status(400).json({ error: 'Le statut est requis' });
        }
        
        const paiement = await Paiement.findByPublicId(publicId);
        if (!paiement) {
            return res.status(404).json({ error: 'Paiement non trouvé' });
        }
        
        await paiement.updateStatut(statut);
        res.json(paiement);
    } catch (error) {
        console.error('❌ Erreur updatePaiementStatut:', error);
        res.status(500).json({ error: error.message });
    }
}

// Mettre à jour la note d'un paiement
export async function updatePaiementNote(req, res) {
    try {
        const { publicId } = req.params;
        const { note } = req.body;
        
        const paiement = await Paiement.findByPublicId(publicId);
        if (!paiement) {
            return res.status(404).json({ error: 'Paiement non trouvé' });
        }
        
        await paiement.updateNote(note);
        res.json(paiement);
    } catch (error) {
        console.error('❌ Erreur updatePaiementNote:', error);
        res.status(500).json({ error: error.message });
    }
}

// Supprimer un paiement
export async function deletePaiement(req, res) {
    try {
        const { publicId } = req.params;
        await Paiement.delete(publicId);
        res.json({ message: 'Paiement supprimé avec succès' });
    } catch (error) {
        console.error('❌ Erreur deletePaiement:', error);
        res.status(500).json({ error: error.message });
    }
}

// Récupérer les statistiques globales des paiements
export async function getPaiementsStats(req, res) {
    try {
        const stats = await Paiement.getStats();
        res.json(stats);
    } catch (error) {
        console.error('❌ Erreur getPaiementsStats:', error);
        res.status(500).json({ error: error.message });
    }
}