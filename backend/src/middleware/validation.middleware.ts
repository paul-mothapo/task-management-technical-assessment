import { Request, Response, NextFunction } from 'express';
import { RegisterRequest, LoginRequest, CreateTaskRequest, UpdateTaskRequest } from '../types';
import { API_STATUS_CODES } from '../constants/apiResponses';

export const validateRegister = (req: Request, res: Response, next: NextFunction) => {
  const { email, password, name }: RegisterRequest = req.body;

  if (!email || !password || !name) {
    return res.status(API_STATUS_CODES.BAD_REQUEST).json({ message: 'All fields are required' });
  }

  if (!email.includes('@')) {
    return res.status(API_STATUS_CODES.BAD_REQUEST).json({ message: 'Invalid email format' });
  }

  if (password.length < 6) {
    return res
      .status(API_STATUS_CODES.BAD_REQUEST)
      .json({ message: 'Password must be at least 6 characters long' });
  }

  next();
};

export const validateLogin = (req: Request, res: Response, next: NextFunction) => {
  const { email, password }: LoginRequest = req.body;

  if (!email || !password) {
    return res
      .status(API_STATUS_CODES.BAD_REQUEST)
      .json({ message: 'Email and password are required' });
  }

  next();
};

export const validateCreateTask = (req: Request, res: Response, next: NextFunction) => {
  const task: CreateTaskRequest = req.body;

  if (!task.title) {
    return res.status(API_STATUS_CODES.BAD_REQUEST).json({ message: 'Task title is required' });
  }

  if (task.status && !['pending', 'in_progress', 'completed'].includes(task.status)) {
    return res.status(API_STATUS_CODES.BAD_REQUEST).json({ message: 'Invalid task status' });
  }

  if (task.priority && !['low', 'medium', 'high'].includes(task.priority)) {
    return res.status(API_STATUS_CODES.BAD_REQUEST).json({ message: 'Invalid task priority' });
  }

  if (task.due_date) {
    const dueDate = new Date(task.due_date);
    if (isNaN(dueDate.getTime())) {
      return res.status(API_STATUS_CODES.BAD_REQUEST).json({ message: 'Invalid due date format' });
    }
  }

  next();
};

export const validateUpdateTask = (req: Request, res: Response, next: NextFunction) => {
  const updates: UpdateTaskRequest = req.body;

  if (Object.keys(updates).length === 0) {
    return res.status(API_STATUS_CODES.BAD_REQUEST).json({ message: 'No updates provided' });
  }

  if (updates.status && !['pending', 'in_progress', 'completed'].includes(updates.status)) {
    return res.status(API_STATUS_CODES.BAD_REQUEST).json({ message: 'Invalid task status' });
  }

  if (updates.priority && !['low', 'medium', 'high'].includes(updates.priority)) {
    return res.status(API_STATUS_CODES.BAD_REQUEST).json({ message: 'Invalid task priority' });
  }

  if (updates.due_date) {
    const dueDate = new Date(updates.due_date);
    if (isNaN(dueDate.getTime())) {
      return res.status(API_STATUS_CODES.BAD_REQUEST).json({ message: 'Invalid due date format' });
    }
  }

  next();
};

export const validateCreateCategory = (req: Request, res: Response, next: NextFunction) => {
  const { name } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(API_STATUS_CODES.BAD_REQUEST).json({ message: 'Category name is required' });
  }

  if (name.length > 50) {
    return res.status(API_STATUS_CODES.BAD_REQUEST).json({ message: 'Category name is too long' });
  }

  next();
};

export const validateUpdateCategory = (req: Request, res: Response, next: NextFunction) => {
  const { name } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(API_STATUS_CODES.BAD_REQUEST).json({ message: 'Category name is required' });
  }

  if (name.length > 50) {
    return res.status(API_STATUS_CODES.BAD_REQUEST).json({ message: 'Category name is too long' });
  }

  next();
};
