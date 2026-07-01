import express from 'express';
import { verifyToken } from '../../middlewares/auth.js';
import { adminMiddleware } from '../../middlewares/adminMiddleware.js';
import {
  getUnreadNotifications,
  markAsRead,
  markAllAsRead,
} from '../../controllers/admin/notificationController.js';

const router = express.Router();

router.use(verifyToken);
router.use(adminMiddleware);

router.get('/notifications', getUnreadNotifications);
router.put('/notifications/:id/read', markAsRead);
router.put('/notifications/read-all', markAllAsRead);

export default router;