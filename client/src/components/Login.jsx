import { useState, useEffect } from "react";
import { Form, Button, Card, Container, Alert, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";
import { FaSignInAlt, FaUserPlus, FaHome } from "react-icons/fa";

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { user, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate(user.isAdmin ? '/admin/dashboard' : '/profile', { replace: true });
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!credentials.email || !credentials.password) {
      setError("Todos los campos son requeridos");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const loggedInUser = await login(credentials.email, credentials.password);
      
      Swal.fire({
        title: "¡Bienvenido!",
        text: `Has iniciado sesión correctamente como ${loggedInUser.email}`,
        icon: "success",
        confirmButtonText: "Continuar",
      }).then(() => {
        navigate(loggedInUser.isAdmin ? "/admin/dashboard" : "/profile");
      });
    } catch (error) {
      setError(error.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
      <Card className="shadow-lg" style={{ width: "100%", maxWidth: "450px" }}>
        <Card.Body>
          <div className="text-center mb-4">
            <h2>
              <FaSignInAlt className="me-2" />
              Iniciar Sesión
            </h2>
            <p className="text-muted">Ingresa tus credenciales para acceder</p>
          </div>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Correo Electrónico</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={credentials.email}
                onChange={handleChange}
                required
                placeholder="ejemplo@sushi.com"
                disabled={loading}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPassword">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                required
                minLength={6}
                placeholder="••••••••"
                disabled={loading}
              />
            </Form.Group>

            <Button
              variant="primary"
              type="submit"
              className="w-100 py-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  Iniciando sesión...
                </>
              ) : (
                "Iniciar Sesión"
              )}
            </Button>
          </Form>

          <div className="text-center mt-4">
            <p className="mb-2">
              ¿No tienes cuenta?{" "}
              <Link to="/register" className="text-decoration-none">
                <FaUserPlus className="me-1" />
                Regístrate aquí
              </Link>
            </p>
            <Link to="/" className="text-decoration-none">
              <FaHome className="me-1" />
              Volver al inicio
            </Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Login;