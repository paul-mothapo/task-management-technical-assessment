import { Request, Response } from 'express';
import { TaskModel } from '../models/task.model';
import { API_STATUS_CODES, MESSAGES } from '../constants/apiResponses';

export class TaskController {
  static async getTasks(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(API_STATUS_CODES.UNAUTHORIZED).json({ message: MESSAGES.USER_NOT_FOUND });
      }

      const { status, priority, sortBy, sortOrder, dateRange } = req.query;
      
      const tasks = await TaskModel.findAllByUser(userId, {
        status: status as string,
        priority: priority as string,
        sortBy: sortBy as 'createdAt' | 'priority',
        sortOrder: sortOrder as 'asc' | 'desc',
        dateRange: dateRange as string
      });

      res.json({ tasks });
    } catch (error) {
      res.status(API_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: MESSAGES.TASK_NOT_FOUND });
    }
  }

  static async createTask(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(API_STATUS_CODES.UNAUTHORIZED).json({ message: MESSAGES.USER_NOT_FOUND });
      }

      const task = await TaskModel.create(userId, req.body);
      res.status(API_STATUS_CODES.CREATED).json({
        message: MESSAGES.TASK_CREATED,
        task
      });
    } catch (error) {
      res.status(API_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: MESSAGES.TASK_CREATED });
    }
  }

  static async updateTask(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(API_STATUS_CODES.UNAUTHORIZED).json({ message: MESSAGES.USER_NOT_FOUND });
      }

      const taskId = parseInt(req.params.id);
      if (isNaN(taskId)) {
        return res.status(API_STATUS_CODES.BAD_REQUEST).json({ message: MESSAGES.INVALID_TASK_ID });
      }

      const updatedTask = await TaskModel.update(taskId, userId, req.body);
      if (!updatedTask) {
        return res.status(API_STATUS_CODES.NOT_FOUND).json({ message: MESSAGES.TASK_NOT_FOUND });
      }

      res.json({
        message: MESSAGES.TASK_UPDATED,
        task: updatedTask
      });
    } catch (error) {
      res.status(API_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: MESSAGES.TASK_UPDATED });
    }
  }

  static async deleteTask(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(API_STATUS_CODES.UNAUTHORIZED).json({ message: MESSAGES.USER_NOT_FOUND });
      }

      const taskId = parseInt(req.params.id);
      if (isNaN(taskId)) {
        return res.status(API_STATUS_CODES.BAD_REQUEST).json({ message: MESSAGES.INVALID_TASK_ID });
      }

      const deleted = await TaskModel.delete(taskId, userId);
      if (!deleted) {
        return res.status(API_STATUS_CODES.NOT_FOUND).json({ message: MESSAGES.TASK_NOT_FOUND });
      }

      res.json({ message: MESSAGES.TASK_DELETED });
    } catch (error) {
      res.status(API_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: MESSAGES.TASK_DELETED });
    }
  }
} 