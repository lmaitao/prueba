import { useState } from "react";
import { Form, Button, Card, Container, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validaciones
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("Todos los campos son obligatorios");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);
    
    try {
      await register(formData.email, formData.password, formData.name);
      
      Swal.fire({
        title: "¡Registro exitoso!",
        text: `Bienvenido ${formData.name}`,
        icon: "success",
        confirmButtonText: "Continuar",
      }).then(() => {
        navigate("/");
      });
    } catch (err) {
      console.error("Error en registro:", err);
      setError(err.message || "Ocurrió un error durante el registro");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
      <Card className="shadow" style={{ width: "100%", maxWidth: "500px" }}>
        <Card.Body>
          <h2 className="text-center mb-4">Crear Cuenta</h2>
          
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre Completo</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Ingresa tu nombre"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Correo Electrónico</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="ejemplo@correo.com"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                placeholder="Mínimo 6 caracteres"
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Confirmar Contraseña</Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                minLength={6}
                placeholder="Repite tu contraseña"
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100 py-2" disabled={loading}>
              {loading ? "Registrando..." : "Crear Cuenta"}
            </Button>
          </Form>

          <div className="text-center mt-4">
            <p className="mb-2">
              ¿Ya tienes una cuenta? <Link to="/login">Inicia Sesión</Link>
            </p>
            <Link to="/" className="text-muted">← Volver al inicio</Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Register;