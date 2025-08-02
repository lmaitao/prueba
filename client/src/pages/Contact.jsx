import { useState } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import Swal from "sweetalert2";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaTiktok,
  FaWhatsapp,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";
import "../assets/styles/contact.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulación de envío
    Swal.fire({
      title: "¡Mensaje enviado!",
      text: "Gracias por contactarnos. Te responderemos pronto.",
      icon: "success",
      confirmButtonText: "Ok",
    });
    setFormData({
      name: "",
      email: "",
      message: "",
    });
    setSubmitted(true);
  };

  return (
    <Container className="my-5">
      <h1 className="text-center mb-5">Contacto</h1>

      <Row>
        <Col md={6}>
          <h2>Información de Contacto</h2>
          <p>
            <FaMapMarkerAlt className="me-2 text-danger" />
            <strong>Dirección:</strong> Av Vicuña Mackenna 1281, Santiago, Chile
          </p>
          <p>
            <FaPhoneAlt className="me-2 text-primary" />
            <strong>Teléfono:</strong> +56927016426
          </p>
          <p>
            <FaEnvelope className="me-2 text-info" />
            <strong>Email:</strong> contacto@sushidelivery.cl
          </p>
          <p>
            <strong>Horario:</strong>
            <br />
            Lunes a Viernes: 11:00 - 22:00
            <br />
            Sábados y Domingos: 12:00 - 23:00
          </p>
          <div className="mt-4">
            <h3>Síguenos</h3>
            <div className="social-icons d-flex gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon facebook rounded-circle d-flex align-items-center justify-content-center"
              >
                <FaFacebookF />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon instagram rounded-circle d-flex align-items-center justify-content-center"
              >
                <FaInstagram />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon twitter rounded-circle d-flex align-items-center justify-content-center"
              >
                <FaTwitter />
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon tiktok rounded-circle d-flex align-items-center justify-content-center"
              >
                <FaTiktok />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon youtube rounded-circle d-flex align-items-center justify-content-center"
              >
                <FaYoutube />
              </a>
              <a
                href="https://wa.me/56927016426"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon whatsapp rounded-circle d-flex align-items-center justify-content-center"
              >
                <FaWhatsapp />
              </a>
            </div>
          </div>
        </Col>

        <Col md={6}>
          <h2>Envíanos un Mensaje</h2>
          {submitted && (
            <Alert
              variant="success"
              onClose={() => setSubmitted(false)}
              dismissible
            >
              ¡Gracias por tu mensaje! Te contactaremos pronto.
            </Alert>
          )}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Mensaje</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Enviar Mensaje
            </Button>
          </Form>
        </Col>
      </Row>

      <Row className="mt-5">
        <Col>
          <div className="map-container">
            <iframe
              title="Ubicación del restaurante"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3328.6444390898873!2d-70.63215462572782!3d-33.45856889792537!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9662c56427f95aa5%3A0x320ee14e31061066!2sAv.%20Vicu%C3%B1a%20Mackenna%201281%2C%208360052%20%C3%91u%C3%B1oa%2C%20Santiago%2C%20Regi%C3%B3n%20Metropolitana!5e0!3m2!1ses!2scl!4v1750383465973!5m2!1ses!2scl"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Contact;
