// scripts/backfillDetails.js
import db from '../config/db.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * Script de rattrapage : ajoute des détails par défaut aux commandes qui n'en ont pas.
 * Utilisation : node scripts/backfillDetails.js
 */

const SERVICE_ID = 4;      // ID du service "Repassage"
const QUANTITE = 3;
const PRIX_UNITAIRE = 2000;
const MONTANT_TOTAL_ATTENDU = 6000; // correspond à 3 * 2000

async function backfillDetails() {
  console.log('🚀 Début du rattrapage des détails manquants...');

  try {
    // 1. Récupérer les commandes sans détails
    const [commandes] = await db.execute(`
      SELECT c.id, c.public_id, c.reference, c.montant_total
      FROM commandes c
      LEFT JOIN details_commandes dc ON dc.commande_id = c.id
      WHERE dc.id IS NULL
        AND c.montant_total = ?
    `, [MONTANT_TOTAL_ATTENDU]);

    if (commandes.length === 0) {
      console.log('✅ Aucune commande à corriger.');
      return;
    }

    console.log(`📋 ${commandes.length} commandes sans détails trouvées :`);
    commandes.forEach(c => console.log(`   - ${c.reference} (${c.public_id}) - ${c.montant_total} FC`));

    // 2. Préparer les insertions
    let inserted = 0;
    for (const cmd of commandes) {
      const publicId = uuidv4();
      await db.execute(
        `INSERT INTO details_commandes 
         (public_id, commande_id, service_id, quantite, prix_unitaire_scelle, details, motif_refus)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [publicId, cmd.id, SERVICE_ID, QUANTITE, PRIX_UNITAIRE, '', null]
      );
      inserted++;
      console.log(`✅ Détails ajoutés pour la commande ${cmd.reference}`);
    }

    console.log(`🎉 ${inserted} commandes corrigées avec succès.`);
  } catch (error) {
    console.error('❌ Erreur lors du rattrapage :', error.message);
    process.exit(1);
  } finally {
    await db.end(); // ferme le pool de connexions
  }
}

backfillDetails();