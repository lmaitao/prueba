import request from 'supertest';
import app from '../app.js';
import pool from '../config/db.js';
import MenuItem from '../models/MenuItem.js';

describe('Menu Controller', () => {
  let testItem;
  let adminToken;

  beforeAll(async () => {
    // Crear ítem de menú de prueba
    const itemResult = await pool.query(
      `INSERT INTO menu_items (name, description, price, category, image_url)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      ['Ramen Test', 'Delicioso ramen de prueba', 12.99, 'ramen', 'test.jpg']
    );
    testItem = itemResult.rows[0];

    // Crear usuario admin y obtener token
    const hashedPassword = await bcrypt.hash('admin123', 12);
    await pool.query(
      `INSERT INTO users (name, email, password, role)
       VALUES ($1, $2, $3, $4)`,
      ['Admin', 'admin@menu.com', hashedPassword, 'admin']
    );

    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@menu.com',
        password: 'admin123'
      });
    
    adminToken = loginResponse.headers['set-cookie'][0].split(';')[0].split('=')[1];
  });

  afterAll(async () => {
    await pool.query('DELETE FROM menu_items');
    await pool.query('DELETE FROM users');
    await pool.end();
  });

  describe('GET /api/menu', () => {
    it('should return all menu items', async () => {
      const response = await request(app)
        .get('/api/menu');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('name');
    });
  });

  describe('GET /api/menu/:id', () => {
    it('should return a single menu item by ID', async () => {
      const response = await request(app)
        .get(`/api/menu/${testItem.id}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        id: testItem.id,
        name: testItem.name,
        price: testItem.price.toString()
      });
    });

    it('should return 404 for non-existent menu item', async () => {
      const response = await request(app)
        .get('/api/menu/99999');
      
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Ítem del menú no encontrado');
    });
  });

  describe('GET /api/menu/category/:category', () => {
    it('should return menu items by category', async () => {
      const response = await request(app)
        .get('/api/menu/category/ramen');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0].category).toBe('ramen');
    });

    it('should return empty array for non-existent category', async () => {
      const response = await request(app)
        .get('/api/menu/category/nonexistent');
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
  });

  describe('POST /api/menu', () => {
    it('should create a new menu item (admin only)', async () => {
      const newItem = {
        name: 'New Sushi',
        description: 'Delicious new sushi',
        price: 15.99,
        category: 'sushi',
        image_url: 'sushi.jpg'
      };

      const response = await request(app)
        .post('/api/menu')
        .set('Cookie', [`token=${adminToken}`])
        .send(newItem);
      
      expect(response.status).toBe(201);
      expect(response.body).toMatchObject(newItem);

      // Verify it was actually added to the database
      const dbItem = await MenuItem.getById(response.body.id);
      expect(dbItem).not.toBeNull();
    });

    it('should reject creation with missing required fields', async () => {
      const invalidItems = [
        { description: 'No name', price: 10, category: 'ramen' },
        { name: 'No price', description: 'Test', category: 'ramen' },
        { name: 'No category', description: 'Test', price: 10 }
      ];

      const responses = await Promise.all(
        invalidItems.map(item => 
          request(app)
            .post('/api/menu')
            .set('Cookie', [`token=${adminToken}`])
            .send(item)
        )
      );

      responses.forEach(response => {
        expect(response.status).toBe(400);
      });
    });

    it('should reject unauthorized access (non-admin)', async () => {
      // Create a regular user
      const hashedPassword = await bcrypt.hash('user123', 12);
      await pool.query(
        `INSERT INTO users (name, email, password, role)
         VALUES ($1, $2, $3, $4)`,
        ['Regular User', 'user@menu.com', hashedPassword, 'customer']
      );

      // Login as regular user
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'user@menu.com',
          password: 'user123'
        });
      
      const userToken = loginResponse.headers['set-cookie'][0].split(';')[0].split('=')[1];

      // Try to create menu item
      const response = await request(app)
        .post('/api/menu')
        .set('Cookie', [`token=${userToken}`])
        .send({
          name: 'Unauthorized Item',
          price: 10,
          category: 'ramen'
        });
      
      expect(response.status).toBe(403);
    });
  });

  describe('PUT /api/menu/:id', () => {
    it('should update an existing menu item (admin only)', async () => {
      const updates = {
        name: 'Updated Ramen',
        price: 14.99,
        description: 'New improved recipe'
      };

      const response = await request(app)
        .put(`/api/menu/${testItem.id}`)
        .set('Cookie', [`token=${adminToken}`])
        .send(updates);
      
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject(updates);

      // Verify update in database
      const updatedItem = await MenuItem.getById(testItem.id);
      expect(updatedItem.name).toBe(updates.name);
    });

    it('should return 404 for non-existent menu item', async () => {
      const response = await request(app)
        .put('/api/menu/99999')
        .set('Cookie', [`token=${adminToken}`])
        .send({ name: 'Test' });
      
      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/menu/:id', () => {
    it('should delete a menu item (admin only)', async () => {
      // First create a new item to delete
      const newItem = await MenuItem.create({
        name: 'Item to delete',
        price: 9.99,
        category: 'sushi'
      });

      const response = await request(app)
        .delete(`/api/menu/${newItem.id}`)
        .set('Cookie', [`token=${adminToken}`]);
      
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Ítem del menú eliminado exitosamente');

      // Verify deletion
      const deletedItem = await MenuItem.getById(newItem.id);
      expect(deletedItem).toBeUndefined();
    });

    it('should return 404 for non-existent menu item', async () => {
      const response = await request(app)
        .delete('/api/menu/99999')
        .set('Cookie', [`token=${adminToken}`]);
      
      expect(response.status).toBe(404);
    });
  });
});