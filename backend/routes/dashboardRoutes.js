import express from 'express';
import { getDashboardStats, getPortfolioTrend } from '../controllers/dashboardController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, getDashboardStats);
router.get('/trend', authenticate, getPortfolioTrend);

export default router;
