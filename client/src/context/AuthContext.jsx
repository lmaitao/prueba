import { createContext, useContext, useEffect, useState } from 'react';
import { 
  login as loginService, 
  register as registerService, 
  logout as logoutService, 
  getCurrentUser 
} from '../api/auth';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const navigate = useNavigate();

  // Cargar usuario al iniciar
  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await getCurrentUser();
        const userWithRole = {
          ...userData,
          isAdmin: userData?.role === 'admin'
        };
        setUser(userWithRole);
      } catch (error) {
        console.error('Error loading user:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Efecto para redirección cuando el usuario cambia
  useEffect(() => {
    if (user && !loading) {
      const destination = user.isAdmin ? '/admin' : '/';
      navigate(destination, { replace: true });
    }
  }, [user, loading, navigate]);

  const login = async (email, password) => {
    setAuthLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Credenciales incorrectas');
      }

      const data = await response.json();
      
      const authenticatedUser = {
        id: data?.id || data?.user?.id || null,
        name: data?.name || data?.user?.name || 'Usuario',
        email: data?.email || data?.user?.email || email,
        role: data?.role || data?.user?.role || 'customer',
        isAdmin: (data?.role || data?.user?.role) === 'admin'
      };

      setUser(authenticatedUser);
      localStorage.setItem('user', JSON.stringify(authenticatedUser));
      
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

  const register = async (email, password, name) => {
    setAuthLoading(true);
    try {
      const { user: userData } = await registerService({ 
        email, 
        password,
        name 
      });

      const newUser = {
        ...userData,
        isAdmin: false
      };

      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));

      Swal.fire({
        title: '¡Registro exitoso!',
        text: `Bienvenido ${name}`,
        icon: 'success',
        confirmButtonText: 'Continuar',
      });

      return newUser;
    } catch (error) {
      let errorMessage = 'Error al registrar usuario';
      
      if (error.message.includes('email-already-in-use')) {
        errorMessage = 'Este correo ya está registrado';
      } else if (error.message.includes('weak-password')) {
        errorMessage = 'La contraseña es demasiado débil';
      }

      Swal.fire({
        title: 'Error',
        text: errorMessage,
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
      setUser(null);
      localStorage.removeItem('user');
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
    register,
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

export default AuthContext;