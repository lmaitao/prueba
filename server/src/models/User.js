import pool from '../../config/db.js';
import bcrypt from 'bcryptjs';

class User {
  static async create({ name, email, password, role = 'customer' }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users 
       (name, email, password, role, phone, address, avatar) 
       VALUES ($1, $2, $3, $4, '', '', '') 
       RETURNING id, name, email, role, phone, address, avatar`,
      [name, email, hashedPassword, role]
    );
    return result.rows[0];
  }

  static async findByEmail(email) {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0];
  }

  static async findById(id) {
    const result = await pool.query(
      'SELECT id, name, email, phone, address, avatar, role FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  static async updateProfile(id, { name, phone, address, avatar, password }) {
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (name) {
      updates.push(`name = $${paramCount++}`);
      values.push(name);
    }
    if (phone) {
      updates.push(`phone = $${paramCount++}`);
      values.push(phone);
    }
    if (address) {
      updates.push(`address = $${paramCount++}`);
      values.push(address);
    }
    if (avatar) {
      updates.push(`avatar = $${paramCount++}`);
      values.push(avatar);
    }
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updates.push(`password = $${paramCount++}`);
      values.push(hashedPassword);
    }

    if (updates.length === 0) {
      throw new Error('No hay campos para actualizar');
    }

    values.push(id);
    const query = `
      UPDATE users 
      SET ${updates.join(', ')} 
      WHERE id = $${paramCount} 
      RETURNING id, name, email, phone, address, avatar, role
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async getAll() {
    const result = await pool.query(
      'SELECT id, name, email, role FROM users'
    );
    return result.rows;
  }

  static async update(id, { name, email, role }) {
    const result = await pool.query(
      'UPDATE users SET name = $1, email = $2, role = $3 WHERE id = $4 RETURNING id, name, email, role',
      [name, email, role, id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await pool.query(
      'DELETE FROM users WHERE id = $1 RETURNING id',
      [id]
    );
    return result.rows[0];
  }
}

export default User;