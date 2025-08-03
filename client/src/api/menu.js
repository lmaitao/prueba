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
    const response = await fetch(`http://localhost:3000/api/menu/category/${category}`, {
      credentials: 'include'
    });
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Respuesta no es JSON');
    }

    const result = await response.json();
    
    // Validación profunda de la estructura de datos
    if (!result || typeof result !== 'object') {
      throw new Error('Respuesta inválida');
    }

    return Array.isArray(result.data) ? 
      result.data.filter(item => item && typeof item === 'object') : 
      [];
  } catch (error) {
    console.error(`Error fetching ${category} items:`, error);
    return [];
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