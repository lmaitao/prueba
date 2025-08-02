import { useState, useEffect } from "react";
import {
  Form,
  Button,
  Card,
  Container,
  Image,
  Alert,
  Row,
  Col,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";
import { FaUser, FaTrash, FaSave, FaHome } from "react-icons/fa";

const UserProfile = () => {
  const { user, updateProfile, deleteProfile } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    phone: "",
    avatar: null,
    preview: null,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        address: user.address || "",
        phone: user.phone || "",
        avatar: null,
        preview: user.avatar || "/default-avatar.jpg",
      });
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        avatar: file,
        preview: URL.createObjectURL(file),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // En una aplicación real, aquí subirías la imagen a un servidor
      const avatarUrl = formData.preview;

      await updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        address: formData.address,
        phone: formData.phone,
        avatar: avatarUrl,
      });

      Swal.fire({
        title: "Perfil actualizado",
        text: "Tus datos se guardaron correctamente",
        icon: "success",
        confirmButtonText: "Ok",
      });
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message || "Ocurrió un error al actualizar el perfil",
        icon: "error",
        confirmButtonText: "Ok",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow">
            <Card.Header className="bg-primary text-white">
              <div className="d-flex justify-content-between align-items-center">
                <h3 className="mb-0">
                  <FaUser className="me-2" />
                  Mi Perfil
                </h3>
                <Button variant="light" size="sm" onClick={() => navigate("/")}>
                  <FaHome />
                </Button>
              </div>
            </Card.Header>

            <Card.Body>
              <div className="text-center mb-4">
                <Image
                  src={formData.preview}
                  roundedCircle
                  style={{
                    width: "150px",
                    height: "150px",
                    objectFit: "cover",
                  }}
                  className="border border-3 border-primary"
                  thumbnail
                />
                <Form.Group controlId="formAvatar" className="mt-3">
                  <Form.Label>Cambiar foto de perfil</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </Form.Group>
              </div>

              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Nombre</Form.Label>
                      <Form.Control
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        placeholder="Tu nombre"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Apellido</Form.Label>
                      <Form.Control
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        placeholder="Tu apellido"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Dirección</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    placeholder="Tu dirección completa"
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Teléfono</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="Número de teléfono"
                  />
                </Form.Group>

                <div className="d-flex justify-content-between">
                  <Button
                    variant="danger"
                    type="button"
                    onClick={() => deleteProfile()}
                    disabled={loading}
                  >
                    <FaTrash className="me-2" />
                    Eliminar Cuenta
                  </Button>

                  <Button variant="primary" type="submit" disabled={loading}>
                    <FaSave className="me-2" />
                    {loading ? "Guardando..." : "Guardar Cambios"}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default UserProfile;
