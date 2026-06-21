import db from '../config/db.js';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

async function seedLivreurs() {
    try {
        const livreurs = [
            { nom: 'Kasongo', prenom: 'Pierre', email: 'pierre.kasongo@livreur.com', telephone: '+243812345675', password: 'password123', adresse: 'Kinshasa, Matete', postnom: 'Kasongo' },
            { nom: 'Mwamba', prenom: 'Claire', email: 'claire.mwamba@livreur.com', telephone: '+243812345676', password: 'password123', adresse: 'Kinshasa, Limete', postnom: 'Mwamba' },
            { nom: 'Kabila', prenom: 'Joseph', email: 'joseph.kabila@livreur.com', telephone: '+243812345677', password: 'password123', adresse: 'Kinshasa, Bandalungwa', postnom: 'Kabila' },
            { nom: 'Sefu', prenom: 'Rachel', email: 'rachel.sefu@livreur.com', telephone: '+243812345678', password: 'password123', adresse: 'Kinshasa, Mont Ngafula', postnom: 'Sefu' },
            { nom: 'Lumumba', prenom: 'Patrice', email: 'patrice.lumumba@livreur.com', telephone: '+243812345679', password: 'password123', adresse: 'Kinshasa, Nsele', postnom: 'Lumumba' }
        ];

        let inserted = 0;
        for (const data of livreurs) {
            // Vérifier si l'email existe déjà
            const [existing] = await db.execute('SELECT id FROM users WHERE email = ?', [data.email]);
            if (existing.length > 0) {
                console.log(`⏭️ Livreur avec email ${data.email} existe déjà.`);
                continue;
            }

            const publicId = uuidv4();
            const hashedPassword = await bcrypt.hash(data.password, 10);

            await db.execute(
                `INSERT INTO users 
                 (public_id, nom, prenom, postnom, email, password, telephone, adresse, role, statut, disponibilite) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'livreur', 'actif', 'Disponible')`,
                [publicId, data.nom, data.prenom, data.postnom, data.email, hashedPassword, data.telephone, data.adresse]
            );
            inserted++;
            console.log(`✅ Livreur ${data.prenom} ${data.nom} ajouté.`);
        }

        console.log(`\n🎉 ${inserted} livreurs ajoutés avec succès.`);
        process.exit(0);
    } catch (err) {
        console.error('❌ Erreur :', err.message);
        console.error(err);
        process.exit(1);
    }
}

seedLivreurs();