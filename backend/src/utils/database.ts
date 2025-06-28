import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config(); // @load environment variables

// SQL injection prevention utilities
export const sqlSanitizer = {
  // @sanitize identifiers (table names, column names)
  sanitizeIdentifier: (identifier: string): string => {
    // @only allow alphanumeric characters and underscores
    if (!/^[a-zA-Z0-9_]+$/.test(identifier)) {
      throw new Error('Invalid identifier format');
    }
    return identifier;
  },

  // @order direction
  sanitizeOrderDirection: (direction: string): 'ASC' | 'DESC' => {
    const upperDirection = direction.toUpperCase();
    if (upperDirection !== 'ASC' && upperDirection !== 'DESC') {
      throw new Error('Invalid order direction');
    }
    return upperDirection as 'ASC' | 'DESC';
  },

  // @limit/offset numbers
  sanitizeNumber: (num: number): number => {
    if (!Number.isInteger(num) || num < 0) {
      throw new Error('Invalid number format');
    }
    return num;
  },
};

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
});

export default pool;
