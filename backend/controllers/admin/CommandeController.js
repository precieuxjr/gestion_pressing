import Commande from '../../models/commandes.js';
import DetailsCommande from '../../models/details_commande.js';
import User from '../../models/users.js';

export async function getAllCommandes(req, res) {
    try {
        const commandes = await Commande.findAllWithClientInfo();
        res.json(commandes);
    } catch (error) {
        console.error("Erreur SQL :", error);
        res.status(500).json({ error: error.message });
    }
}

export async function getCommandeDetails(req, res) {
    try {
        const { publicId } = req.params;
        const commande = await Commande.findByPublicId(publicId);
        if (!commande) return res.status(404).json({ error: 'Commande introuvable' });

        const details = await commande.getDetails();
        const client = await User.findByPublicId(commande.user_public_id);
        const commandeData = commande.toJSON();
        commandeData.client = client ? `${client.prenom} ${client.nom}` : 'Client inconnu';
        commandeData.phone = client?.telephone || null;
        commandeData.depositDate = commande.created_at;
        commandeData.expectedDate = commande.date_livraison;
        commandeData.amount = commande.montant_total;
        commandeData.status = commande.statut;
        commandeData.services = details.map(d => d.toJSON());

        res.json(commandeData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function updateCommandeStatus(req, res) {
    try {
        const { publicId } = req.params;
        const { status } = req.body;
        const commande = await Commande.findByPublicId(publicId);
        if (!commande) return res.status(404).json({ error: 'Commande introuvable' });

        const statutMap = {
            'En cours': 'En cours',
            'Prête à retirer': 'Payée',
            'Livrée': 'Livrée',
            'Annulée': 'Annulée'
        };
        const nouveauStatut = statutMap[status] || status;
        const statutsValides = ['En attente', 'Payée', 'En cours', 'Livrée', 'Annulée'];
        if (!statutsValides.includes(nouveauStatut)) {
            return res.status(400).json({ error: 'Statut invalide' });
        }
        await commande.updateStatut(nouveauStatut);
        res.json({ message: 'Statut mis à jour', commande: commande.toJSON() });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function updateCommandeDates(req, res) {
    try {
        const { publicId } = req.params;
        const { date_collecte, date_livraison } = req.body;
        const commande = await Commande.findByPublicId(publicId);
        if (!commande) return res.status(404).json({ error: 'Commande introuvable' });
        if (date_collecte) await commande.updateDateCollecte(date_collecte);
        if (date_livraison) await commande.updateDateLivraison(date_livraison);
        res.json({ message: 'Dates mises à jour', commande: commande.toJSON() });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function supprimerCommande(req, res) {
    try {
        const { publicId } = req.params;
        const commande = await Commande.findByPublicId(publicId);
        if (!commande) return res.status(404).json({ error: 'Commande introuvable' });
        if (!['En attente', 'Annulée'].includes(commande.statut)) {
            return res.status(400).json({ error: 'Cette commande ne peut pas être supprimée' });
        }
        const deleted = await Commande.deleteByPublicId(publicId);
        if (!deleted) return res.status(404).json({ error: 'Commande introuvable' });
        res.json({ message: 'Commande supprimée avec succès' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function getCommandesStats(req, res) {
    try {
        const stats = await Commande.getStats();
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
