import { Router } from 'express';
import { 
  register, 
  login, 
  logout, 
  getCurrentUser 
} from '../src/controllers/auth.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', authenticate, getCurrentUser);

export default router;