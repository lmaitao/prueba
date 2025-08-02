-- DATA BASE
CREATE DATABASE ramen_sushi;

-- Creación de tablas
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'customer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de ítems del menú
CREATE TABLE menu_items (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL CHECK (price > 0),
  category VARCHAR(50) NOT NULL CHECK (category IN ('ramen', 'sushi', 'bebidas', 'postres')),
  image_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para optimización
CREATE INDEX idx_menu_items_category ON menu_items(category);
CREATE INDEX idx_menu_items_name ON menu_items(name);
CREATE INDEX idx_menu_items_price ON menu_items(price);

-- Datos iniciales para pruebas
INSERT INTO menu_items (name, description, price, category, image_url)
VALUES 
  ('Ramen Shoyu', 'Delicioso ramen con caldo de soja', 12.99, 'ramen', 'https://ejemplo.com/ramen-shoyu.jpg'),
  ('Sushi Variado', '10 piezas de sushi variado', 15.99, 'sushi', 'https://ejemplo.com/sushi-variado.jpg'),
  ('Té Verde', 'Té verde japonés tradicional', 3.50, 'bebidas', 'https://ejemplo.com/te-verde.jpg'),
  ('Mochi', 'Postre japonés de arroz glutinoso', 5.99, 'postres', 'https://ejemplo.com/mochi.jpg');

-- Tabla de pedidos
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  items JSONB NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'cancelled')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para mejor performance
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
