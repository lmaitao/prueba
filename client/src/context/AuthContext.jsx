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
        setUser({
          ...userData,
          isAdmin: userData.role === 'admin'
        });
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Función de login
  const login = async (email, password) => {
    setAuthLoading(true);
    try {
      const { user: userData } = await loginService({ email, password });
      
      const authenticatedUser = {
        ...userData,
        isAdmin: userData.role === 'admin'
      };

      setUser(authenticatedUser);
      
      Swal.fire({
        title: '¡Bienvenido!',
        text: `Has iniciado sesión como ${userData.email}`,
        icon: 'success',
        confirmButtonText: 'Continuar',
      });

      return authenticatedUser;
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: error.message || 'Credenciales incorrectas',
        icon: 'error',
        confirmButtonText: 'Ok',
      });
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  // Función de registro
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

  // Función de logout
  const logout = async () => {
    try {
      await logoutService();
      setUser(null);
      Swal.fire({
        title: 'Sesión cerrada',
        text: 'Has cerrado sesión correctamente',
        icon: 'info',
        confirmButtonText: 'Ok',
      });
      navigate('/');
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

  // Valor del contexto (sin sendPasswordResetEmail)
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

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};

export default AuthContext;