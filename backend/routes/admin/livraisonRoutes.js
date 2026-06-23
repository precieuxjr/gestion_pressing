// routes/admin/livraisonRoutes.js
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

// Routes des commandes de livraison
router.get('/commandes', getCommandesLivraison);

// Routes des livreurs
router.get('/livreurs/disponibles', getLivreursDisponibles);
router.get('/livreurs', getAllLivreurs);

// Routes d'assignation
router.patch('/commandes/:publicId/assigner', assignerLivreur);
router.patch('/commandes/:publicId/statut', updateStatutLivraison);
router.delete('/commandes/:publicId/assignation', annulerAssignation);

export default router;