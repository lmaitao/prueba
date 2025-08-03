import pool from '../../config/db.js';

class Order {
  static async create({ user_id, items, total }) {
    const result = await pool.query(
      'INSERT INTO orders (user_id, items, total) VALUES ($1, $2, $3) RETURNING *',
      [user_id, items, total]
    );
    return result.rows[0];
  }

  static async getById(id) {
    const result = await pool.query(
      'SELECT * FROM orders WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  static async getByUserId(user_id) {
    const result = await pool.query(
      'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC',
      [user_id]
    );
    return result.rows;
  }

  static async getAll() {
    const result = await pool.query(
      'SELECT * FROM orders ORDER BY created_at DESC'
    );
    return result.rows;
  }

  static async updateStatus(id, status) {
    const result = await pool.query(
      'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await pool.query(
      'DELETE FROM orders WHERE id = $1 RETURNING id',
      [id]
    );
    return result.rows[0];
  }
}

export default Order;