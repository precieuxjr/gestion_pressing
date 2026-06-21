import express from 'express';
import { verifyToken } from '../../middlewares/auth.js';
import { adminMiddleware } from '../../middlewares/adminMiddleware.js';
import {
    getCommandesLivraison,
    getLivreursDisponibles,
    getAllLivreurs,
    assignerLivreur,
    annulerAssignation,
    updateStatutLivraison,
    
} from '../../controllers/admin/LivraisonController.js';

const router = express.Router();

router.use(verifyToken, adminMiddleware);

router.get('/commandes', getCommandesLivraison);
router.get('/livreurs/disponibles', getLivreursDisponibles);
router.get('/livreurs', getAllLivreurs);

router.patch('/commandes/:publicId/assigner', assignerLivreur);
router.patch('/commandes/:publicId/statut', updateStatutLivraison);

// Annuler l'assignation d'une commande (admin)
router.delete('/commandes/:publicId/assignation', annulerAssignation);

export default router;