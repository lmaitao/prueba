import request from 'supertest';
import app from '../app.js';
import pool from '../config/db.js';
import bcrypt from 'bcryptjs';
import { jwtSecret } from '../config/jwt.js';

describe('Auth Controller', () => {
  let testUser;

  beforeAll(async () => {
    // Crear un usuario de prueba
    const hashedPassword = await bcrypt.hash('password123', 12);
    const result = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
      ['Test User', 'test@example.com', hashedPassword]
    );
    testUser = result.rows[0];
  });

  afterAll(async () => {
    await pool.query('DELETE FROM users');
    await pool.end();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'New User',
          email: 'new@example.com',
          password: 'password123'
        });
      
      expect(response.status).toBe(201);
      expect(response.body.user).toHaveProperty('email', 'new@example.com');
      expect(response.headers['set-cookie']).toBeDefined();
    });

    it('should reject duplicate email', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123'
        });
      
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('El correo ya está registrado');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });
      
      expect(response.status).toBe(200);
      expect(response.body.user).toHaveProperty('email', 'test@example.com');
      expect(response.headers['set-cookie']).toBeDefined();
    });

    it('should reject invalid password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        });
      
      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Credenciales inválidas');
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return current user with valid token', async () => {
      // Primero hacer login para obtener token
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });
      
      const token = loginResponse.headers['set-cookie'][0].split(';')[0].split('=')[1];
      
      const response = await request(app)
        .get('/api/auth/me')
        .set('Cookie', [`token=${token}`]);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('email', 'test@example.com');
    });

    it('should reject request without token', async () => {
      const response = await request(app)
        .get('/api/auth/me');
      
      expect(response.status).toBe(401);
      expect(response.body.message).toMatch(/No autorizado/);
    });
  });
});