import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { createOrder } from '../api/orders';
import Swal from 'sweetalert2';

// Crear contexto
const CartContext = createContext();

// Hook personalizado
export const useCart = () => useContext(CartContext);

// Proveedor
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  // Cargar carrito desde localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('sushi-cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        localStorage.removeItem('sushi-cart');
      }
    }
  }, []);

  // Guardar carrito en localStorage
  useEffect(() => {
    localStorage.setItem('sushi-cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      return existing 
        ? prev.map(item => 
            item.id === product.id 
              ? { ...item, quantity: item.quantity + quantity } 
              : item
          )
        : [...prev, { ...product, quantity }];
    });
    setShowCart(true);
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id, quantity) => {
    const num = Number(quantity);
    setCartItems(prev => 
      num < 1 
        ? prev.filter(item => item.id !== id)
        : prev.map(item => 
            item.id === id ? { ...item, quantity: num } : item
          )
    );
  };

  const clearCart = () => setCartItems([]);
  const toggleCart = () => setShowCart(prev => !prev);

  const submitOrder = async () => {
    if (!user) {
      Swal.fire({
        title: 'Inicia sesión',
        text: 'Debes iniciar sesión para realizar pedidos',
        icon: 'warning',
        confirmButtonText: 'Entendido'
      });
      throw new Error('Usuario no autenticado');
    }

    if (cartItems.length === 0) {
      Swal.fire({
        title: 'Carrito vacío',
        text: 'Agrega productos al carrito',
        icon: 'error',
        confirmButtonText: 'Ok'
      });
      throw new Error('Carrito vacío');
    }

    setIsSubmitting(true);

    try {
      const items = cartItems.map(item => ({
        menuItemId: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        image_url: item.image_url,
        category: item.category
      }));

      const total = cartItems.reduce(
        (sum, item) => sum + (item.price * item.quantity),
        0
      );

      const order = await createOrder({ items, total });
      
      Swal.fire({
        title: '¡Pedido realizado!',
        html: `
          <p>N° de pedido: <strong>${order.id}</strong></p>
          <p>Total: <strong>$${total.toFixed(2)}</strong></p>
        `,
        icon: 'success',
        confirmButtonText: 'Aceptar'
      });

      clearCart();
      return order;
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: error.message || 'Error al procesar pedido',
        icon: 'error',
        confirmButtonText: 'Ok'
      });
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const cartTotal = cartItems.reduce(
    (sum, item) => sum + (item.price * item.quantity),
    0
  );

  const itemCount = cartItems.reduce(
    (count, item) => count + item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        showCart,
        isSubmitting,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleCart,
        submitOrder,
        cartTotal,
        itemCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Exportar el contexto directamente
export { CartContext };