import Order from '../models/Order.js';
import MenuItem from '../models/MenuItem.js';

/**
 * Crea un nuevo pedido
 */
export const createOrder = async (req, res, next) => {
  try {
    const { items, total } = req.body;
    const user_id = req.userId;

    // Validaciones básicas
    if (!items || !Array.isArray(items) || items.length === 0 || !total) {
      return res.status(400).json({ 
        success: false,
        error: 'Items y total son requeridos' 
      });
    }

    // Verificar items y calcular total
    let calculatedTotal = 0;
    const verifiedItems = [];

    for (const item of items) {
      const menuItem = await MenuItem.getById(item.menuItemId);
      if (!menuItem) {
        return res.status(400).json({ 
          success: false,
          error: `Ítem del menú con ID ${item.menuItemId} no encontrado` 
        });
      }

      calculatedTotal += menuItem.price * item.quantity;
      verifiedItems.push({
        menu_item_id: menuItem.id,
        name: item.name,
        quantity: item.quantity,
        price: menuItem.price
      });
    }

    // Validar total
    if (Math.abs(calculatedTotal - total) > 0.01) {
      return res.status(400).json({ 
        success: false,
        error: `El total no coincide. Esperado: ${calculatedTotal.toFixed(2)}, Recibido: ${total}`
      });
    }

    // Crear pedido
    const newOrder = await Order.create({
      user_id,
      items: verifiedItems,
      total: calculatedTotal
    });

    res.status(201).json({
      success: true,
      data: newOrder
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtiene todos los pedidos (admin)
 */
export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.getAll();
    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtiene un pedido por ID
 */
export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.getById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ 
        success: false,
        error: 'Pedido no encontrado' 
      });
    }

    // Solo admin o el dueño pueden ver el pedido
    if (req.userRole !== 'admin' && order.user_id !== req.userId) {
      return res.status(403).json({ 
        success: false,
        error: 'No autorizado' 
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtiene pedidos del usuario actual
 */
export const getUserOrders = async (req, res, next) => {
  try {
    const orders = await Order.getByUserId(req.userId);
    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Actualiza el estado de un pedido (admin)
 */
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const validStatuses = ['pending', 'processing', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        success: false,
        error: 'Estado no válido' 
      });
    }

    const updatedOrder = await Order.updateStatus(id, status);
    
    if (!updatedOrder) {
      return res.status(404).json({ 
        success: false,
        error: 'Pedido no encontrado' 
      });
    }

    res.status(200).json({
      success: true,
      data: updatedOrder
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Elimina un pedido (admin)
 */
export const deleteOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedOrder = await Order.delete(id);
    
    if (!deletedOrder) {
      return res.status(404).json({ 
        success: false,
        error: 'Pedido no encontrado' 
      });
    }

    res.status(200).json({
      success: true,
      data: { id: deletedOrder.id }
    });
  } catch (error) {
    next(error);
  }
};