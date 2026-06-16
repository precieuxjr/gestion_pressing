import db from '../config/db.js';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

async function seedLivreurs() {
    try {
        const livreurs = [
            { nom: 'Kalonji', prenom: 'Jean', email: 'jean.kalonji@livreur.com', telephone: '+243812345670', password: 'password123', adresse: 'Kinshasa, Gombe', postnom: 'Kalonji' },
            { nom: 'Mbuyi', prenom: 'Marie', email: 'marie.mbuyi@livreur.com', telephone: '+243812345671', password: 'password123', adresse: 'Kinshasa, Lemba', postnom: 'Mbuyi' },
            { nom: 'Tshibola', prenom: 'Paul', email: 'paul.tshibola@livreur.com', telephone: '+243812345672', password: 'password123', adresse: 'Kinshasa, Ngaliema', postnom: 'Tshibola' },
            { nom: 'Lukusa', prenom: 'David', email: 'david.lukusa@livreur.com', telephone: '+243812345673', password: 'password123', adresse: 'Kinshasa, Kinshasa', postnom: 'Lukusa' },
            { nom: 'Ilunga', prenom: 'Grace', email: 'grace.ilunga@livreur.com', telephone: '+243812345674', password: 'password123', adresse: 'Kinshasa, Kalamu', postnom: 'Ilunga' }
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