// routes/livreur/commandesRoutes.js
import express from 'express';
import { verifierToken, verifierRole } from '../../middlewares/livreurMiddleware.js';
import {
  getMesCommandes,
  getCommandesDisponibles,
  accepterCommande,
  updateStatutLivraison,
  getMesStatistiques,
  getCommandeDetails,
  marquerCommandePayee
} from '../../controllers/livreur/commandeController.js';

const router = express.Router();

// Appliquer les middlewares à toutes les routes de ce fichier
router.use(verifierToken);
router.use(verifierRole('livreur'));

// Routes protégées
router.get('/commandes', getMesCommandes);
router.get('/commandes/disponibles', getCommandesDisponibles);
router.post('/commandes/:id/accepter', accepterCommande);
router.put('/commandes/:id/statut-livraison', updateStatutLivraison);
router.put('/commandes/:id/payer', marquerCommandePayee);
router.get('/commandes/:id', getCommandeDetails);
router.get('/statistiques', getMesStatistiques);

export default router;