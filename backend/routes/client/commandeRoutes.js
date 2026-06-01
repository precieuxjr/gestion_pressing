import express from 'express';
import { authMiddleware } from '../../middlewares/authMiddleware.js';
import {
    creerCommande,
    getMesCommandes,
    getCommandeDetails,
    annulerCommande,
    modifierAdresseLivraison
} from '../../controllers/client/CommandeController.js';

const router = express.Router();

router.use(authMiddleware); // Toutes les routes nécessitent authentification

router.post('/', creerCommande);
router.get('/', getMesCommandes);
router.get('/:publicId', getCommandeDetails);
router.put('/:publicId/annuler', annulerCommande);
router.put('/:publicId/adresse', modifierAdresseLivraison);

export default router;