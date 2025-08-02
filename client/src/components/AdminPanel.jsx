import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Modal,
  Table,
} from "react-bootstrap";
import ProductCard from "../components/ProductCard";
import Swal from "sweetalert2";
import "../assets/styles/adminpanel.css";

const AdminPanel = () => {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    ingredients: "",
    price: "",
    image: "",
    category: "sushi",
  });

  useEffect(() => {
    // Simulación de carga de productos
    const initialProducts = [
      {
        id: 1,
        name: "Sushi Roll Clásico",
        description:
          "8 piezas de sushi tradicional con salmón, aguacate y pepino",
        ingredients:
          "Salmón fresco, aguacate, pepino, arroz para sushi, alga nori, sésamo tostado, wasabi, jengibre encurtido",
        price: 12.99,
        image: "/images/sushi1.jpg",
        category: "sushi",
      },
      {
        id: 2,
        name: "Ramen de Cerdo",
        description: "Delicioso ramen con cerdo chashu, huevo y vegetales",
        ingredients:
          "Fideos ramen, cerdo chashu, huevo marinado, brotes de bambú, cebolla verde, algas nori, caldo tonkotsu, ajo, jengibre",
        price: 14.99,
        image: "/images/ramen1.jpg",
        category: "ramen",
      },
      {
        id: 3,
        name: "Sashimi Variado",
        description: "12 piezas de sashimi fresco (salmón, atún y lubina)",
        ingredients:
          "Salmón, atún, lubina, wasabi fresco, salsa de soja, daikon rallado",
        price: 18.99,
        image: "/images/sushi2.jpg",
        category: "sushi",
      },
      {
        id: 4,
        name: "Ramen Picante",
        description: "Ramen con toque picante, cerdo, huevo y vegetales",
        ingredients:
          "Fideos ramen, cerdo chashu, huevo marinado, maíz dulce, brotes de soja, setas shiitake, miso rojo, aceite de chile",
        price: 13.99,
        image: "/images/ramen2.jpg",
        category: "ramen",
      },
    ];
    setProducts(initialProducts);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductForm({ ...productForm, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingProduct) {
      // Editar producto existente
      setProducts(
        products.map((p) =>
          p.id === editingProduct.id
            ? {
                ...productForm,
                id: editingProduct.id,
                price: parseFloat(productForm.price),
              }
            : p
        )
      );
      Swal.fire(
        "¡Actualizado!",
        "Producto actualizado correctamente",
        "success"
      );
    } else {
      // Añadir nuevo producto
      const newProduct = {
        ...productForm,
        id:
          products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1,
        price: parseFloat(productForm.price),
      };
      setProducts([...products, newProduct]);
      Swal.fire("¡Éxito!", "Producto añadido correctamente", "success");
    }

    setShowModal(false);
    setEditingProduct(null);
    setProductForm({
      name: "",
      description: "",
      ingredients: "",
      price: "",
      image: "",
      category: "sushi",
    });
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      ingredients: product.ingredients,
      price: product.price.toString(),
      image: product.image,
      category: product.category,
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esta acción",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
    }).then((result) => {
      if (result.isConfirmed) {
        setProducts(products.filter((product) => product.id !== id));
        Swal.fire("Eliminado!", "El producto ha sido eliminado.", "success");
      }
    });
  };

  return (
    <Container className="admin-panel my-4">
      <h1 className="mb-4">Panel de Administración</h1>

      <div className="d-flex justify-content-between mb-4">
        <h2>Productos</h2>
        <Button variant="success" onClick={() => setShowModal(true)}>
          Añadir Nuevo Producto
        </Button>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Imagen</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Ingredientes</th>
            <th>Precio</th>
            <th>Categoría</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>
                <img
                  src={product.image}
                  alt={product.name}
                  style={{ width: "50px", height: "50px", objectFit: "cover" }}
                />
              </td>
              <td>{product.name}</td>
              <td>{product.description}</td>
              <td className="ingredients-cell">
                <div className="ingredients-tooltip">
                  {product.ingredients.split(",").slice(0, 2).join(",")}...
                  <span className="tooltip-text">{product.ingredients}</span>
                </div>
              </td>
              <td>${product.price.toFixed(2)}</td>
              <td>{product.category}</td>
              <td>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleEdit(product)}
                  className="me-2"
                >
                  Editar
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(product.id)}
                >
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal para añadir/editar producto */}
      <Modal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setEditingProduct(null);
          setProductForm({
            name: "",
            description: "",
            ingredients: "",
            price: "",
            image: "",
            category: "sushi",
          });
        }}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {editingProduct ? "Editar Producto" : "Añadir Nuevo Producto"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={productForm.name}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Descripción</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={productForm.description}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Ingredientes</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="ingredients"
                    value={productForm.ingredients}
                    onChange={handleInputChange}
                    required
                    placeholder="Lista de ingredientes separados por comas"
                  />
                  <Form.Text className="text-muted">
                    Ejemplo: Salmón, aguacate, arroz, alga nori, sésamo
                  </Form.Text>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Precio ($)</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    min="0"
                    name="price"
                    value={productForm.price}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>URL de la Imagen</Form.Label>
                  <Form.Control
                    type="text"
                    name="image"
                    value={productForm.image}
                    onChange={handleInputChange}
                    required
                    placeholder="/images/nombre-imagen.jpg"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Categoría</Form.Label>
                  <Form.Select
                    name="category"
                    value={productForm.category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="sushi">Sushi</option>
                    <option value="ramen">Ramen</option>
                    <option value="bebida">Bebida</option>
                    <option value="postre">Postre</option>
                  </Form.Select>
                </Form.Group>

                <div className="d-flex justify-content-end mt-4">
                  <Button
                    variant="secondary"
                    onClick={() => setShowModal(false)}
                    className="me-2"
                  >
                    Cancelar
                  </Button>
                  <Button variant="primary" type="submit">
                    {editingProduct
                      ? "Actualizar Producto"
                      : "Guardar Producto"}
                  </Button>
                </div>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default AdminPanel;
