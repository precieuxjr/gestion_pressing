import express from 'express';
import { verifyToken } from '../../middlewares/auth.js';
import { adminMiddleware } from '../../middlewares/adminMiddleware.js';
import {
    getAllCommandes,
    getCommandeDetails,
    updateCommandeStatut,
    updateCommandeDates,
    supprimerCommande,
    getCommandesStats
} from '../../controllers/admin/CommandeController.js';

const router = express.Router();

router.use(verifyToken, adminMiddleware); // Authentification + rôle admin

router.get('/', getAllCommandes);
router.get('/stats', getCommandesStats);
router.get('/:publicId', getCommandeDetails);
router.patch('/:publicId', updateCommandeStatut);
router.put('/:publicId/dates', updateCommandeDates);
router.delete('/:publicId', supprimerCommande);

export default router;