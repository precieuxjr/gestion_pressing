import express from 'express';

import login from '../admin/authRoutes';

const router = express.Router();

router.post('/login', login);

export default router;
