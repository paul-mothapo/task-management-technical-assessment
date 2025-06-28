import pool from '../utils/database';
import { Task, CreateTaskRequest, UpdateTaskRequest } from '../types';

interface FindAllOptions {
  status?: string;
  priority?: string;
  sortBy?: 'createdAt' | 'priority';
  sortOrder?: 'asc' | 'desc';
  dateRange?: string;
}

export class TaskModel {
  static async create(userId: number, task: CreateTaskRequest): Promise<Task> {
    const result = await pool.query(
      `INSERT INTO tasks (title, description, status, priority, user_id) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [
        task.title,
        task.description,
        task.status || 'pending',
        task.priority || 'medium',
        userId
      ]
    );
    return result.rows[0];
  }

  static async findById(taskId: number, userId: number): Promise<Task | null> {
    const result = await pool.query(
      'SELECT * FROM tasks WHERE id = $1 AND user_id = $2',
      [taskId, userId]
    );
    return result.rows[0] || null;
  }

  private static getDateRangeCondition(dateRange: string): string {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    switch (dateRange) {
      case 'today':
        return `DATE(created_at) = CURRENT_DATE`;
      
      case 'yesterday':
        return `DATE(created_at) = CURRENT_DATE - INTERVAL '1 day'`;
      
      case 'this_week':
        return `DATE_TRUNC('week', created_at) = DATE_TRUNC('week', CURRENT_DATE)`;
      
      case 'last_week':
        return `
          DATE_TRUNC('week', created_at) = 
          DATE_TRUNC('week', CURRENT_DATE - INTERVAL '1 week')
        `;
      
      case 'this_month':
        return `DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE)`;
      
      case 'last_month':
        return `
          DATE_TRUNC('month', created_at) = 
          DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
        `;
      
      default:
        return '';
    }
  }

  static async findAllByUser(userId: number, options: FindAllOptions = {}): Promise<{ tasks: Task[], total: number }> {
    console.log('Finding tasks with options:', options);
    
    const values: (number | string)[] = [userId];
    let valueCounter = 1;

    // @build WHERE clause
    let whereClause = 'WHERE user_id = $1';
    if (options.status) {
      valueCounter++;
      whereClause += ` AND status = $${valueCounter}`;
      values.push(options.status);
    }
    if (options.priority) {
      valueCounter++;
      whereClause += ` AND priority = $${valueCounter}`;
      values.push(options.priority);
    }
    if (options.dateRange) {
      const dateCondition = this.getDateRangeCondition(options.dateRange);
      if (dateCondition) {
        whereClause += ` AND ${dateCondition}`;
      }
    }

    // @build ORDER BY clause
    let orderByClause = 'ORDER BY ';
    if (options.sortBy === 'priority') {
      // @custom priority order: high -> medium -> low
      orderByClause += `
        CASE priority 
          WHEN 'high' THEN 1 
          WHEN 'medium' THEN 2 
          WHEN 'low' THEN 3 
        END ${options.sortOrder === 'asc' ? 'DESC' : 'ASC'}, 
        created_at DESC`;
    } else {
      // @default sort by created_at
      orderByClause += `created_at ${options.sortOrder === 'asc' ? 'ASC' : 'DESC'}`;
    }

    // @get total count
    const countQuery = `
      SELECT COUNT(*) as total 
      FROM tasks 
      ${whereClause}
    `;
    const countResult = await pool.query(countQuery, values);
    const total = parseInt(countResult.rows[0].total);

    // @get all results without pagination for now
    const query = `
      SELECT * FROM tasks 
      ${whereClause}
      ${orderByClause}
    `;

    const result = await pool.query(query, values);

    return {
      tasks: result.rows,
      total
    };
  }

  static async update(taskId: number, userId: number, updates: UpdateTaskRequest): Promise<Task | null> {
    const existingTask = await this.findById(taskId, userId);
    if (!existingTask) return null;

    const updateFields = [];
    const values = [];
    let valueCounter = 1;

    if (updates.title !== undefined) {
      updateFields.push(`title = $${valueCounter}`);
      values.push(updates.title);
      valueCounter++;
    }
    if (updates.description !== undefined) {
      updateFields.push(`description = $${valueCounter}`);
      values.push(updates.description);
      valueCounter++;
    }
    if (updates.status !== undefined) {
      updateFields.push(`status = $${valueCounter}`);
      values.push(updates.status);
      valueCounter++;
    }
    if (updates.priority !== undefined) {
      updateFields.push(`priority = $${valueCounter}`);
      values.push(updates.priority);
      valueCounter++;
    }

    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);

    if (updateFields.length === 0) return existingTask;

    values.push(taskId, userId);
    const query = `
      UPDATE tasks 
      SET ${updateFields.join(', ')}
      WHERE id = $${valueCounter} AND user_id = $${valueCounter + 1}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async delete(taskId: number, userId: number): Promise<boolean> {
    const result = await pool.query(
      'DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING id',
      [taskId, userId]
    );
    return (result.rowCount ?? 0) > 0;
  }
} 