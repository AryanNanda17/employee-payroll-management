import express from 'express';
import { getDashboardStats } from '../controllers/DashboardController.js';
import { verifyUser } from '../middleware/AuthUser.js';

const router = express.Router();

router.get('/dashboard/stats', verifyUser, getDashboardStats);

export default router;
