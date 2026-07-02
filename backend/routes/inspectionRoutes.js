import express from 'express';
import {
  submitInspection,
  getInspectionsByBuilding,
  getInspectionById,
  getAllInspections,
} from '../controllers/inspectionController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllInspections);
router.post('/', authenticate, authorize(['admin', 'inspector']), submitInspection);
router.get('/building/:buildingId', getInspectionsByBuilding);
router.get('/:id', getInspectionById);

export default router;
