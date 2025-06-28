import pool, { sqlSanitizer } from '../utils/database';
import { Category } from '../types';

export class CategoryModel {
  static async create(userId: number, name: string): Promise<Category> {
    sqlSanitizer.sanitizeNumber(userId);
    const result = await pool.query(
      'INSERT INTO categories (name, user_id) VALUES ($1, $2) RETURNING *',
      [name, userId]
    );
    return result.rows[0];
  }

  static async findById(categoryId: number, userId: number): Promise<Category | null> {
    sqlSanitizer.sanitizeNumber(categoryId);
    sqlSanitizer.sanitizeNumber(userId);
    const result = await pool.query('SELECT * FROM categories WHERE id = $1 AND user_id = $2', [
      categoryId,
      userId,
    ]);
    return result.rows[0] || null;
  }

  static async findAllByUser(userId: number): Promise<Category[]> {
    sqlSanitizer.sanitizeNumber(userId);
    const result = await pool.query(
      'SELECT * FROM categories WHERE user_id = $1 ORDER BY name ASC',
      [userId]
    );
    return result.rows;
  }

  static async update(categoryId: number, userId: number, name: string): Promise<Category | null> {
    sqlSanitizer.sanitizeNumber(categoryId);
    sqlSanitizer.sanitizeNumber(userId);
    const result = await pool.query(
      'UPDATE categories SET name = $1 WHERE id = $2 AND user_id = $3 RETURNING *',
      [name, categoryId, userId]
    );
    return result.rows[0] || null;
  }

  static async delete(categoryId: number, userId: number): Promise<boolean> {
    sqlSanitizer.sanitizeNumber(categoryId);
    sqlSanitizer.sanitizeNumber(userId);
    const result = await pool.query(
      'DELETE FROM categories WHERE id = $1 AND user_id = $2 RETURNING id',
      [categoryId, userId]
    );
    return (result.rowCount ?? 0) > 0;
  }
}
