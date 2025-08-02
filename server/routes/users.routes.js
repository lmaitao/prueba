import { Router } from 'express';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
} from '../src/controllers/users.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';

const router = Router();

// Todas las rutas protegidas y solo para admin
router.use(authenticate, authorize(['admin']));

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;