import { Container, Row, Col } from "react-bootstrap";
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
import "../assets/styles/footer.css";

const Footer = () => {
  return (
    <footer className="sushi-footer">
      <Container>
        <Row>
          {/* Columna 1: Logo y redes sociales */}
          <Col lg={4} md={6} className="footer-column mb-4">
            <div className="footer-brand">
              <img
                src="../images/logo.png"
                alt="Sushi & Ramen Logo"
                className="footer-logo me-2"
                style={{ height: "40px" }}
              />
              <h3 className="footer-brand-text">Sushi & Ramen</h3>
            </div>
            <p className="footer-description">
              Auténtica cocina japonesa desde 2010. Ingredientes frescos y
              técnicas tradicionales.
            </p>

            <div className="footer-social">
              <h5 className="social-title">Síguenos en redes:</h5>
              <div className="social-icons">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon facebook"
                >
                  <FaFacebookF />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon instagram"
                >
                  <FaInstagram />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon twitter"
                >
                  <FaTwitter />
                </a>
                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon tiktok"
                >
                  <FaTiktok />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon youtube"
                >
                  <FaYoutube />
                </a>
              </div>
            </div>
          </Col>

          {/* Columna 2: Horario */}
          <Col lg={3} md={6} className="footer-column mb-4">
            <h4 className="footer-title">Horario</h4>
            <ul className="footer-schedule">
              <li className="schedule-item">
                <span className="schedule-days">Lunes-Viernes:</span> 11:00 -
                22:00
              </li>
              <li className="schedule-item">
                <span className="schedule-days">Sábado:</span> 12:00 - 23:00
              </li>
              <li className="schedule-item">
                <span className="schedule-days">Domingo:</span> 12:00 - 22:00
              </li>
            </ul>
          </Col>

          {/* Columna 3: Contacto */}
          <Col lg={3} md={6} className="footer-column mb-4">
            <h4 className="footer-title">Contacto</h4>
            <ul className="footer-contact">
              <li className="contact-item">
                <FaMapMarkerAlt className="contact-icon" />
                <span className="contact-text">Av Vicuña Mackenna 1281</span>
              </li>
              <li className="contact-item">
                <FaPhoneAlt className="contact-icon" />
                <span className="contact-text">+56927016426</span>
              </li>
              <li className="contact-item">
                <FaEnvelope className="contact-icon" />
                <span className="contact-text">info@sushiramen.com</span>
              </li>
              <li className="contact-item">
                <FaWhatsapp className="contact-icon" />
                <span className="contact-text">+56927016426</span>
              </li>
            </ul>
          </Col>
        </Row>

        <Row>
          <Col className="text-center py-3">
            <div className="footer-copyright">
              &copy; {new Date().getFullYear()} Sushi & Ramen. Todos los
              derechos reservados.
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
