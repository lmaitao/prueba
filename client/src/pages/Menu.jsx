import { useState, useEffect } from "react";
import { Container, Row, Col, Tabs, Tab, Spinner, Alert } from "react-bootstrap";
import ProductCard from "../components/ProductCard";
import { getMenuItemsByCategory } from "../api/menu";
import { useCart } from "../context/CartContext";
import "../assets/styles/menu.css";

const Menu = () => {
  const [activeKey, setActiveKey] = useState("sushi");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { addToCart } = useCart();

  const categories = [
    { key: "sushi", name: "Sushi" },
    { key: "ramen", name: "Ramen" },
    { key: "bebidas", name: "Bebidas" },
    { key: "postres", name: "Postres" },
  ];

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await getMenuItemsByCategory(activeKey);
        setProducts(data);
      } catch (err) {
        console.error("Error loading menu:", err);
        setError(err.message || "Error al cargar el menú");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [activeKey]);

  const handleAddToCart = (product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      category: product.category,
      description: product.description
    });
  };

  return (
    <Container className="menu-page py-4">
      <h1 className="text-center mb-5">Nuestro Menú</h1>

      <div className="category-tabs mb-4">
        <Tabs
          activeKey={activeKey}
          onSelect={(k) => setActiveKey(k)}
          className="custom-tabs"
          id="menu-categories"
        >
          {categories.map((category) => (
            <Tab
              key={category.key}
              eventKey={category.key}
              title={<span className="tab-title">{category.name}</span>}
            />
          ))}
        </Tabs>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </Spinner>
        </div>
      ) : error ? (
        <Alert variant="danger" className="text-center">
          {error}
        </Alert>
      ) : (
        <Row className="g-4">
          {products.length > 0 ? (
            products.map((product) => (
              <Col key={product.id} xs={12} sm={6} md={4} lg={3}>
                <ProductCard 
                  product={product} 
                  onAddToCart={() => handleAddToCart(product)} 
                />
              </Col>
            ))
          ) : (
            <Col className="text-center py-5">
              <h4>No hay productos en esta categoría</h4>
            </Col>
          )}
        </Row>
      )}
    </Container>
  );
};

export default Menu;
