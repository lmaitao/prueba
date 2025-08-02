import Order from '../src/models/Order.js';
import MenuItem from '../src/models/MenuItem.js';
import User from '../src/models/User.js';

class OrderService {
  async createOrder(userId, orderData) {
    const { items, total } = orderData;

    // Validaciones básicas
    if (!items || items.length === 0 || !total) {
      throw { status: 400, message: 'Items y total son requeridos' };
    }

    // Verificar que los items existan y calcular total real
    let calculatedTotal = 0;
    for (const item of items) {
      const menuItem = await MenuItem.getById(item.menuItemId);
      if (!menuItem) {
        throw { status: 400, message: `Ítem del menú con ID ${item.menuItemId} no encontrado` };
      }
      calculatedTotal += menuItem.price * item.quantity;
    }

    // Comparar total calculado con total proporcionado
    if (Math.abs(calculatedTotal - total) > 0.01) {
      throw { status: 400, message: 'El total no coincide con la suma de los items' };
    }

    // Verificar que el usuario exista
    const user = await User.findById(userId);
    if (!user) {
      throw { status: 404, message: 'Usuario no encontrado' };
    }

    return await Order.create({
      user_id: userId,
      items,
      total
    });
  }

  async getAllOrders() {
    return await Order.getAll();
  }

  async getOrderById(id, userId, userRole) {
    const order = await Order.getById(id);
    if (!order) {
      throw { status: 404, message: 'Pedido no encontrado' };
    }

    // Solo el admin o el usuario dueño del pedido puede verlo
    if (userRole !== 'admin' && order.user_id !== userId) {
      throw { status: 403, message: 'No autorizado' };
    }

    return order;
  }

  async getUserOrders(userId) {
    return await Order.getByUserId(userId);
  }

  async updateOrderStatus(id, status, userRole) {
    if (userRole !== 'admin') {
      throw { status: 403, message: 'Solo los administradores pueden actualizar el estado' };
    }

    const validStatuses = ['pending', 'processing', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      throw { status: 400, message: 'Estado no válido' };
    }

    const order = await Order.getById(id);
    if (!order) {
      throw { status: 404, message: 'Pedido no encontrado' };
    }

    return await Order.updateStatus(id, status);
  }

  async deleteOrder(id, userRole) {
    if (userRole !== 'admin') {
      throw { status: 403, message: 'Solo los administradores pueden eliminar pedidos' };
    }

    const order = await Order.getById(id);
    if (!order) {
      throw { status: 404, message: 'Pedido no encontrado' };
    }

    const result = await Order.delete(id);
    if (!result) {
      throw { status: 500, message: 'Error al eliminar el pedido' };
    }

    return { message: 'Pedido eliminado exitosamente' };
  }
}

export default new OrderService();