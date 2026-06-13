// backend/models/Service.js
import db from '../config/db.js';
import { v4 as uuidv4 } from 'uuid';

class Service {
    static async findAll() {
        const [rows] = await db.execute(
            'SELECT id, public_id, nom, prix, description, created_at FROM services ORDER BY id'
        );
        return rows;
    }

    static async findByPublicId(publicId) {
        const [rows] = await db.execute(
            'SELECT id, public_id, nom, prix, description FROM services WHERE public_id = ?',
            [publicId]
        );
        return rows[0] || null;
    }

    static async findById(id) {
        const [rows] = await db.execute(
            'SELECT id, public_id, nom, prix, description FROM services WHERE id = ?',
            [id]
        );
        return rows[0] || null;
    }

    static async findByNom(nom) {
        const [rows] = await db.execute(
            'SELECT id, public_id, nom, prix, description FROM services WHERE nom = ?',
            [nom]
        );
        return rows[0] || null;
    }
    static async create(serviceData) {
        const nom = serviceData.nom?.trim();
        const prix = serviceData.prix !== undefined ? parseFloat(serviceData.prix) : null;
        const description = serviceData.description?.trim() || null;
   
        if (!nom || prix === null || isNaN(prix)) {
            throw new Error('Nom et prix valides sont requis');
        }
    
        const publicId = uuidv4();
        const [result] = await db.execute(
            `INSERT INTO services (public_id, nom, prix, description) VALUES (?, ?, ?, ?)`,
            [publicId, nom, prix, description]
        );
        return this.findById(result.insertId);
    }

    static async update(publicId, serviceData) {
        const nom = serviceData.nom?.trim();
        const prix = serviceData.prix !== undefined ? parseFloat(serviceData.prix) : null;
        const description = serviceData.description?.trim() || null;
    
        if (!nom || prix === null || isNaN(prix)) {
            throw new Error('Nom et prix valides sont requis');
        }
    
        await db.execute(
            `UPDATE services SET nom = ?, prix = ?, description = ? WHERE public_id = ?`,
            [nom, prix, description, publicId]
        );
        return this.findByPublicId(publicId);
    }

    static async delete(publicId) {
        const [used] = await db.execute(
            `SELECT COUNT(*) as count FROM details_commandes 
             WHERE service_id = (SELECT id FROM services WHERE public_id = ?)`,
            [publicId]
        );
        
        if (used[0].count > 0) {
            throw new Error(`Ce service est utilisé dans ${used[0].count} commande(s) et ne peut pas être supprimé`);
        }
        
        const [result] = await db.execute(
            'DELETE FROM services WHERE public_id = ?',
            [publicId]
        );
        return result.affectedRows > 0;
    }

    static async findWithStats() {
        const [rows] = await db.execute(`
           SELECT 
    s.id,
    s.public_id,
    s.nom,
    s.prix,
    s.description,
    COUNT(DISTINCT dc.commande_id) AS total_commandes,
    COALESCE(SUM(dc.quantite), 0) AS production_reelle,
    COALESCE(SUM(dc.quantite * dc.prix_unitaire_scelle), 0) AS chiffre_affaires
FROM services s
LEFT JOIN details_commandes dc ON s.id = dc.service_id
GROUP BY s.id
ORDER BY total_commandes DESC;
        `);
        return rows;
    }

    static async seedDefaultServices() {
        const defaultServices = [
            { nom: 'Nettoyage à sec', prix: 5000, description: 'Nettoyage professionnel pour costumes, robes de soirée et textiles délicats avec des produits premium.' },
            { nom: 'Blanchisserie', prix: 3000, description: 'Du linge impeccable, parfaitement lavé, repassé et plié. Service pour particuliers et professionnels.' },
            { nom: 'Retouche & Couture', prix: 4000, description: 'Ajustements, réparations et modifications par des mains expertes. Redonnez vie à vos vêtements.' },
            { nom: 'Repassage', prix: 2000, description: 'Repassage professionnel pour un fini impeccable, sans faux plis.' },
            { nom: 'Livraison', prix: 3500, description: 'Nous récupérons vos vêtements à domicile et vous les retournons propres et emballés dans les meilleurs délais.' },
            { nom: 'Service entreprise', prix: 10000, description: "Entretien d'uniforme, nappe, serviette et linge professionnel." }
        ];

        let inserted = 0;
        let updated = 0;

        for (const service of defaultServices) {
            const existing = await this.findByNom(service.nom);
            
            if (!existing) {
                await this.create(service);
                inserted++;
                console.log(`   ✅ Ajouté : ${service.nom}`);
            } else if (existing.prix !== service.prix) {
                await this.update(existing.public_id, service);
                updated++;
                console.log(`   🔄 Mis à jour : ${service.nom}`);
            }
        }
        
        return { inserted, updated };
    }
}

export default Service;