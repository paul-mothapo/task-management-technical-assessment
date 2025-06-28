import pool, { sqlSanitizer } from '../utils/database';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Task, CreateTaskRequest, UpdateTaskRequest, Category } from '../types';

interface FindAllOptions {
  status?: string;
  priority?: string;
  sortBy?: 'createdAt' | 'priority' | 'dueDate';
  sortOrder?: 'asc' | 'desc';
  dateRange?: string;
}

export class TaskModel {
  static async create(userId: number, task: CreateTaskRequest): Promise<Task> {
    const client = await pool.connect();
    let createdTask: Task;
    try {
      await client.query('BEGIN');

      // Insert task
      const taskResult = await client.query(
        `INSERT INTO tasks (title, description, status, priority, due_date, user_id) 
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [
          task.title,
          task.description,
          task.status || 'pending',
          task.priority || 'medium',
          task.due_date ? new Date(task.due_date) : null,
          userId,
        ]
      );

      const newTask = taskResult.rows[0];

      // Add categories if provided
      if (task.category_ids && task.category_ids.length > 0) {
        const values = task.category_ids.map((_, i) => `($1, $${i + 2})`).join(', ');
        await client.query(`INSERT INTO task_categories (task_id, category_id) VALUES ${values}`, [
          newTask.id,
          ...task.category_ids,
        ]);
      }

      await client.query('COMMIT');

      // Fetch task with categories
      const fetchedTask = await this.findById(newTask.id, userId);
      if (!fetchedTask) throw new Error('Failed to fetch created task');
      createdTask = fetchedTask;
      return createdTask;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async findById(taskId: number, userId: number): Promise<Task | null> {
    const result = await pool.query(
      `SELECT t.*, 
              COALESCE(json_agg(c.*) FILTER (WHERE c.id IS NOT NULL), '[]') as categories
       FROM tasks t
       LEFT JOIN task_categories tc ON t.id = tc.task_id
       LEFT JOIN categories c ON tc.category_id = c.id
       WHERE t.id = $1 AND t.user_id = $2
       GROUP BY t.id`,
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

  static async findAllByUser(
    userId: number,
    options: FindAllOptions = {}
  ): Promise<{ tasks: Task[]; total: number }> {
    const values: (number | string)[] = [userId];
    let valueCounter = 1;

    // Sanitize userId
    sqlSanitizer.sanitizeNumber(userId);

    // @build WHERE clause
    let whereClause = 'WHERE t.user_id = $1';
    if (options.status) {
      valueCounter++;
      whereClause += ` AND t.status = $${valueCounter}`;
      values.push(options.status);
    }
    if (options.priority) {
      valueCounter++;
      whereClause += ` AND t.priority = $${valueCounter}`;
      values.push(options.priority);
    }
    if (options.dateRange) {
      const dateCondition = this.getDateRangeCondition(options.dateRange);
      if (dateCondition) {
        whereClause += ` AND ${dateCondition}`;
      }
    }

    // @build ORDER BY clause with sanitization
    let orderByClause = '';
    if (options.sortBy === 'priority') {
      const orderDir = options.sortOrder
        ? sqlSanitizer.sanitizeOrderDirection(options.sortOrder)
        : 'DESC';
      orderByClause = `
        ORDER BY
        CASE t.priority 
          WHEN 'high' THEN 1 
          WHEN 'medium' THEN 2 
          WHEN 'low' THEN 3 
        END ${orderDir === 'ASC' ? 'DESC' : 'ASC'}`;
    } else if (options.sortBy === 'dueDate') {
      const orderDir = options.sortOrder
        ? sqlSanitizer.sanitizeOrderDirection(options.sortOrder)
        : 'DESC';
      orderByClause = `ORDER BY t.due_date ${orderDir} NULLS LAST`;
    } else {
      const orderDir = options.sortOrder
        ? sqlSanitizer.sanitizeOrderDirection(options.sortOrder)
        : 'DESC';
      orderByClause = `ORDER BY t.created_at ${orderDir}`;
    }

    // @get total count
    const countQuery = `
      SELECT COUNT(*) as total 
      FROM tasks t
      ${whereClause}
    `;
    const countResult = await pool.query(countQuery, values);
    const total = parseInt(countResult.rows[0].total);

    // @get tasks with categories
    const query = `
      SELECT t.*, 
             COALESCE(json_agg(c.*) FILTER (WHERE c.id IS NOT NULL), '[]') as categories
      FROM tasks t
      LEFT JOIN task_categories tc ON t.id = tc.task_id
      LEFT JOIN categories c ON tc.category_id = c.id
      ${whereClause}
      GROUP BY t.id
      ${orderByClause}
    `;

    const result = await pool.query(query, values);

    return {
      tasks: result.rows,
      total,
    };
  }

  static async update(
    taskId: number,
    userId: number,
    updates: UpdateTaskRequest
  ): Promise<Task | null> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

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
      if (updates.due_date !== undefined) {
        updateFields.push(`due_date = $${valueCounter}`);
        values.push(updates.due_date ? new Date(updates.due_date) : null);
        valueCounter++;
      }

      updateFields.push(`updated_at = CURRENT_TIMESTAMP`);

      if (updateFields.length > 0) {
        values.push(taskId, userId);
        const query = `
          UPDATE tasks 
          SET ${updateFields.join(', ')}
          WHERE id = $${valueCounter} AND user_id = $${valueCounter + 1}
          RETURNING *
        `;
        await client.query(query, values);
      }

      // Update categories if provided
      if (updates.category_ids !== undefined) {
        // Remove existing categories
        await client.query('DELETE FROM task_categories WHERE task_id = $1', [taskId]);

        // Add new categories
        if (updates.category_ids.length > 0) {
          const values = updates.category_ids.map((_, i) => `($1, $${i + 2})`).join(', ');
          await client.query(
            `INSERT INTO task_categories (task_id, category_id) VALUES ${values}`,
            [taskId, ...updates.category_ids]
          );
        }
      }

      await client.query('COMMIT');

      // Fetch updated task with categories
      return this.findById(taskId, userId);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async delete(taskId: number, userId: number): Promise<boolean> {
    const result = await pool.query(
      'DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING id',
      [taskId, userId]
    );
    return (result.rowCount ?? 0) > 0;
  }

  static async findDueTasksForReminders(): Promise<Task[]> {
    const result = await pool.query(
      `SELECT t.*, 
              COALESCE(json_agg(c.*) FILTER (WHERE c.id IS NOT NULL), '[]') as categories
       FROM tasks t
       LEFT JOIN task_categories tc ON t.id = tc.task_id
       LEFT JOIN categories c ON tc.category_id = c.id
       WHERE t.due_date IS NOT NULL 
         AND t.due_date > CURRENT_TIMESTAMP 
         AND t.due_date <= CURRENT_TIMESTAMP + INTERVAL '1 day'
         AND t.reminder_sent = false
       GROUP BY t.id`
    );
    return result.rows;
  }

  static async markReminderSent(taskId: number): Promise<void> {
    await pool.query('UPDATE tasks SET reminder_sent = true WHERE id = $1', [taskId]);
  }
}
