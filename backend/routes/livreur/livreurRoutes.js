// routes/livreurRoutes.js
import express from 'express';
import { verifyToken } from '../../middlewares/auth.js';
import { verifylivreur } from '../../middlewares/livreurMiddleware.js';
import {
  getProfil,
  updateProfil,
  changePassword,
} from '../../controllers/livreur/livreurController.js';

const router = express.Router();

// Appliquer les middlewares à toutes les routes de ce fichier
router.use(verifyToken);
router.use(verifylivreur);

// Routes
router.get('/profil', getProfil);
router.put('/profil', updateProfil);
router.put('/password', changePassword);

export default router;