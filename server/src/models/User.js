import pool from '../../config/db.js';
import bcrypt from 'bcryptjs';

class User {
  static async create({ name, email, password, role = 'customer' }) {
    const hashedPassword = await bcrypt.hash(password, 12);
    const query = `
      INSERT INTO users (name, email, password, role)
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, email, role, created_at
    `;
    const values = [name, email, hashedPassword, role];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const { rows } = await pool.query(query, [email]);
    return rows[0];
  }

  static async findById(id) {
    const query = 'SELECT id, name, email, role, created_at FROM users WHERE id = $1';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }

  static async update(id, { name, email, role }) {
    const query = `
      UPDATE users
      SET name = $1, email = $2, role = $3
      WHERE id = $4
      RETURNING id, name, email, role, created_at
    `;
    const values = [name, email, role, id];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM users WHERE id = $1 RETURNING id';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }

  static async getAll() {
    const query = 'SELECT id, name, email, role, created_at FROM users';
    const { rows } = await pool.query(query);
    return rows;
  }
}

export default User;