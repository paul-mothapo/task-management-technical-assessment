import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWTPayload } from '../types';
import { API_STATUS_CODES, MESSAGES } from '../constants/apiResponses';

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(API_STATUS_CODES.UNAUTHORIZED).json({ message: MESSAGES.USER_NOT_FOUND });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as JWTPayload;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(API_STATUS_CODES.UNAUTHORIZED).json({ message: MESSAGES.INVALID_TOKEN });
  }
}; 