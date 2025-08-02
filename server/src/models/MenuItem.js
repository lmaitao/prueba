import pool from '../../config/db.js';

class MenuItem {
  static async getAll() {
    const query = `
      SELECT id, name, category, description, ingredients, price, image, 
             TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS') as created_at,
             TO_CHAR(updated_at, 'YYYY-MM-DD HH24:MI:SS') as updated_at
      FROM menu_items
      ORDER BY category, name`;
    const { rows } = await pool.query(query);
    return rows;
  }

  static async getById(id) {
    const query = `
      SELECT id, name, category, description, ingredients, price, image,
             TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS') as created_at,
             TO_CHAR(updated_at, 'YYYY-MM-DD HH24:MI:SS') as updated_at
      FROM menu_items
      WHERE id = $1`;
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }

  static async getByCategory(category) {
    const query = `
      SELECT id, name, category, description, ingredients, price, image
      FROM menu_items
      WHERE category = $1
      ORDER BY name`;
    const { rows } = await pool.query(query, [category]);
    return rows;
  }

  static async create(itemData) {
    const query = `
      INSERT INTO menu_items (name, category, description, ingredients, price, image)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`;
    const values = [
      itemData.name,
      itemData.category,
      itemData.description,
      itemData.ingredients,
      itemData.price,
      itemData.image
    ];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async update(id, itemData) {
    const query = `
      UPDATE menu_items
      SET name = $1, category = $2, description = $3, 
          ingredients = $4, price = $5, image = $6, updated_at = NOW()
      WHERE id = $7
      RETURNING *`;
    const values = [
      itemData.name,
      itemData.category,
      itemData.description,
      itemData.ingredients,
      itemData.price,
      itemData.image,
      id
    ];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM menu_items WHERE id = $1 RETURNING *';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }
}

export default MenuItem;