import { useContext, useState } from "react";
import { Card, Button, Badge, OverlayTrigger, Tooltip } from "react-bootstrap";
import { CartContext } from "../context/CartContext";
import { FaShoppingCart, FaHeart, FaUtensils, FaArrowLeft } from "react-icons/fa";
import Swal from "sweetalert2";
import "../assets/styles/productcards.css";

const ProductCard = ({ product }) => {
  const { addToCart, cartItems } = useContext(CartContext);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showIngredients, setShowIngredients] = useState(false);

  // Verifica si el producto está en el carrito y obtiene su cantidad
  const itemInCart = cartItems.find((item) => item.id === product.id);
  const cartQuantity = itemInCart?.quantity || 0;

  // Maneja la adición al carrito con feedback visual
  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
    showFeedback(
      `"${product.name}" añadido al carrito`,
      "success",
      "#4BB543"
    );
  };

  // Alterna el estado de favoritos
  const toggleWishlist = (e) => {
    e.stopPropagation();
    setIsWishlisted((prev) => !prev);
    showFeedback(
      `"${product.name}" ${!isWishlisted ? "añadido a" : "removido de"} favoritos`,
      !isWishlisted ? "success" : "info",
      !isWishlisted ? "#4BB543" : "#FF9500"
    );
  };

  // Muestra feedback visual al usuario
  const showFeedback = (message, icon, color) => {
    Swal.fire({
      title: icon === "success" ? "¡Éxito!" : "Información",
      text: message,
      icon,
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
      background: "#1a1a2e",
      color: "#fff",
      iconColor: color,
    });
  };

  return (
    <Card
      className={`product-card ${showIngredients ? "ingredients-view" : ""}`}
      aria-label={`Producto: ${product.name}`}
    >
      {/* Sección de imagen con funcionalidades */}
      <div
        className="product-image-container"
        onClick={() => setShowIngredients(!showIngredients)}
        role="button"
        tabIndex={0}
        aria-label={showIngredients ? "Ocultar ingredientes" : "Mostrar ingredientes"}
      >
        {!imageLoaded && (
          <div className="image-loading-placeholder">
            <div className="loading-spinner" aria-hidden="true"></div>
          </div>
        )}

        <Card.Img
          variant="top"
          src={product.image}
          className={`product-image ${imageLoaded ? "loaded" : "d-none"}`}
          alt={product.name}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageLoaded(true)}
        />

        {/* Badge de cantidad en carrito */}
        {cartQuantity > 0 && (
          <Badge pill bg="danger" className="cart-badge">
            {cartQuantity} en carrito
          </Badge>
        )}

        {/* Botón de favoritos con tooltip */}
        <div className="product-actions">
          <OverlayTrigger
            placement="top"
            overlay={
              <Tooltip>
                {isWishlisted ? "Quitar de favoritos" : "Añadir a favoritos"}
              </Tooltip>
            }
          >
            <Button
              variant={isWishlisted ? "danger" : "outline-light"}
              className="wishlist-btn"
              onClick={toggleWishlist}
              aria-label={isWishlisted ? "Quitar de favoritos" : "Añadir a favoritos"}
            >
              <FaHeart className={isWishlisted ? "filled-heart" : ""} />
            </Button>
          </OverlayTrigger>
        </div>
      </div>

      {/* Cuerpo de la tarjeta */}
      <Card.Body className="product-body d-flex flex-column">
        <div className="product-content-wrapper">
          <Card.Title className="product-title">{product.name}</Card.Title>
          <Card.Text className="product-category">{product.category}</Card.Text>

          {!showIngredients ? (
            <>
              <Card.Text className="product-description">
                {product.description}
              </Card.Text>
              <div className="product-footer">
                <span className="product-price">
                  ${product.price.toFixed(2)}
                </span>
                <Button
                  variant="primary"
                  className="add-to-cart-btn"
                  onClick={handleAddToCart}
                  aria-label="Añadir al carrito"
                >
                  <FaShoppingCart className="me-1" /> Añadir
                </Button>
              </div>
            </>
          ) : (
            <div className="ingredients-viewport">
              <div className="ingredients-header">
                <FaUtensils className="me-2" />
                <h5>Ingredientes</h5>
              </div>
              <div className="ingredients-scroll-container">
                <p className="ingredients-list">{product.ingredients}</p>
              </div>
            </div>
          )}
        </div>

        {/* Botón para volver (solo visible en vista de ingredientes) */}
        {showIngredients && (
          <Button
            variant="outline-primary"
            className="back-btn mt-auto"
            onClick={(e) => {
              e.stopPropagation();
              setShowIngredients(false);
            }}
            aria-label="Volver al producto"
          >
            <FaArrowLeft className="me-1" /> Volver
          </Button>
        )}
      </Card.Body>
    </Card>
  );
};

export default ProductCard;