import { useCart } from "../context/CartContext";
import { Button, Modal, Badge } from "react-bootstrap";
import Swal from "sweetalert2";
import {
  FaTrash,
  FaPlus,
  FaMinus,
  FaShoppingCart,
  FaArrowRight,
  FaShoppingBasket,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../assets/styles/cart.css";

const Cart = () => {
  const {
    cartItems,
    showCart,
    toggleCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
    itemCount,
  } = useCart();

  const navigate = useNavigate();

  const handleIncrease = (item) => {
    addToCart(item);
    showToast(`+1 ${item.name}`, "success");
  };

  const handleDecrease = (item) => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1);
      showToast(`-1 ${item.name}`, "info");
    } else {
      handleRemove(item.id);
    }
  };

  const handleRemove = (productId) => {
    const product = cartItems.find((item) => item.id === productId);
    if (!product) return;

    Swal.fire({
      title: "¿Eliminar producto?",
      text: `¿Quieres eliminar ${product.name} del carrito?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        removeFromCart(productId);
        showToast(`${product.name} fue removido`, "success");
      }
    });
  };

  const handleClearCart = () => {
    if (cartItems.length === 0) return;

    Swal.fire({
      title: "¿Vaciar carrito?",
      text: "¿Estás seguro de eliminar todos los productos?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, vaciar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        clearCart();
        showToast("Carrito vaciado", "success");
      }
    });
  };

  const handleCheckout = () => {
    toggleCart();
    navigate("/checkout");
  };

  const showToast = (message, icon) => {
    Swal.fire({
      position: "top-end",
      title: message,
      icon: icon,
      showConfirmButton: false,
      timer: 800,
      toast: true,
      background: icon === "success" ? "#28a745" : "#17a2b8",
      color: "white",
    });
  };

  return (
    <Modal
      show={showCart}
      onHide={toggleCart}
      centered
      className="cart-modal"
      size="lg"
    >
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="w-100">
          <div className="d-flex align-items-center">
            <FaShoppingCart className="me-2" />
            <strong>Mi Carrito</strong>
            {itemCount > 0 && (
              <Badge pill bg="primary" className="ms-2">
                {itemCount}
              </Badge>
            )}
          </div>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="pt-0">
        {cartItems.length === 0 ? (
          <div className="text-center py-4">
            <FaShoppingBasket size={80} className="empty-cart-icon" />
            <h5>Tu carrito está vacío</h5>
            <p className="text-muted mb-4">Agrega productos para continuar</p>
            <Button variant="primary" onClick={toggleCart} className="px-4">
              Ver menú
            </Button>
          </div>
        ) : (
          <>
            <div className="cart-items-container mb-3">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="cart-item p-3 mb-2 border rounded"
                >
                  <div className="d-flex">
                    <img
                      src={item.image || "/default-food.jpg"}
                      alt={item.name}
                      className="cart-item-img me-3"
                      onError={(e) => {
                        e.target.src = "/default-food.jpg";
                      }}
                    />
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h6 className="mb-1">{item.name}</h6>
                          <p className="text-muted small mb-2">
                            ${(item.price || 0).toFixed(2)} c/u
                          </p>
                        </div>
                        <Button
                          variant="link"
                          className="text-danger p-0 mt-1"
                          onClick={() => handleRemove(item.id)}
                          aria-label={`Eliminar ${item.name}`}
                        >
                          <FaTrash size={14} />
                        </Button>
                      </div>

                      <div className="d-flex justify-content-between align-items-center">
                        <div className="quantity-controls">
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            className="px-2 py-0"
                            onClick={() => handleDecrease(item)}
                            aria-label="Reducir cantidad"
                          >
                            <FaMinus size={12} />
                          </Button>
                          <span className="quantity-input mx-2">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            className="px-2 py-0"
                            onClick={() => handleIncrease(item)}
                            aria-label="Aumentar cantidad"
                          >
                            <FaPlus size={12} />
                          </Button>
                        </div>
                        <div className="fw-bold">
                          ${((item.price || 0) * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary border-top pt-3">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Total:</h5>
                <h5 className="text-primary mb-0">${cartTotal.toFixed(2)}</h5>
              </div>

              <div className="d-flex gap-2">
                <Button
                  variant="outline-danger"
                  className="flex-grow-1 py-2"
                  onClick={handleClearCart}
                >
                  Vaciar Carrito
                </Button>
                <Button
                  variant="primary"
                  className="flex-grow-1 py-2 d-flex align-items-center justify-content-center"
                  onClick={handleCheckout}
                >
                  Pagar <FaArrowRight className="ms-2" />
                </Button>
              </div>
            </div>
          </>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default Cart;
