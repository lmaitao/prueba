import pool from '../../config/db.js';

class Order {
  static async create({ user_id, items, total }) {
    const query = `
      INSERT INTO orders (user_id, items, total)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const values = [user_id, items, total];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async getById(id) {
    const query = `
      SELECT 
        o.*,
        u.name as user_name,
        u.email as user_email
      FROM orders o
      JOIN users u ON o.user_id = u.id
      WHERE o.id = $1
    `;
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }

  static async getByUserId(user_id) {
    const query = `
      SELECT * FROM orders 
      WHERE user_id = $1
      ORDER BY created_at DESC
    `;
    const { rows } = await pool.query(query, [user_id]);
    return rows;
  }

  static async getAll() {
    const query = `
      SELECT 
        o.*,
        u.name as user_name
      FROM orders o
      JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
    `;
    const { rows } = await pool.query(query);
    return rows;
  }

  static async updateStatus(id, status) {
    const query = `
      UPDATE orders
      SET status = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING *
    `;
    const values = [status, id];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM orders WHERE id = $1 RETURNING id';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }
}

export default Order;