import { useContext, useState } from "react";
import { Card, Button, Badge, OverlayTrigger, Tooltip } from "react-bootstrap";
import { CartContext } from "../context/CartContext";
import { FaShoppingCart, FaHeart, FaUtensils, FaArrowLeft } from "react-icons/fa";
import Swal from "sweetalert2";
import "../assets/styles/productcards.css";

const ProductCard = ({ product, onAddToCart }) => {
  const { addToCart, cartItems } = useContext(CartContext);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showIngredients, setShowIngredients] = useState(false);

  // Validar y normalizar el producto
  const safeProduct = {
    id: product?.id || Date.now(),
    name: product?.name || "Producto sin nombre",
    price: typeof product?.price === 'number' ? product.price : 0,
    image: product?.image_url || product?.image || "/placeholder-image.png",
    category: product?.category || "general",
    description: product?.description || "Descripción no disponible",
    ingredients: product?.ingredients || "Ingredientes no especificados"
  };

  // Verifica si el producto está en el carrito
  const itemInCart = cartItems.find((item) => item.id === safeProduct.id);
  const cartQuantity = itemInCart?.quantity || 0;

  const handleAddToCart = (e) => {
    e?.stopPropagation();
    onAddToCart?.(safeProduct);
    showFeedback(
      `"${safeProduct.name}" añadido al carrito`,
      "success",
      "#4BB543"
    );
  };

  const toggleWishlist = (e) => {
    e?.stopPropagation();
    setIsWishlisted((prev) => !prev);
    showFeedback(
      `"${safeProduct.name}" ${!isWishlisted ? "añadido a" : "removido de"} favoritos`,
      !isWishlisted ? "success" : "info",
      !isWishlisted ? "#4BB543" : "#FF9500"
    );
  };

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
      aria-label={`Producto: ${safeProduct.name}`}
    >
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
          src={safeProduct.image}
          className={`product-image ${imageLoaded ? "loaded" : "d-none"}`}
          alt={safeProduct.name}
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            e.target.src = "/placeholder-image.png";
            setImageLoaded(true);
          }}
        />

        {cartQuantity > 0 && (
          <Badge pill bg="danger" className="cart-badge">
            {cartQuantity} en carrito
          </Badge>
        )}

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

      <Card.Body className="product-body d-flex flex-column">
        <div className="product-content-wrapper">
          <Card.Title className="product-title">{safeProduct.name}</Card.Title>
          <Card.Text className="product-category">{safeProduct.category}</Card.Text>

          {!showIngredients ? (
            <>
              <Card.Text className="product-description">
                {safeProduct.description}
              </Card.Text>
              <div className="product-footer">
                <span className="product-price">
                  ${safeProduct.price.toFixed(2)}
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
                <p className="ingredients-list">{safeProduct.ingredients}</p>
              </div>
            </div>
          )}
        </div>

        {showIngredients && (
          <Button
            variant="outline-primary"
            className="back-btn mt-auto"
            onClick={(e) => {
              e?.stopPropagation();
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