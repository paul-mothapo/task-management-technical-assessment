import pool, { sqlSanitizer } from '../utils/database';
import { User } from '../types';
import bcrypt from 'bcrypt';

export class UserModel {
  static async create(email: string, password: string, name: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING *',
      [email.toLowerCase(), hashedPassword, name]
    );
    return result.rows[0];
  }

  static async findByEmail(email: string): Promise<User | null> {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email.toLowerCase()]);
    return result.rows[0] || null;
  }

  static async findById(id: number): Promise<User | null> {
    sqlSanitizer.sanitizeNumber(id);
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0] || null;
  }
}
