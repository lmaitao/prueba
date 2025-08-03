import { Router } from 'express';
import { 
  register, 
  login, 
  logout, 
  getCurrentUser,
  updateProfile 
} from '../src/controllers/auth.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { uploadAvatar } from '../middlewares/upload.js';

const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Authenticated routes
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, getCurrentUser);
router.put('/profile', authenticate, uploadAvatar, updateProfile);

export default router;