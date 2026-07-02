import express from 'express';
import {
  getAlerts,
  getAlertById,
  resolveAlert,
  getAlertStats,
  getAlertsByBuilding,
} from '../controllers/alertController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAlerts);
router.get('/stats', getAlertStats);
router.get('/:id', getAlertById);
router.get('/building/:buildingId', getAlertsByBuilding);
router.patch('/:id/resolve', authenticate, authorize(['admin', 'officer']), resolveAlert);

export default router;
