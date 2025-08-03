import pool from '../../config/db.js';

class MenuItem {
  static async getAll() {
    const result = await pool.query(
      'SELECT * FROM menu_items ORDER BY category, name'
    );
    return result.rows;
  }

  static async getById(id) {
    const result = await pool.query(
      'SELECT * FROM menu_items WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  static async getByCategory(category) {
    const result = await pool.query(
      'SELECT * FROM menu_items WHERE LOWER(category) = LOWER($1)',
      [category]
    );
    return result.rows;
  }

  static async create({ name, description, price, category, image_url }) {
    const result = await pool.query(
      'INSERT INTO menu_items (name, description, price, category, image_url) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, description, price, category, image_url]
    );
    return result.rows[0];
  }

  static async update(id, { name, description, price, category, image_url }) {
    const result = await pool.query(
      'UPDATE menu_items SET name = $1, description = $2, price = $3, category = $4, image_url = $5 WHERE id = $6 RETURNING *',
      [name, description, price, category, image_url, id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await pool.query(
      'DELETE FROM menu_items WHERE id = $1 RETURNING id',
      [id]
    );
    return result.rows[0];
  }
}

export default MenuItem;