import { apiConfig } from './config';

// Función helper para manejar respuestas HTTP
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error en la solicitud');
  }
  return response.json();
};

// Servicio de autenticación
export const authService = {
  /**
   * Inicia sesión con las credenciales proporcionadas
   * @param {Object} credentials - { email, password }
   * @returns {Promise<Object>} Datos del usuario
   */
  login: async (credentials) => {
    const response = await fetch(`${apiConfig.baseURL}/auth/login`, {
      method: 'POST',
      credentials: 'include',
      headers: apiConfig.headers,
      body: JSON.stringify(credentials),
    });
    return handleResponse(response);
  },

  /**
   * Registra un nuevo usuario
   * @param {Object} userData - { email, password, name }
   * @returns {Promise<Object>} Datos del usuario registrado
   */
  register: async (userData) => {
    const response = await fetch(`${apiConfig.baseURL}/auth/register`, {
      method: 'POST',
      credentials: 'include',
      headers: apiConfig.headers,
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  /**
   * Cierra la sesión actual
   * @returns {Promise<void>}
   */
  logout: async () => {
    const response = await fetch(`${apiConfig.baseURL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
      headers: apiConfig.headers,
    });
    await handleResponse(response);
  },

  /**
   * Obtiene el usuario actualmente autenticado
   * @returns {Promise<Object>} Datos del usuario
   */
  getCurrentUser: async () => {
    const response = await fetch(`${apiConfig.baseURL}/auth/me`, {
      credentials: 'include',
      headers: apiConfig.headers,
    });
    return handleResponse(response);
  }
};

// Exportaciones individuales
export const login = authService.login;
export const register = authService.register;
export const logout = authService.logout;
export const getCurrentUser = authService.getCurrentUser;

// Exportación por defecto
export default authService;