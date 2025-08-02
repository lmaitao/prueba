import { apiConfig } from './config';

export const getMenuItems = async () => {
  try {
    const response = await fetch(`${apiConfig.baseURL}/menu`, {
      credentials: 'include',
      headers: apiConfig.headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al obtener el menú');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching menu items:', error);
    throw error;
  }
};

export const getMenuItemById = async (id) => {
  try {
    const response = await fetch(`${apiConfig.baseURL}/menu/${id}`, {
      credentials: 'include',
      headers: apiConfig.headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al obtener ítem del menú');
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching menu item ${id}:`, error);
    throw error;
  }
};

export const getMenuItemsByCategory = async (category) => {
  try {
    const response = await fetch(`${apiConfig.baseURL}/menu/category/${category}`, {
      credentials: 'include',
      headers: apiConfig.headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Error al obtener ítems de ${category}`);
    }

    const data = await response.json();
    
    // Asegurar estructura consistente
    return data.map(item => ({
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      image_url: item.image_url || '/images/default-food.jpg'
    }));
  } catch (error) {
    console.error(`Error fetching ${category} items:`, error);
    throw error;
  }
};

export const createMenuItem = async (menuItemData, token) => {
  try {
    const response = await fetch(`${apiConfig.baseURL}/menu`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        ...apiConfig.headers,
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(menuItemData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al crear ítem del menú');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating menu item:', error);
    throw error;
  }
};

export const updateMenuItem = async (id, menuItemData, token) => {
  try {
    const response = await fetch(`${apiConfig.baseURL}/menu/${id}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        ...apiConfig.headers,
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(menuItemData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al actualizar ítem del menú');
    }

    return await response.json();
  } catch (error) {
    console.error(`Error updating menu item ${id}:`, error);
    throw error;
  }
};

export const deleteMenuItem = async (id, token) => {
  try {
    const response = await fetch(`${apiConfig.baseURL}/menu/${id}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        ...apiConfig.headers,
        'Authorization': `Bearer ${token}`
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al eliminar ítem del menú');
    }

    return await response.json();
  } catch (error) {
    console.error(`Error deleting menu item ${id}:`, error);
    throw error;
  }
};