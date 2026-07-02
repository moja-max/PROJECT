import express from 'express';
import {
  getAllBuildings,
  getBuildingById,
  createBuilding,
  updateBuilding,
  deleteBuilding,
  getBuildingStats,
} from '../controllers/buildingController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllBuildings);
router.get('/stats', getBuildingStats);
router.get('/:id', getBuildingById);
router.post('/', authenticate, authorize(['admin', 'inspector']), createBuilding);
router.put('/:id', authenticate, authorize(['admin', 'inspector']), updateBuilding);
router.delete('/:id', authenticate, authorize(['admin']), deleteBuilding);

export default router;
