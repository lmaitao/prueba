import MenuItem from '../src/models/MenuItem.js';

class MenuService {
  async getAllMenuItems() {
    return await MenuItem.getAll();
  }

  async getMenuItemById(id) {
    const menuItem = await MenuItem.getById(id);
    if (!menuItem) {
      throw { status: 404, message: 'Ítem del menú no encontrado' };
    }
    return menuItem;
  }

  async createMenuItem(menuItemData) {
    const { name, price, category } = menuItemData;
    
    // Validación básica
    if (!name || !price || !category) {
      throw { status: 400, message: 'Nombre, precio y categoría son requeridos' };
    }

    if (price <= 0) {
      throw { status: 400, message: 'El precio debe ser mayor que cero' };
    }

    return await MenuItem.create(menuItemData);
  }

  async updateMenuItem(id, updateData) {
    const existingItem = await MenuItem.getById(id);
    if (!existingItem) {
      throw { status: 404, message: 'Ítem del menú no encontrado' };
    }

    if (updateData.price && updateData.price <= 0) {
      throw { status: 400, message: 'El precio debe ser mayor que cero' };
    }

    return await MenuItem.update(id, updateData);
  }

  async deleteMenuItem(id) {
    const existingItem = await MenuItem.getById(id);
    if (!existingItem) {
      throw { status: 404, message: 'Ítem del menú no encontrado' };
    }

    const result = await MenuItem.delete(id);
    if (!result) {
      throw { status: 500, message: 'Error al eliminar el ítem del menú' };
    }

    return { message: 'Ítem del menú eliminado exitosamente' };
  }

  async getMenuItemsByCategory(category) {
    return await MenuItem.getByCategory(category);
  }
}

export default new MenuService();