import {
  Navbar,
  Nav,
  Container,
  Button,
  Badge,
  Dropdown,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import {
  FaShoppingCart,
  FaUser,
  FaUserCog,
  FaSignOutAlt,
} from "react-icons/fa";
import "../assets/styles/navbar.css";

const CustomNavbar = () => {
  const { user, logout } = useAuth();
  const { toggleCart, itemCount } = useCart(); // Cambiado de navigate a toggleCart
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <Navbar
      bg="dark"
      variant="dark"
      expand="lg"
      fixed="top"
      className="custom-navbar"
    >
      <Container>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <img
            src="/images/logo.png"
            alt="Sushi & Ramen Logo"
            className="navbar-logo me-2"
            style={{ height: "30px" }}
          />
          <span className="d-none d-sm-inline brand-text">Sushi & Ramen</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" className="nav-link-custom">
              Inicio
            </Nav.Link>
            <Nav.Link as={Link} to="/menu" className="nav-link-custom">
              Menú
            </Nav.Link>
            <Nav.Link as={Link} to="/about" className="nav-link-custom">
              Nosotros
            </Nav.Link>
            <Nav.Link as={Link} to="/contact" className="nav-link-custom">
              Contacto
            </Nav.Link>
          </Nav>

          <Nav>
            {user ? (
              <>
                {user.isAdmin && (
                  <Button
                    variant="outline-light"
                    className="me-2 admin-button"
                    onClick={() => navigate("/admin")}
                  >
                    Panel Admin
                  </Button>
                )}

                <Dropdown align="end">
                  <Dropdown.Toggle
                    variant="outline-light"
                    className="d-flex align-items-center profile-toggle"
                  >
                    {user.isAdmin ? (
                      <FaUserCog className="me-1" />
                    ) : (
                      <FaUser className="me-1" />
                    )}
                    <span className="profile-text">
                      {user.firstName || user.email.split("@")[0]}
                    </span>
                  </Dropdown.Toggle>

                  <Dropdown.Menu className="dropdown-menu-dark">
                    <Dropdown.Item
                      onClick={() =>
                        navigate(user.isAdmin ? "/admin-profile" : "/profile")
                      }
                      className="dropdown-item-custom"
                    >
                      {user.isAdmin ? (
                        <>
                          <FaUserCog className="me-2" />
                          <span>Perfil Admin</span>
                        </>
                      ) : (
                        <>
                          <FaUser className="me-2" />
                          <span>Mi Perfil</span>
                        </>
                      )}
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item
                      onClick={handleLogout}
                      className="dropdown-item-custom"
                    >
                      <FaSignOutAlt className="me-2" />
                      <span>Cerrar Sesión</span>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </>
            ) : (
              <>
                <Button
                  variant="outline-light"
                  as={Link}
                  to="/login"
                  className="me-2 login-button"
                >
                  Ingresar
                </Button>
                <Button
                  variant="primary"
                  as={Link}
                  to="/register"
                  className="register-button"
                >
                  Registrarse
                </Button>
              </>
            )}

            <Button
              variant="outline-info"
              onClick={toggleCart} // Cambiado de navigate("/cart") a toggleCart
              className="ms-2 position-relative cart-button"
              aria-label="Ver carrito"
            >
              <FaShoppingCart />
              {itemCount > 0 && (
                <Badge
                  pill
                  bg="danger"
                  className="position-absolute top-0 start-100 translate-middle cart-badge"
                >
                  {itemCount}
                </Badge>
              )}
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
