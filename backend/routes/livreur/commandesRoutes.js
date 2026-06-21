import express from 'express';
import { verifierToken, verifierRole } from '../../middlewares/livreurMiddleware.js';
import { getMesCommandes, marquerCommandePayee } from '../../controllers/livreur/commandeController.js';

const router = express.Router();

// Appliquer les middlewares à toutes les routes de ce fichier
router.use(verifierToken);
router.use(verifierRole('livreur'));

// Routes protégées
router.get('/commandes', getMesCommandes);
router.post('/commandes/:id/accepter', marquerCommandePayee);

export default router;