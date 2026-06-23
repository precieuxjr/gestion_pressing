import Commande from '../../models/commandes.js';
import DetailsCommande from '../../models/details_commande.js';
import User from '../../models/users.js';

export async function getAllCommandes(req, res) {
    try {
        const commandes = await Commande.findAllWithClientInfo();
        res.json(commandes);
    } catch (error) {
        console.error("Erreur SQL :", error);
        res.status(500).json({ error: error.message })
    }
}

export const getCommandeDetails = async (req, res) => {
    try {
        const { publicId } = req.params;
        const commande = await Commande.findByIdWithDetails(publicId);
        console.log('🔍 Commande avec détails :', commande);
        if (!commande) {
            return res.status(404).json({ error: 'Commande introuvable' });
        }
        res.json(commande);
    } catch (error) {
        console.error('❌ Erreur getCommandeDetails:', error);
        res.status(500).json({ error: error.message });
    }
};


export async function updateCommandeStatus(req, res) {
    console.log('📥 Corps reçu :', req.body);
    console.log('📥 Status reçu :', req.body.status);
    try {
        const { publicId } = req.params;
        const { status } = req.body;

        // Vérifier que status est valide
        const statutsValides = ['En attente', 'Payée', 'Annulée', 'Prêt', 'Retirer', 'Livrée'];
        if (!statutsValides.includes(status)) {
            return res.status(400).json({ error: 'Statut invalide' });
        }

        // Récupérer la commande
        const commande = await Commande.findByPublicId(publicId);
        if (!commande) return res.status(404).json({ error: 'Commande introuvable' });

        // ✅ SÉCURITÉ : empêcher la modification si déjà livrée
        if (commande.statut === 'Livrée') {
            return res.status(400).json({ error: 'Impossible de modifier une commande déjà livrée' });
        }

        // Appeler la méthode du modèle
        await commande.updateStatut(status);

        // ✅ Émettre un événement WebSocket ciblé
        const io = req.app.get('io');
        if (io) {
            // Récupérer le client (propriétaire de la commande)
            const client = await User.findById(commande.user_id);
            const clientPublicId = client?.public_id || null;

            // Récupérer le livreur (si assigné)
            let livreurPublicId = null;
            if (commande.livreur_id) {
                const livreur = await User.findById(commande.livreur_id);
                livreurPublicId = livreur?.public_id || null;
            }

            const payload = {
                type: 'status_changed',
                commandeId: publicId,
                newStatus: status,
                updatedAt: new Date()
            };

            // Envoyer au client
            if (clientPublicId) {
                io.to(`user_${clientPublicId}`).emit('commande_updated', payload);
            }

            // Envoyer au livreur (s'il est assigné)
            if (livreurPublicId) {
                io.to(`user_${livreurPublicId}`).emit('commande_updated', payload);
            }
        }

        res.json({ message: 'Statut mis à jour', commande: commande.toJSON() });
    } catch (error) {
        console.error('❌ Erreur updateStatus:', error);
        res.status(500).json({ error: error.message });
    }
}export async function updateCommandeDates(req, res) {
    try {
        const { publicId } = req.params;
        const { date_collecte, date_livraison } = req.body;
        const commande = await Commande.findByPublicId(publicId);
        if (!commande) return res.status(404).json({ error: 'Commande introuvable' });
        if (date_collecte) await commande.updateDateCollecte(date_collecte);
        if (date_livraison) await commande.updateDateLivraison(date_livraison);

        const io = req.app.get('io');
        if (io) {
            // Récupérer le client et le livreur
            const client = await User.findById(commande.user_id);
            const clientPublicId = client?.public_id || null;

            let livreurPublicId = null;
            if (commande.livreur_id) {
                const livreur = await User.findById(commande.livreur_id);
                livreurPublicId = livreur?.public_id || null;
            }

            const payload = {
                type: 'dates_changed',
                commandeId: publicId,
                date_collecte,
                date_livraison,
                updatedAt: new Date()
            };

            if (clientPublicId) io.to(`user_${clientPublicId}`).emit('commande_updated', payload);
            if (livreurPublicId) io.to(`user_${livreurPublicId}`).emit('commande_updated', payload);
        }

        res.json({ message: 'Dates mises à jour', commande: commande.toJSON() });
    } catch (error) {
        console.error('❌ Erreur updateDates:', error);
        res.status(500).json({ error: error.message });
    }

}   export async function supprimerCommande(req, res) {
    try {
        const { publicId } = req.params;
        const commande = await Commande.findByPublicId(publicId);
        if (!commande) return res.status(404).json({ error: 'Commande introuvable' });
        if (!['En attente', 'Annulée'].includes(commande.statut)) {
            return res.status(400).json({ error: 'Cette commande ne peut pas être supprimée' });
        }
        const deleted = await Commande.deleteByPublicId(publicId);
        if (!deleted) return res.status(404).json({ error: 'Commande introuvable' });

        const io = req.app.get('io');
        if (io) {
            const client = await User.findById(commande.user_id);
            const clientPublicId = client?.public_id || null;

            let livreurPublicId = null;
            if (commande.livreur_id) {
                const livreur = await User.findById(commande.livreur_id);
                livreurPublicId = livreur?.public_id || null;
            }

            const payload = {
                type: 'commande_deleted',
                commandeId: publicId,
                updatedAt: new Date()
            };

            if (clientPublicId) io.to(`user_${clientPublicId}`).emit('commande_updated', payload);
            if (livreurPublicId) io.to(`user_${livreurPublicId}`).emit('commande_updated', payload);
        }

        res.json({ message: 'Commande supprimée avec succès' });
    } catch (error) {
        console.error('❌ Erreur suppression:', error);
        res.status(500).json({ error: error.message });
    }
}

export async function getCommandesStats(req, res) {
    try {
        const stats = await Commande.getStats();
        res.json(stats);
    } catch (error) {
        console.error('❌ Erreur stats:', error);
        res.status(500).json({ error: error.message })
    }
}

export const getCommandesPayees = async (req, res) => {
    try {
        const commandes = await Commande.findAllWithLivraisonInfo('Payée');
        res.json(commandes);
    } catch (error) {
        console.error('❌ Erreur getCommandesPayees:', error);
        res.status(500).json({ error: error.message });
    }
};