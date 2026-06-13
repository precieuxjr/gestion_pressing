import Service from '../../models/services.js'; // Assurez-vous du chemin correct (Service.js avec majuscule)

export async function getAllServices(req, res) {
    try {
        const services = await Service.findAll();
        res.json(services);
    } catch (error) {
        console.error('❌ Erreur getAllServices:', error);
        res.status(500).json({ error: error.message });
    }
}

export async function getServiceById(req, res) {
    try {
        const { publicId } = req.params;
        const service = await Service.findByPublicId(publicId);
        if (!service) {
            return res.status(404).json({ error: 'Service non trouvé' });
        }
        res.json(service);
    } catch (error) {
        console.error('❌ Erreur getServiceById:', error);
        res.status(500).json({ error: error.message });
    }
}

export async function createService(req, res) {
    try {
        const { nom, prix, description } = req.body; // ← utilise 'prix' et non 'prix_base'
        
        if (!nom || prix === undefined || prix === '') {
            return res.status(400).json({ error: 'Le nom et le prix sont requis' });
        }
        
        const existing = await Service.findByNom(nom);
        if (existing) {
            return res.status(409).json({ error: 'Un service avec ce nom existe déjà' });
        }
        
        const service = await Service.create({ nom, prix, description });
        res.status(201).json(service);
    } catch (error) {
        console.error('❌ Erreur createService:', error);
        res.status(500).json({ error: error.message });
    }
}

export async function updateService(req, res) {
    try {
        const { publicId } = req.params;
        const { nom, prix, description } = req.body; // ← utilise 'prix'
        
        const existing = await Service.findByPublicId(publicId);
        if (!existing) {
            return res.status(404).json({ error: 'Service non trouvé' });
        }
        
        if (nom && nom !== existing.nom) {
            const duplicate = await Service.findByNom(nom);
            if (duplicate && duplicate.public_id !== publicId) {
                return res.status(409).json({ error: 'Un service avec ce nom existe déjà' });
            }
        }
        
        const updated = await Service.update(publicId, { nom, prix, description });
        res.json(updated);
    } catch (error) {
        console.error('❌ Erreur updateService:', error);
        res.status(500).json({ error: error.message });
    }
}

export async function deleteService(req, res) {
    try {
        const { publicId } = req.params;
        const existing = await Service.findByPublicId(publicId);
        if (!existing) {
            return res.status(404).json({ error: 'Service non trouvé' });
        }
        const deleted = await Service.delete(publicId);
        if (deleted) {
            res.json({ message: 'Service supprimé avec succès' });
        } else {
            res.status(500).json({ error: 'Erreur lors de la suppression' });
        }
    } catch (error) {
        console.error('❌ Erreur deleteService:', error);
        if (error.message.includes('utilisé dans')) {
            return res.status(409).json({ error: error.message });
        }
        res.status(500).json({ error: error.message });
    }
}

export async function getServicesWithStats(req, res) {
    try {
        const stats = await Service.findWithStats();
        res.json(stats);
    } catch (error) {
        console.error('❌ Erreur getServicesWithStats:', error);
        res.status(500).json({ error: error.message });
    }
}

export async function seedDefaultServices(req, res) {
    try {
        const { inserted, updated } = await Service.seedDefaultServices();
        res.json({ 
            message: 'Services initialisés',
            ajoutes: inserted,
            mis_a_jour: updated
        });
    } catch (error) {
        console.error('❌ Erreur seedDefaultServices:', error);
        res.status(500).json({ error: error.message });
    }
}