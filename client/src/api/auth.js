import { apiConfig } from './config';

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error en la solicitud');
  }
  return response.json();
};

export const authService = {
  login: async ({ email, password }) => {
    const response = await fetch(`${apiConfig.baseURL}/auth/login`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...apiConfig.headers
      },
      body: JSON.stringify({ 
        email: email.trim(), 
        password: password.trim() 
      }),
    });
    return handleResponse(response);
  },

  register: async (userData) => {
    const response = await fetch(`${apiConfig.baseURL}/auth/register`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...apiConfig.headers
      },
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  logout: async () => {
    const response = await fetch(`${apiConfig.baseURL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
      headers: apiConfig.headers,
    });
    await handleResponse(response);
  },

  getCurrentUser: async () => {
    const response = await fetch(`${apiConfig.baseURL}/auth/me`, {
      credentials: 'include',
      headers: apiConfig.headers,
    });
    return handleResponse(response);
  }
};

export const login = authService.login;
export const register = authService.register;
export const logout = authService.logout;
export const getCurrentUser = authService.getCurrentUser;

export default authService;