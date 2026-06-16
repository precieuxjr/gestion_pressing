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

// Assigner un livreur à une commande
export async function assignerLivreur(req, res) {
    console.log('📥 Corps reçu :', req.body);
    console.log('📥 Paramètres :', req.params);
    try {
        const { publicId } = req.params;
        const { livreur_id } = req.body;

        if (!livreur_id) {
            return res.status(400).json({ error: 'livreur_id requis' });
        }

        const commande = await Commande.findByPublicId(publicId);
        console.log('📦 Commande récupérée :', commande);
console.log('📦 Statut exact :', commande?.statut);
console.log('📦 Type du statut :', typeof commande?.statut);
console.log('📦 Longueur :', commande?.statut?.length);
        if (!commande) {
            return res.status(404).json({ error: 'Commande introuvable' });
        }

        // Vérifier que la commande est prête (statut 'Prêt')
        if (commande.statut !== 'Prêt') {
            return res.status(400).json({ error: 'La commande n\'est pas prête à être livrée' });
        }

        const livreur = await User.findById(livreur_id);
        console.log('📦 Disponibilité brute :', livreur.disponibilite);
console.log('📦 Type :', typeof livreur.disponibilite);
console.log('📦 Longueur :', livreur.disponibilite?.length);
        if (!livreur) {
            return res.status(404).json({ error: 'Livreur non trouvé' });
        }
        if (livreur.disponibilite !== 'Disponible') {
            return res.status(400).json({ error: 'Ce livreur n\'est pas disponible' });
        }

        await commande.assignerLivreur(livreur_id);
        await User.updateDisponibilite(livreur_id, 'En livraison');

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

        if (statut_livraison === 'Livrée' || statut_livraison === 'Annulée') {
            if (commande.livreur_id) {
                await User.updateDisponibilite(commande.livreur_id, 'Disponible');
            }
        }

        await commande.updateStatutLivraison(statut_livraison);
        const updated = await Commande.findByIdWithLivraison(publicId);
        res.json(updated);
    } catch (error) {
        console.error('❌ Erreur updateStatutLivraison:', error);
        res.status(500).json({ error: error.message });
    }
}

// Libérer un livreur (manuellement)
export async function libererLivreur(req, res) {
    try {
        const { livreurId } = req.params;
        await User.updateDisponibilite(livreurId, 'Disponible');
        res.json({ message: 'Livreur libéré avec succès' });
    } catch (error) {
        console.error('❌ Erreur libererLivreur:', error);
        res.status(500).json({ error: error.message });
    }
}