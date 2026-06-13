import db from '../config/db.js';
import DetailsCommande from '../models/details_commande.js';

async function seedDetailsCommandes() {
    try {
        console.log('🔍 Génération des détails de commandes...\n');
        
        // Récupérer toutes les commandes
        const [commandes] = await db.execute('SELECT id, public_id FROM commandes');
        
        if (commandes.length === 0) {
            console.log('📭 Aucune commande trouvée. Créez d\'abord des commandes.');
            process.exit(0);
        }
        
        // Récupérer tous les services
        const [services] = await db.execute('SELECT id, nom, prix FROM services');
        
        if (services.length === 0) {
            console.log('📭 Aucun service trouvé. Initialisez d\'abord les services.');
            process.exit(0);
        }
        
        let detailsAdded = 0;
        
        for (const commande of commandes) {
            // Vérifier si la commande a déjà des détails
            const hasDetails = await DetailsCommande.hasDetails(commande.id);
            
            if (!hasDetails) {
                // Ajouter 1 à 3 services aléatoires par commande
                const nbServices = Math.floor(Math.random() * 3) + 1;
                const shuffledServices = [...services].sort(() => 0.5 - Math.random());
                const selectedServices = shuffledServices.slice(0, nbServices);
                
                let montantTotal = 0;
                
                for (const service of selectedServices) {
                    const quantite = Math.floor(Math.random() * 3) + 1;
                    const prixUnitaire = parseFloat(service.prix);
                    const prixTotal = quantite * prixUnitaire;
                    montantTotal += prixTotal;
                    
                    // Utilisation de la méthode ajouter() au lieu de create()
                    const detail = new DetailsCommande({
                        commande_id: commande.id,
                        service_id: service.id,
                        quantite: quantite,
                        prix_unitaire_scelle: prixUnitaire,
                        details: `${service.nom} - ${quantite} article(s)`
                    });
                    
                    await detail.ajouter();
                    
                    detailsAdded++;
                    console.log(`   ✅ ${service.nom} x${quantite} = ${prixTotal.toLocaleString()} FCFA`);
                }
                
                // Mettre à jour le montant total de la commande
                await db.execute(
                    'UPDATE commandes SET montant_total = ? WHERE id = ?',
                    [montantTotal, commande.id]
                );
                
                console.log(`   📦 Commande ${commande.public_id.substring(0, 8)}... : ${montantTotal.toLocaleString()} FCFA\n`);
            }
        }
        
        console.log(`\n🎉 ${detailsAdded} détails de commande créés !`);
        process.exit(0);
        
    } catch (err) {
        console.error('❌ Erreur :', err.message);
        console.error(err);
        process.exit(1);
    }
}

seedDetailsCommandes();