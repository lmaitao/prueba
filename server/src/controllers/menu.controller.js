import MenuItem from '../models/MenuItem.js';

const getAllMenuItems = async (req, res) => {
  try {
    const items = await MenuItem.getAll();
    res.json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    console.error('Error en getAllMenuItems:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error al obtener el menú',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const getMenuItemById = async (req, res) => {
  try {
    const item = await MenuItem.getById(req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item no encontrado'
      });
    }
    res.json({
      success: true,
      data: item
    });
  } catch (error) {
    console.error('Error en getMenuItemById:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error al obtener el item',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const getMenuItemsByCategory = async (req, res) => {
  try {
    const items = await MenuItem.getByCategory(req.params.category);
    res.json({
      success: true,
      count: items.length,
      category: req.params.category,
      data: items
    });
  } catch (error) {
    console.error('Error en getMenuItemsByCategory:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error al obtener items por categoría',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const createMenuItem = async (req, res) => {
  try {
    const newItem = await MenuItem.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Item creado exitosamente',
      data: newItem
    });
  } catch (error) {
    console.error('Error en createMenuItem:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error al crear el item',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const updateMenuItem = async (req, res) => {
  try {
    const updatedItem = await MenuItem.update(req.params.id, req.body);
    if (!updatedItem) {
      return res.status(404).json({
        success: false,
        message: 'Item no encontrado'
      });
    }
    res.json({
      success: true,
      message: 'Item actualizado exitosamente',
      data: updatedItem
    });
  } catch (error) {
    console.error('Error en updateMenuItem:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el item',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const deleteMenuItem = async (req, res) => {
  try {
    const deletedItem = await MenuItem.delete(req.params.id);
    if (!deletedItem) {
      return res.status(404).json({
        success: false,
        message: 'Item no encontrado'
      });
    }
    res.json({
      success: true,
      message: 'Item eliminado exitosamente',
      data: deletedItem
    });
  } catch (error) {
    console.error('Error en deleteMenuItem:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar el item',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export {
  getAllMenuItems,
  getMenuItemById,
  getMenuItemsByCategory,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem
};