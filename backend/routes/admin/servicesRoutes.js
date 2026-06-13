import express from 'express';
import { verifyToken } from '../../middlewares/auth.js';
import { adminMiddleware } from '../../middlewares/adminMiddleware.js';
import {
    getAllServices,
    getServiceById,
    createService,
    updateService,
    deleteService,
    getServicesWithStats,
    seedDefaultServices
} from '../../controllers/admin/ServicesController.js';

const router = express.Router();

router.use(verifyToken, adminMiddleware); // Protection admin

router.get('/', getAllServices);
router.get('/stats', getServicesWithStats);
router.get('/:publicId', getServiceById);
router.post('/', createService);
router.put('/:publicId', updateService);
router.delete('/:publicId', deleteService);
router.post('/seed', seedDefaultServices); // optionnel

export default router;