import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";

const About = () => {
  return (
    <Container className="my-5">
      <h1 className="text-center mb-5">Sobre Nosotros</h1>

      <Row className="mb-5">
        <Col md={6}>
          <h2>Nuestra Historia</h2>
          <p>
            Fundado en 2010 por el chef japonés Hiroshi Tanaka, nuestro
            restaurante nació con la misión de traer los auténticos sabores de
            Japón a la ciudad. Comenzamos como un pequeño local y hoy somos
            reconocidos por nuestra calidad y autenticidad.
          </p>
          <p>
            Cada plato que servimos es una obra de arte, preparado con
            ingredientes frescos y técnicas tradicionales que han pasado de
            generación en generación.
          </p>
        </Col>
        <Col md={6}>
          <img
            src="/images/restaurant.jpg"
            alt="Nuestro restaurante"
            className="img-fluid rounded shadow"
          />
        </Col>
      </Row>

      <h2 className="text-center mb-4">Nuestro Equipo</h2>
      <Row>
        <Col md={4} className="mb-4">
          <Card>
            <Card.Img variant="top" src="/images/chef1.jpg" />
            <Card.Body>
              <Card.Title>Hiroshi Tanaka</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                Chef Ejecutivo
              </Card.Subtitle>
              <Card.Text>
                Con más de 20 años de experiencia en cocina japonesa, Hiroshi es
                el alma de nuestro restaurante.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card>
            <Card.Img variant="top" src="/images/chef2.jpg" />
            <Card.Body>
              <Card.Title>Yuki Nakamura</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                Maestro Sushi
              </Card.Subtitle>
              <Card.Text>
                Especialista en sushi con formación en Tokio, Yuki prepara cada
                pieza con precisión y arte.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card>
            <Card.Img variant="top" src="/images/chef3.jpg" />
            <Card.Body>
              <Card.Title>Takashi Sato</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                Especialista en Ramen
              </Card.Subtitle>
              <Card.Text>
                Takashi domina el arte del ramen, preparando caldos que cocina
                por más de 12 horas.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default About;
