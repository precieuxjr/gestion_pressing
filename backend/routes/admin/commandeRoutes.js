// routes/admin/commandeRoutes.js
import express from 'express';
import { verifyToken } from '../../middlewares/auth.js';
import { adminMiddleware } from '../../middlewares/adminMiddleware.js';
import {
  getAllCommandes,
  getCommandeDetails,
  updateCommandeStatus,
  updateCommandeDates,
  supprimerCommande,
  getCommandesStats,
  getCommandesPayees,
} from '../../controllers/admin/CommandeController.js';

const router = express.Router();

router.use(verifyToken, adminMiddleware);

router.get('/', getAllCommandes);
router.get('/stats', getCommandesStats);
router.get('/payees', getCommandesPayees);
router.get('/:publicId', getCommandeDetails);
router.patch('/:publicId', updateCommandeStatus);
router.put('/:publicId/dates', updateCommandeDates);
router.delete('/:publicId', supprimerCommande);

export default router;