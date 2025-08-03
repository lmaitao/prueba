import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as loginService, logout as logoutService, getCurrentUser } from '../api/auth';
import Swal from 'sweetalert2';
import { setAuthToken, clearAuthToken } from '../api/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }
        
        setAuthToken(token);
        const userData = await getCurrentUser();
        
        const userWithRole = {
          ...userData,
          isAdmin: userData?.role === 'admin'
        };
        
        setUser(userWithRole);
      } catch (error) {
        clearAuthToken();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  useEffect(() => {
    if (!loading && user) {
      const destination = user.isAdmin ? '/admin/dashboard' : '/profile';
      navigate(destination, { replace: true });
    }
  }, [user, loading, navigate]);

  const login = async (email, password) => {
    setAuthLoading(true);
    try {
      const { token, user: userData } = await loginService(email, password);
      
      const authenticatedUser = {
        ...userData,
        isAdmin: userData.role === 'admin'
      };

      setAuthToken(token);
      setUser(authenticatedUser);
      
      return authenticatedUser;
    } catch (error) {
      console.error('Login error:', error);
      Swal.fire({
        title: 'Error',
        text: error.message || 'Error al iniciar sesión',
        icon: 'error',
        confirmButtonText: 'Ok',
      });
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = async () => {
    try {
      await logoutService();
      clearAuthToken();
      setUser(null);
      Swal.fire({
        title: 'Sesión cerrada',
        text: 'Has cerrado sesión correctamente',
        icon: 'info',
        confirmButtonText: 'Ok',
      });
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      Swal.fire({
        title: 'Error',
        text: 'Ocurrió un error al cerrar sesión',
        icon: 'error',
        confirmButtonText: 'Ok',
      });
    }
  };

  const value = {
    user,
    loading,
    authLoading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};