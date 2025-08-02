import { Link } from "react-router-dom";
import { Button, Container } from "react-bootstrap";
import "../assets/styles/notfound.css";

const NotFound = () => {
  return (
    <Container className="not-found-container">
      <div className="not-found-content">
        <h1 className="error-code">404</h1>
        <h2 className="error-title">Página no encontrada</h2>
        <p className="error-message">
          Lo sentimos, la página que estás buscando no existe o ha sido movida.
        </p>
        <Button as={Link} to="/" variant="primary" size="lg">
          Volver al inicio
        </Button>
      </div>
    </Container>
  );
};

export default NotFound;
