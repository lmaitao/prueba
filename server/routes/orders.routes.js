import { Router } from 'express';
import { 
  createOrder,
  getAllOrders,
  getOrderById,
  getUserOrders,
  updateOrderStatus,
  deleteOrder
} from '../src/controllers/orders.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';

const router = Router();

// Rutas autenticadas
router.post('/', authenticate, createOrder);
router.get('/user', authenticate, getUserOrders);
router.get('/:id', authenticate, getOrderById);

// Rutas solo para admin
router.get('/', authenticate, authorize(['admin']), getAllOrders);
router.put('/:id/status', authenticate, authorize(['admin']), updateOrderStatus);
router.delete('/:id', authenticate, authorize(['admin']), deleteOrder);

export default router;