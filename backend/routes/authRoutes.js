import express from 'express';
import { register, login, getProfile, updateProfile, getUsers, createUser, updateUser, deleteUser } from '../controllers/authController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);
router.get('/users', authenticate, authorize(['admin']), getUsers);
router.post('/users', authenticate, authorize(['admin']), createUser);
router.put('/users/:id', authenticate, authorize(['admin']), updateUser);
router.delete('/users/:id', authenticate, authorize(['admin']), deleteUser);

export default router;
