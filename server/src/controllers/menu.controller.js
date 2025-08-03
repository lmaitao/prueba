import MenuItem from '../models/MenuItem.js';

export const getAllMenuItems = async (req, res, next) => {
  try {
    const items = await MenuItem.getAll();
    res.json(items);
  } catch (error) {
    next(error);
  }
};

export const getMenuItemById = async (req, res, next) => {
  try {
    const item = await MenuItem.getById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    res.json(item);
  } catch (error) {
    next(error);
  }
};

export const getMenuItemsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const validCategories = ['sushi', 'ramen', 'bebidas', 'postres'];
    
    if (!validCategories.includes(category.toLowerCase())) {
      return res.status(400).json({ 
        success: false,
        message: 'Categoría no válida',
        data: [] // Siempre devolver un array
      });
    }

    const items = await MenuItem.getByCategory(category);
    
    // Asegurar que items sea un array
    const result = Array.isArray(items) ? items : [];
    
    res.json({
      success: true,
      count: result.length,
      data: result
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error al obtener ítems del menú',
      data: [] // Devolver array vacío en caso de error
    });
  }
};

export const createMenuItem = async (req, res, next) => {
  try {
    const newItem = await MenuItem.create(req.body);
    res.status(201).json(newItem);
  } catch (error) {
    next(error);
  }
};

export const updateMenuItem = async (req, res, next) => {
  try {
    const updatedItem = await MenuItem.update(req.params.id, req.body);
    if (!updatedItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    res.json(updatedItem);
  } catch (error) {
    next(error);
  }
};

export const deleteMenuItem = async (req, res, next) => {
  try {
    const deletedItem = await MenuItem.delete(req.params.id);
    if (!deletedItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    res.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    next(error);
  }
};