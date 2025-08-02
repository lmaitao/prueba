import { apiConfig } from './config';

export const createOrder = async (orderData) => {
  const response = await fetch(`${apiConfig.baseURL}/orders`, {
    method: 'POST',
    credentials: 'include',
    headers: apiConfig.headers,
    body: JSON.stringify(orderData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al crear pedido');
  }

  return await response.json();
};

export const getUserOrders = async () => {
  const response = await fetch(`${apiConfig.baseURL}/orders/user`, {
    credentials: 'include',
    headers: apiConfig.headers,
  });

  if (!response.ok) {
    throw new Error('Error al obtener pedidos');
  }

  return await response.json();
};

export const getOrderById = async (id) => {
  const response = await fetch(`${apiConfig.baseURL}/orders/${id}`, {
    credentials: 'include',
    headers: apiConfig.headers,
  });

  if (!response.ok) {
    throw new Error('Error al obtener detalle del pedido');
  }

  return await response.json();
};