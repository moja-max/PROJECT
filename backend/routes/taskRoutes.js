import express from 'express';
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  completeTask,
  deleteTask,
  getTaskStats,
} from '../controllers/taskController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getTasks);
router.get('/stats', getTaskStats);
router.post('/', authenticate, authorize(['admin', 'officer']), createTask);
router.get('/:id', getTaskById);
router.put('/:id', authenticate, authorize(['admin', 'officer']), updateTask);
router.patch('/:id/complete', authenticate, authorize(['admin', 'officer']), completeTask);
router.delete('/:id', authenticate, authorize(['admin']), deleteTask);

export default router;
