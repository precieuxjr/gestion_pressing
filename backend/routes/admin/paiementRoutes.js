import express from 'express';
import { verifyToken } from '../../middlewares/auth.js';
import { adminMiddleware } from '../../middlewares/adminMiddleware.js';
import {
    getAllPaiements,
    getPaiementById,
    getPaiementsByCommande,
    createPaiement,
    updatePaiementStatut,
    updatePaiementNote,
    deletePaiement,
    getPaiementsStats
} from '../../controllers/admin/PaiementsController.js';

const router = express.Router();

router.use(verifyToken, adminMiddleware);

router.get('/', getAllPaiements);
router.get('/stats', getPaiementsStats);
router.get('/commande/:commandeId', getPaiementsByCommande);
router.get('/:publicId', getPaiementById);
router.post('/', createPaiement);
router.patch('/:publicId/statut', updatePaiementStatut);
router.patch('/:publicId/note', updatePaiementNote);
router.delete('/:publicId', deletePaiement);

export default router;