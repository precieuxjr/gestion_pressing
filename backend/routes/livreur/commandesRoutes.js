// routes/livreur/commandesRoutes.js
import express from 'express';
import { verifylivreur } from '../../middlewares/livreurMiddleware.js';
import {verifyToken} from '../../middlewares/auth.js'
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
router.use(verifyToken);
router.use(verifylivreur);

// Routes protégées
router.get('/commandes', getMesCommandes);
router.get('/commandes/disponibles', getCommandesDisponibles);
router.post('/commandes/:id/accepter', accepterCommande);
router.put('/commandes/:publicId/statut-livraison', updateStatutLivraison);
router.put('/commandes/:id/payer', marquerCommandePayee);
router.get('/commandes/:id', getCommandeDetails);
router.get('/statistiques', getMesStatistiques);

export default router;