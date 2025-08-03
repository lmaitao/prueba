import { useState, useEffect } from "react";
import { Form, Button, Card, Container, Alert, Spinner, Row, Col, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";
import { FaUser, FaSave, FaHome, FaTrash, FaLock } from "react-icons/fa";
import api from "../api";

const UserProfile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
    avatar: null,
    preview: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    setFormData({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      address: user.address || "",
      preview: user.avatar || "/default-user-avatar.png"
    });
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        avatar: file,
        preview: URL.createObjectURL(file)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (formData.password && formData.password !== formData.confirmPassword) {
        throw new Error("Las contraseñas no coinciden");
      }

      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("address", formData.address);
      if (formData.password) formDataToSend.append("password", formData.password);
      if (formData.avatar) formDataToSend.append("avatar", formData.avatar);

      await api.put("/user/profile", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      Swal.fire({
        title: "¡Perfil actualizado!",
        text: "Tus datos se han guardado correctamente",
        icon: "success",
        confirmButtonText: "Continuar"
      });
    } catch (error) {
      setError(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer. Se eliminarán todos tus datos.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar cuenta",
      cancelButtonText: "Cancelar"
    });

    if (result.isConfirmed) {
      try {
        setLoading(true);
        await api.delete("/user/profile");
        await logout();
        Swal.fire(
          "¡Cuenta eliminada!",
          "Tu cuenta ha sido eliminada correctamente.",
          "success"
        );
        navigate("/");
      } catch (error) {
        setError(error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  if (!user) return null;

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <Card className="shadow">
            <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
              <h3 className="mb-0">
                <FaUser className="me-2" />
                Mi Perfil
              </h3>
              <Button variant="outline-light" size="sm" onClick={() => navigate("/")}>
                <FaHome className="me-1" />
                Volver al inicio
              </Button>
            </Card.Header>

            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}

              <Row>
                <Col md={4} className="text-center">
                  <Image
                    src={formData.preview}
                    roundedCircle
                    fluid
                    className="mb-3 border border-3 border-primary"
                    style={{ width: "180px", height: "180px", objectFit: "cover" }}
                  />
                  <Form.Group controlId="formAvatar" className="mb-4">
                    <Form.Label>Cambiar imagen de perfil</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      disabled={loading}
                    />
                  </Form.Group>
                </Col>

                <Col md={8}>
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label>Nombre completo</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        disabled={loading}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Correo electrónico</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled
                        readOnly
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Teléfono</Form.Label>
                      <Form.Control
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={loading}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Dirección</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        disabled={loading}
                      />
                    </Form.Group>

                    <hr className="my-4" />

                    <h5 className="mb-3">
                      <FaLock className="me-2" />
                      Cambiar contraseña
                    </h5>

                    <Form.Group className="mb-3">
                      <Form.Label>Nueva contraseña</Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        disabled={loading}
                        placeholder="Dejar en blanco para no cambiar"
                      />
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label>Confirmar contraseña</Form.Label>
                      <Form.Control
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        disabled={loading}
                        placeholder="Confirmar nueva contraseña"
                      />
                    </Form.Group>

                    <div className="d-flex justify-content-between">
                      <Button
                        variant="danger"
                        onClick={handleDeleteAccount}
                        disabled={loading}
                      >
                        <FaTrash className="me-2" />
                        Eliminar cuenta
                      </Button>

                      <Button
                        variant="primary"
                        type="submit"
                        disabled={loading}
                      >
                        {loading ? (
                          <Spinner as="span" size="sm" animation="border" />
                        ) : (
                          <FaSave className="me-2" />
                        )}
                        {loading ? " Guardando..." : " Guardar cambios"}
                      </Button>
                    </div>
                  </Form>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default UserProfile;