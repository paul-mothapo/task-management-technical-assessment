import { Request, Response } from 'express';
import { UserModel } from '../models/user.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { API_STATUS_CODES, MESSAGES } from '../constants/apiResponses';

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { email, password, name } = req.body;

      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        return res.status(API_STATUS_CODES.BAD_REQUEST).json({ message: MESSAGES.EMAIL_ALREADY_REGISTERED });
      }

      const user = await UserModel.create(email, password, name);
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET || '',
        { expiresIn: '24h' }
      );

      res.status(201).json({
        message: MESSAGES.USER_CREATED,
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        }
      });
    } catch (error) {
      res.status(API_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: MESSAGES.USER_CREATED });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const user = await UserModel.findByEmail(email);
      if (!user) {
        return res.status(API_STATUS_CODES.UNAUTHORIZED).json({ message: MESSAGES.INVALID_CREDENTIALS });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(API_STATUS_CODES.UNAUTHORIZED).json({ message: MESSAGES.INVALID_CREDENTIALS });
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET || '',
        { expiresIn: '24h' }
      );

      res.json({
        message: MESSAGES.LOGIN_SUCCESS,
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        }
      });
    } catch (error) {
      res.status(API_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: MESSAGES.LOGIN_SUCCESS });
    }
  }

  static async getProfile(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(API_STATUS_CODES.UNAUTHORIZED).json({ message: MESSAGES.USER_NOT_FOUND });
      }

      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(API_STATUS_CODES.NOT_FOUND).json({ message: MESSAGES.USER_NOT_FOUND });
      }

      res.json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        }
      });
    } catch (error) {
      res.status(API_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: MESSAGES.USER_NOT_FOUND });
    }
  }
}