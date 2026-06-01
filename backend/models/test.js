import db from '../config/db.js';
import { v4 as uuidv4 } from 'uuid';

async function seedCommandes() {
    try {
        // Récupérer des clients existants (au moins un)
        const [clients] = await db.execute('SELECT id FROM users WHERE role = "client" LIMIT 20');
        if (clients.length === 0) throw new Error('Aucun client trouvé');

        let inserted = 0;
        
        // Valeurs valides pour l'ENUM
        const statuts = ['En attente', 'Payée', 'Livrée', 'Annulée'];
        
        for (let i = 0; i < 20; i++) {
            const userId = clients[i % clients.length].id;
            const publicId = uuidv4();
            const reference = `CMD-${Date.now()}-${i+1}`;
            
            // Date de dépôt aléatoire (0-30 jours dans le passé)
            const depositDate = new Date();
            depositDate.setDate(depositDate.getDate() - Math.floor(Math.random() * 30));
            
            // Date de livraison prévue (2-9 jours après dépôt)
            const expectedDate = new Date(depositDate);
            expectedDate.setDate(expectedDate.getDate() + Math.floor(Math.random() * 7) + 2);
            
            // Statut aléatoire
            const statut = statuts[Math.floor(Math.random() * statuts.length)];
            
            // Montant aléatoire entre 5000 et 50000
            const montant = Math.floor(Math.random() * 45000) + 5000;
            
            await db.execute(
                `INSERT INTO commandes 
                 (public_id, user_id, reference, montant_total, statut, adresse_collecte, adresse_livraison, created_at, date_livraison)
                 VALUES (?, ?, ?, ?, ?, 'Adresse collecte par défaut', 'Adresse livraison par défaut', ?, ?)`,
                [publicId, userId, reference, montant, statut, depositDate, expectedDate]
            );
            inserted++;
            console.log(`✅ Commande ${inserted}/20 créée : ${reference} (${statut})`);
        }
        
        console.log(`\n🎉 ${inserted} commandes créées avec succès.`);
        process.exit(0);
    } catch (err) {
        console.error('❌ Erreur :', err.message);
        process.exit(1);
    }
}

seedCommandes();