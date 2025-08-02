import { Router } from 'express';
import { 
  getAllMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getMenuItemsByCategory
} from '../src/controllers/menu.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { validateMenuItem } from '../utils/validators.js';

const router = Router();

// Públicas
router.get('/', getAllMenuItems);
router.get('/category/:category', getMenuItemsByCategory);
router.get('/:id', getMenuItemById);

// Protegidas (Admin)
router.post(
  '/', 
  authenticate, 
  authorize(['admin']), 
  validateMenuItem, 
  createMenuItem
);

router.put(
  '/:id', 
  authenticate, 
  authorize(['admin']), 
  validateMenuItem, 
  updateMenuItem
);

router.delete(
  '/:id', 
  authenticate, 
  authorize(['admin']), 
  deleteMenuItem
);

export default router;