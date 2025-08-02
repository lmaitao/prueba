import { useState } from "react";
import { Form, Button, Card, Container, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";
import { FaSignInAlt, FaUserPlus } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login, user } = useAuth(); // Agregar user del contexto
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación básica
    if (!email || !password) {
      setError("Email y contraseña son requeridos");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const loggedInUser = await login(email, password);

      Swal.fire({
        title: "¡Bienvenido!",
        text: `Has iniciado sesión correctamente como ${loggedInUser.email}`,
        icon: "success",
        confirmButtonText: "Continuar",
      }).then(() => {
        // Redirigir según el rol del usuario
        if (loggedInUser.isAdmin) {
          navigate("/admin/dashboard"); // Ruta específica para admin
        } else {
          navigate("/menu"); // Redirigir al menú para usuarios normales
        }
      });
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage = error.response?.data?.message || error.message || "Error al iniciar sesión";
      setError(errorMessage);
      Swal.fire({
        title: "Error",
        text: errorMessage,
        icon: "error",
        confirmButtonText: "Ok",
      });
    } finally {
      setLoading(false);
    }
  };

  // Redirigir si ya está autenticado
  if (user) {
    navigate(user.isAdmin ? "/admin/dashboard" : "/menu");
    return null;
  }

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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="ejemplo@sushi.com"
                autoComplete="username"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPassword">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                autoComplete="current-password"
                minLength="6"
              />
            </Form.Group>

            <div className="d-grid gap-2">
              <Button
                variant="primary"
                type="submit"
                size="lg"
                disabled={loading}
              >
                {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
              </Button>
            </div>
          </Form>

          <div className="text-center mt-4">
            <p className="mb-2">
              ¿No tienes cuenta?{" "}
              <Link to="/register" className="text-decoration-none">
                <FaUserPlus className="me-1" />
                Regístrate aquí
              </Link>
            </p>
            <p className="mb-0">
              <Link to="/forgot-password" className="text-decoration-none">
                ¿Olvidaste tu contraseña?
              </Link>
            </p>
            <p className="mb-0">
              <Link to="/" className="text-decoration-none">
                ← Volver al inicio
              </Link>
            </p>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Login;