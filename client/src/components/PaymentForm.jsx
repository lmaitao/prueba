import { useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import Swal from "sweetalert2";

const PaymentForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
    address: "",
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.cardNumber.match(/^\d{16}$/)) {
      newErrors.cardNumber = "Número de tarjeta inválido (16 dígitos)";
    }
    if (!formData.cardName.trim()) {
      newErrors.cardName = "Nombre en la tarjeta requerido";
    }
    if (!formData.expiryDate.match(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/)) {
      newErrors.expiryDate = "Fecha de expiración inválida (MM/YY)";
    }
    if (!formData.cvv.match(/^\d{3,4}$/)) {
      newErrors.cvv = "CVV inválido (3 o 4 dígitos)";
    }
    if (!formData.address.trim()) {
      newErrors.address = "Dirección requerida";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      Swal.fire({
        title: "¡Pago exitoso!",
        text: "Tu pedido ha sido procesado correctamente",
        icon: "success",
        confirmButtonText: "Ok",
      }).then(() => {
        onSuccess();
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Form onSubmit={handleSubmit} className="payment-form">
      <Row className="mb-3">
        <Form.Group as={Col} controlId="cardNumber">
          <Form.Label>Número de Tarjeta</Form.Label>
          <Form.Control
            type="text"
            name="cardNumber"
            value={formData.cardNumber}
            onChange={handleChange}
            placeholder="1234 5678 9012 3456"
            maxLength="16"
            isInvalid={!!errors.cardNumber}
          />
          <Form.Control.Feedback type="invalid">
            {errors.cardNumber}
          </Form.Control.Feedback>
        </Form.Group>
      </Row>

      <Row className="mb-3">
        <Form.Group as={Col} controlId="cardName">
          <Form.Label>Nombre en la Tarjeta</Form.Label>
          <Form.Control
            type="text"
            name="cardName"
            value={formData.cardName}
            onChange={handleChange}
            placeholder="JUAN PEREZ"
            isInvalid={!!errors.cardName}
          />
          <Form.Control.Feedback type="invalid">
            {errors.cardName}
          </Form.Control.Feedback>
        </Form.Group>
      </Row>

      <Row className="mb-3">
        <Form.Group as={Col} md={6} controlId="expiryDate">
          <Form.Label>Fecha de Expiración</Form.Label>
          <Form.Control
            type="text"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleChange}
            placeholder="MM/YY"
            maxLength="5"
            isInvalid={!!errors.expiryDate}
          />
          <Form.Control.Feedback type="invalid">
            {errors.expiryDate}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group as={Col} md={6} controlId="cvv">
          <Form.Label>CVV</Form.Label>
          <Form.Control
            type="text"
            name="cvv"
            value={formData.cvv}
            onChange={handleChange}
            placeholder="123"
            maxLength="4"
            isInvalid={!!errors.cvv}
          />
          <Form.Control.Feedback type="invalid">
            {errors.cvv}
          </Form.Control.Feedback>
        </Form.Group>
      </Row>

      <Row className="mb-3">
        <Form.Group as={Col} controlId="address">
          <Form.Label>Dirección de Envío</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="address"
            value={formData.address}
            onChange={handleChange}
            isInvalid={!!errors.address}
          />
          <Form.Control.Feedback type="invalid">
            {errors.address}
          </Form.Control.Feedback>
        </Form.Group>
      </Row>

      <div className="d-grid">
        <Button variant="primary" type="submit" size="lg">
          Confirmar Pago
        </Button>
      </div>
    </Form>
  );
};

export default PaymentForm;
