import request from 'supertest';
import app from '../app.js';
import pool from '../config/db.js';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

describe('Users Controller', () => {
  let adminUser;
  let regularUser;
  let adminToken;
  let regularToken;

  beforeAll(async () => {
    // Crear usuario admin
    const adminHashedPassword = await bcrypt.hash('admin123', 12);
    const adminResult = await pool.query(
      `INSERT INTO users (name, email, password, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, role`,
      ['Admin User', 'admin@users.com', adminHashedPassword, 'admin']
    );
    adminUser = adminResult.rows[0];

    // Crear usuario regular
    const regularHashedPassword = await bcrypt.hash('user123', 12);
    const regularResult = await pool.query(
      `INSERT INTO users (name, email, password, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, role`,
      ['Regular User', 'user@users.com', regularHashedPassword, 'customer']
    );
    regularUser = regularResult.rows[0];

    // Obtener tokens
    const adminLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@users.com', password: 'admin123' });
    adminToken = adminLogin.headers['set-cookie'][0].split(';')[0].split('=')[1];

    const regularLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'user@users.com', password: 'user123' });
    regularToken = regularLogin.headers['set-cookie'][0].split(';')[0].split('=')[1];
  });

  afterAll(async () => {
    await pool.query('DELETE FROM users');
    await pool.end();
  });

  describe('GET /api/users', () => {
    it('should return all users for admin', async () => {
      const response = await request(app)
        .get('/api/users')
        .set('Cookie', [`token=${adminToken}`]);
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
    });

    it('should reject access for non-admin users', async () => {
      const response = await request(app)
        .get('/api/users')
        .set('Cookie', [`token=${regularToken}`]);
      
      expect(response.status).toBe(403);
    });

    it('should reject unauthenticated access', async () => {
      const response = await request(app)
        .get('/api/users');
      
      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/users/:id', () => {
    it('should return user details for admin', async () => {
      const response = await request(app)
        .get(`/api/users/${regularUser.id}`)
        .set('Cookie', [`token=${adminToken}`]);
      
      expect(response.status).toBe(200);
      expect(response.body.id).toBe(regularUser.id);
      expect(response.body.email).toBe(regularUser.email);
    });

    it('should reject access for non-admin users', async () => {
      const response = await request(app)
        .get(`/api/users/${adminUser.id}`)
        .set('Cookie', [`token=${regularToken}`]);
      
      expect(response.status).toBe(403);
    });

    it('should return 404 for non-existent user', async () => {
      const response = await request(app)
        .get('/api/users/99999')
        .set('Cookie', [`token=${adminToken}`]);
      
      expect(response.status).toBe(404);
    });
  });

  describe('PUT /api/users/:id', () => {
    it('should update user details (admin only)', async () => {
      const updates = {
        name: 'Updated Name',
        email: 'updated@users.com',
        role: 'admin'
      };

      const response = await request(app)
        .put(`/api/users/${regularUser.id}`)
        .set('Cookie', [`token=${adminToken}`])
        .send(updates);
      
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject(updates);

      // Verify update in database
      const updatedUser = await User.findById(regularUser.id);
      expect(updatedUser.name).toBe(updates.name);
      expect(updatedUser.email).toBe(updates.email);
      expect(updatedUser.role).toBe(updates.role);
    });

    it('should reject self role update', async () => {
      const response = await request(app)
        .put(`/api/users/${adminUser.id}`)
        .set('Cookie', [`token=${adminToken}`])
        .send({ role: 'customer' });
      
      expect(response.status).toBe(403);
      expect(response.body.message).toBe('No puedes cambiar tu propio rol');
    });

    it('should reject invalid email format', async () => {
      const response = await request(app)
        .put(`/api/users/${regularUser.id}`)
        .set('Cookie', [`token=${adminToken}`])
        .send({ email: 'invalid-email' });
      
      expect(response.status).toBe(400);
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should delete a user (admin only)', async () => {
      // First create a user to delete
      const hashedPassword = await bcrypt.hash('todelete123', 12);
      const userToDelete = await pool.query(
        `INSERT INTO users (name, email, password, role)
         VALUES ($1, $2, $3, $4)
         RETURNING id`,
        ['To Delete', 'delete@users.com', hashedPassword, 'customer']
      );

      const response = await request(app)
        .delete(`/api/users/${userToDelete.rows[0].id}`)
        .set('Cookie', [`token=${adminToken}`]);
      
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Usuario eliminado exitosamente');

      // Verify deletion
      const deletedUser = await User.findById(userToDelete.rows[0].id);
      expect(deletedUser).toBeUndefined();
    });

    it('should reject self deletion', async () => {
      const response = await request(app)
        .delete(`/api/users/${adminUser.id}`)
        .set('Cookie', [`token=${adminToken}`]);
      
      expect(response.status).toBe(403);
      expect(response.body.message).toBe('No puedes eliminarte a ti mismo');
    });

    it('should reject non-admin access', async () => {
      const response = await request(app)
        .delete(`/api/users/${regularUser.id}`)
        .set('Cookie', [`token=${regularToken}`]);
      
      expect(response.status).toBe(403);
    });
  });
});