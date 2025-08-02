import request from 'supertest';
import app from '../app.js';
import pool from '../config/db.js';
import Order from '../models/Order.js';
import bcrypt from 'bcryptjs';

describe('Orders Controller', () => {
  let customerUser;
  let adminUser;
  let customerToken;
  let adminToken;
  let testMenuItem;
  let testOrder;

  beforeAll(async () => {
    // Crear usuario cliente
    const customerHashedPassword = await bcrypt.hash('customer123', 12);
    const customerResult = await pool.query(
      `INSERT INTO users (name, email, password, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, role`,
      ['Customer User', 'customer@orders.com', customerHashedPassword, 'customer']
    );
    customerUser = customerResult.rows[0];

    // Crear usuario admin
    const adminHashedPassword = await bcrypt.hash('admin123', 12);
    const adminResult = await pool.query(
      `INSERT INTO users (name, email, password, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, role`,
      ['Admin User', 'admin@orders.com', adminHashedPassword, 'admin']
    );
    adminUser = adminResult.rows[0];

    // Crear ítem de menú para pruebas
    const menuItemResult = await pool.query(
      `INSERT INTO menu_items (name, description, price, category)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      ['Test Item', 'Item for order testing', 10.99, 'test']
    );
    testMenuItem = menuItemResult.rows[0];

    // Crear pedido de prueba
    const orderResult = await pool.query(
      `INSERT INTO orders (user_id, items, total, status)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [
        customerUser.id,
        [{ menuItemId: testMenuItem.id, quantity: 2, price: testMenuItem.price }],
        21.98,
        'pending'
      ]
    );
    testOrder = orderResult.rows[0];

    // Obtener tokens
    const customerLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'customer@orders.com', password: 'customer123' });
    customerToken = customerLogin.headers['set-cookie'][0].split(';')[0].split('=')[1];

    const adminLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@orders.com', password: 'admin123' });
    adminToken = adminLogin.headers['set-cookie'][0].split(';')[0].split('=')[1];
  });

  afterAll(async () => {
    await pool.query('DELETE FROM orders');
    await pool.query('DELETE FROM menu_items');
    await pool.query('DELETE FROM users');
    await pool.end();
  });

  describe('POST /api/orders', () => {
    it('should create a new order for authenticated customer', async () => {
      const newOrder = {
        items: [
          { menuItemId: testMenuItem.id, quantity: 1, price: testMenuItem.price }
        ],
        total: testMenuItem.price
      };

      const response = await request(app)
        .post('/api/orders')
        .set('Cookie', [`token=${customerToken}`])
        .send(newOrder);
      
      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        user_id: customerUser.id,
        status: 'pending',
        total: newOrder.total.toString()
      });
    });

    it('should reject order creation with invalid data', async () => {
      const invalidOrders = [
        { items: [], total: 0 }, // Empty items
        { items: [{ menuItemId: testMenuItem.id, quantity: 0 }], total: 0 }, // Zero quantity
        { items: [{ menuItemId: 99999, quantity: 1 }], total: 10 }, // Invalid menu item
        { total: 10 }, // Missing items
      ];

      const responses = await Promise.all(
        invalidOrders.map(order => 
          request(app)
            .post('/api/orders')
            .set('Cookie', [`token=${customerToken}`])
            .send(order)
        )
      );

      responses.forEach(response => {
        expect(response.status).toBe(400);
      });
    });

    it('should reject order creation from non-authenticated user', async () => {
      const response = await request(app)
        .post('/api/orders')
        .send({
          items: [{ menuItemId: testMenuItem.id, quantity: 1 }],
          total: testMenuItem.price
        });
      
      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/orders/user', () => {
    it('should return orders for the current customer', async () => {
      const response = await request(app)
        .get('/api/orders/user')
        .set('Cookie', [`token=${customerToken}`]);
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0].user_id).toBe(customerUser.id);
    });

    it('should not return other users orders to customer', async () => {
      // Create another user and order
      const hashedPassword = await bcrypt.hash('other123', 12);
      const otherUser = await pool.query(
        `INSERT INTO users (name, email, password, role)
         VALUES ($1, $2, $3, $4)
         RETURNING id`,
        ['Other User', 'other@orders.com', hashedPassword, 'customer']
      );

      await pool.query(
        `INSERT INTO orders (user_id, items, total)
         VALUES ($1, $2, $3)`,
        [
          otherUser.rows[0].id,
          [{ menuItemId: testMenuItem.id, quantity: 1 }],
          testMenuItem.price
        ]
      );

      // Login as original customer
      const response = await request(app)
        .get('/api/orders/user')
        .set('Cookie', [`token=${customerToken}`]);
      
      // Should only contain orders from customerUser
      response.body.forEach(order => {
        expect(order.user_id).toBe(customerUser.id);
      });
    });
  });

  describe('GET /api/orders (admin only)', () => {
    it('should return all orders for admin', async () => {
      const response = await request(app)
        .get('/api/orders')
        .set('Cookie', [`token=${adminToken}`]);
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('should reject access for non-admin users', async () => {
      const response = await request(app)
        .get('/api/orders')
        .set('Cookie', [`token=${customerToken}`]);
      
      expect(response.status).toBe(403);
    });
  });

  describe('GET /api/orders/:id', () => {
    it('should return order details for owner customer', async () => {
      const response = await request(app)
        .get(`/api/orders/${testOrder.id}`)
        .set('Cookie', [`token=${customerToken}`]);
      
      expect(response.status).toBe(200);
      expect(response.body.id).toBe(testOrder.id);
      expect(response.body.user_id).toBe(customerUser.id);
    });

    it('should return order details for admin', async () => {
      const response = await request(app)
        .get(`/api/orders/${testOrder.id}`)
        .set('Cookie', [`token=${adminToken}`]);
      
      expect(response.status).toBe(200);
    });

    it('should reject access for other customers', async () => {
      // Create another customer
      const hashedPassword = await bcrypt.hash('other123', 12);
      const otherUser = await pool.query(
        `INSERT INTO users (name, email, password, role)
         VALUES ($1, $2, $3, $4)
         RETURNING id`,
        ['Other User', 'other@orders.com', hashedPassword, 'customer']
      );

      // Login as other customer
      const otherLogin = await request(app)
        .post('/api/auth/login')
        .send({ email: 'other@orders.com', password: 'other123' });
      const otherToken = otherLogin.headers['set-cookie'][0].split(';')[0].split('=')[1];

      // Try to access the test order
      const response = await request(app)
        .get(`/api/orders/${testOrder.id}`)
        .set('Cookie', [`token=${otherToken}`]);
      
      expect(response.status).toBe(403);
    });
  });

  describe('PUT /api/orders/:id/status (admin only)', () => {
    it('should update order status', async () => {
      const newStatus = 'completed';
      const response = await request(app)
        .put(`/api/orders/${testOrder.id}/status`)
        .set('Cookie', [`token=${adminToken}`])
        .send({ status: newStatus });
      
      expect(response.status).toBe(200);
      expect(response.body.status).toBe(newStatus);

      // Verify update in database
      const updatedOrder = await Order.getById(testOrder.id);
      expect(updatedOrder.status).toBe(newStatus);
    });

    it('should reject invalid status values', async () => {
      const response = await request(app)
        .put(`/api/orders/${testOrder.id}/status`)
        .set('Cookie', [`token=${adminToken}`])
        .send({ status: 'invalid-status' });
      
      expect(response.status).toBe(400);
    });

    it('should reject non-admin access', async () => {
      const response = await request(app)
        .put(`/api/orders/${testOrder.id}/status`)
        .set('Cookie', [`token=${customerToken}`])
        .send({ status: 'completed' });
      
      expect(response.status).toBe(403);
    });
  });

  describe('DELETE /api/orders/:id (admin only)', () => {
    it('should delete an order', async () => {
      // First create an order to delete
      const orderToDelete = await Order.create({
        user_id: customerUser.id,
        items: [{ menuItemId: testMenuItem.id, quantity: 1 }],
        total: testMenuItem.price
      });

      const response = await request(app)
        .delete(`/api/orders/${orderToDelete.id}`)
        .set('Cookie', [`token=${adminToken}`]);
      
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Pedido eliminado exitosamente');

      // Verify deletion
      const deletedOrder = await Order.getById(orderToDelete.id);
      expect(deletedOrder).toBeUndefined();
    });

    it('should reject non-admin access', async () => {
      const response = await request(app)
        .delete(`/api/orders/${testOrder.id}`)
        .set('Cookie', [`token=${customerToken}`]);
      
      expect(response.status).toBe(403);
    });
  });
});