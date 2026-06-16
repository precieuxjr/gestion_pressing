import express from 'express';
import { verifyToken } from '../../middlewares/auth.js';
import { adminMiddleware } from '../../middlewares/adminMiddleware.js';
import {
    getCommandesLivraison,
    getLivreursDisponibles,
    getAllLivreurs,
    assignerLivreur,
    updateStatutLivraison,
    libererLivreur
} from '../../controllers/admin/LivraisonController.js';

const router = express.Router();

router.use(verifyToken, adminMiddleware);

router.get('/commandes', getCommandesLivraison);
router.get('/livreurs/disponibles', getLivreursDisponibles);
router.get('/livreurs', getAllLivreurs);

router.patch('/commandes/:publicId/assigner', assignerLivreur);
router.patch('/commandes/:publicId/statut', updateStatutLivraison);
router.patch('/livreurs/:livreurId/liberer', libererLivreur);

export default router;