import { useState, useEffect } from "react";
import { Form, Button, Card, Container, Alert, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";
import { FaSignInAlt, FaUserPlus, FaHome, FaKey } from "react-icons/fa";

const Login = () => {
  // Estados
  const [credentials, setCredentials] = useState({
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Hooks
  const { login, user } = useAuth();
  const navigate = useNavigate();

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (user) {
      navigate(user.isAdmin ? "/admin/dashboard" : "/menu");
    }
  }, [user, navigate]);

  // Manejadores
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación
    if (!credentials.email || !credentials.password) {
      setError("Todos los campos son requeridos");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const loggedInUser = await login(credentials.email, credentials.password);
      showSuccessAlert(loggedInUser);
    } catch (error) {
      handleLoginError(error);
    } finally {
      setLoading(false);
    }
  };

  // Helpers
  const showSuccessAlert = (user) => {
    Swal.fire({
      title: "¡Bienvenido!",
      text: `Has iniciado sesión correctamente como ${user.email}`,
      icon: "success",
      confirmButtonText: "Continuar",
    }).then(() => {
      navigate(user.isAdmin ? "/admin/dashboard" : "/menu");
    });
  };

  const handleLoginError = (error) => {
    console.error("Login error:", error);
    const errorMessage = error.response?.data?.message || 
                        error.message || 
                        "Error al iniciar sesión. Por favor intenta nuevamente.";
    
    setError(errorMessage);
    Swal.fire({
      title: "Error",
      text: errorMessage,
      icon: "error",
      confirmButtonText: "Entendido",
    });
  };

  // Render
  return (
    <Container className="d-flex justify-content-center align-items-center auth-container">
      <Card className="auth-card shadow-lg">
        <Card.Body>
          <div className="text-center mb-4">
            <h2 className="auth-title">
              <FaSignInAlt className="me-2" />
              Iniciar Sesión
            </h2>
            <p className="text-muted">Ingresa tus credenciales para acceder</p>
          </div>

          {error && <Alert variant="danger" className="text-center">{error}</Alert>}

          <Form onSubmit={handleSubmit} noValidate>
            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Correo Electrónico</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={credentials.email}
                onChange={handleChange}
                required
                placeholder="ejemplo@sushi.com"
                autoComplete="username"
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
                placeholder="••••••••"
                autoComplete="current-password"
                minLength="6"
                disabled={loading}
              />
            </Form.Group>

            <div className="d-grid gap-2 mb-3">
              <Button
                variant="primary"
                type="submit"
                size="lg"
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
            </div>

            <div className="auth-links text-center">
              <Link to="/register" className="auth-link">
                <FaUserPlus className="me-1" />
                Crear nueva cuenta
              </Link>
              
              <Link to="/forgot-password" className="auth-link">
                <FaKey className="me-1" />
                Recuperar contraseña
              </Link>
              
              <Link to="/" className="auth-link">
                <FaHome className="me-1" />
                Volver al inicio
              </Link>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Login;