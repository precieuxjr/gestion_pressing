// routes/client/clientRoutes.js
import express from 'express';

import {
    creerCommande,
    getMesCommandes,
    getCommandeDetails,
    annulerCommande,
    modifierAdresseLivraison,
    getStats
} from '../../controllers/client/CommandeController.js';
import { verifyToken } from '../../middlewares/auth.js';
import{clientMiddleware} from '../../middlewares/clientMiddleware.js'
import { getMesPaiements, getMonPaiement } from '../../controllers/client/paiements.js';

const router = express.Router();

// Toutes les routes nécessitent authentification
router.use(verifyToken);       // 1. décode le token
router.use(clientMiddleware);  // 2. vérifie le rôle

router.get('/paiements', getMesPaiements);
router.get('/paiements/:publicId', getMonPaiement);
router.post('/commandes', creerCommande);
router.get('/commandes', getMesCommandes);
router.get('/commandes/:publicId', getCommandeDetails);
router.put('/commandes/:publicId/annuler', annulerCommande);
router.put('/commandes/:publicId/adresse', modifierAdresseLivraison);
router.get('/stats', getStats); // ← la méthode que vous avez dans le dashboard

export default router;