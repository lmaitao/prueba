import React, { useContext } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  ListGroup,
  Alert,
  Button,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import PaymentForm from "../components/PaymentForm";
import Swal from "sweetalert2";

const Checkout = () => {
  const { cartItems, clearCart, cartTotal } = useContext(CartContext);
  const navigate = useNavigate();

  const handlePaymentSuccess = () => {
    clearCart();
    Swal.fire({
      title: "¡Compra exitosa!",
      text: `Gracias por tu pedido de $${cartTotal.toFixed(
        2
      )}. Te enviaremos un correo con los detalles.`,
      icon: "success",
      confirmButtonText: "Ok",
    }).then(() => {
      navigate("/");
    });
  };

  if (cartItems.length === 0) {
    return (
      <Container className="my-5 text-center">
        <Alert variant="info">
          Tu carrito está vacío. <Alert.Link href="/menu">Ver menú</Alert.Link>
        </Alert>
        <Button
          variant="primary"
          className="mt-3"
          onClick={() => navigate("/menu")}
        >
          Ir al Menú
        </Button>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <h1 className="text-center mb-5">Finalizar Compra</h1>

      <Row>
        <Col lg={7}>
          <Card className="mb-4 shadow-sm">
            <Card.Header as="h5" className="bg-dark text-white">
              Información de Pago
            </Card.Header>
            <Card.Body>
              <PaymentForm onSuccess={handlePaymentSuccess} />
            </Card.Body>
          </Card>
        </Col>

        <Col lg={5}>
          <Card className="shadow-sm">
            <Card.Header as="h5" className="bg-dark text-white">
              Resumen del Pedido
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                {cartItems.map((item) => (
                  <ListGroup.Item
                    key={item.id}
                    className="d-flex justify-content-between align-items-center"
                  >
                    <div className="d-flex align-items-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                          marginRight: "10px",
                          borderRadius: "5px",
                        }}
                      />
                      <div>
                        <div>{item.name}</div>
                        <small className="text-muted">x{item.quantity}</small>
                      </div>
                    </div>
                    <div>${(item.price * item.quantity).toFixed(2)}</div>
                  </ListGroup.Item>
                ))}
                <ListGroup.Item className="d-flex justify-content-between fw-bold fs-5">
                  <div>Total</div>
                  <div>${cartTotal.toFixed(2)}</div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>

          <Alert variant="info" className="mt-3">
            <i className="bi bi-info-circle me-2"></i>
            Todos los precios incluyen impuestos. Envío gratuito en pedidos
            mayores a $50.
          </Alert>
        </Col>
      </Row>
    </Container>
  );
};

export default Checkout;
