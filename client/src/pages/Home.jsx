import React from "react";
import { Container, Button, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import products from "../assets/data/products";

const Home = () => {
  const featuredProducts = products.slice(0, 4);

  return (
    <div>
      {/* Hero Section */}
      <div className="hero-section text-white text-center py-5">
        <Container>
          <h1 className="hero-title">Sushi & Ramen Artesanales</h1>
          <p className="hero-subtitle">
            Los sabores más auténticos de Japón en tu mesa
          </p>
          <Button
            as={Link}
            to="/menu"
            variant="primary"
            size="lg"
            className="cta-button"
          >
            Ver Menú
          </Button>
        </Container>
      </div>

      {/* Featured Products */}
      <Container className="my-5">
        <h2 className="text-center mb-4">Nuestros Productos Destacados</h2>
        <Row>
          {featuredProducts.map((product) => (
            <Col md={3} key={product.id}>
              <ProductCard product={product} />
            </Col>
          ))}
        </Row>
        <div className="text-center mt-4">
          <Button as={Link} to="/menu" variant="outline-primary">
            Ver Menú Completo
          </Button>
        </div>
      </Container>

      {/* About Section */}
      <div className="bg-light py-5">
        <Container>
          <Row className="align-items-center">
            <Col md={6}>
              <h2>Nuestra Historia</h2>
              <p>
                Desde 2010, nos hemos dedicado a traer los auténticos sabores de
                Japón a tu ciudad. Nuestros chefs, entrenados en Tokio, preparan
                cada plato con ingredientes frescos y técnicas tradicionales.
              </p>
              <Button as={Link} to="/about" variant="primary">
                Conócenos Más
              </Button>
            </Col>
            <Col md={6}>
              <img
                src="/images/chef.jpg"
                alt="Nuestro chef"
                className="img-fluid rounded shadow"
              />
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default Home;
