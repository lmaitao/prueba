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
import { cacheMiddleware } from '../middlewares/cache.js';

const router = Router();

// Public routes
router.get('/', cacheMiddleware(3600), getAllMenuItems);
router.get('/category/:category', async (req, res) => {
  try {
    await getMenuItemsByCategory(req, res);
  } catch (error) {
    console.error('Route handler error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error interno del servidor'
    });
  }
});
router.get('/:id', cacheMiddleware(3600), getMenuItemById);

// Admin routes
router.post('/', authenticate, authorize(['admin']), createMenuItem);
router.put('/:id', authenticate, authorize(['admin']), updateMenuItem);
router.delete('/:id', authenticate, authorize(['admin']), deleteMenuItem);

export default router;