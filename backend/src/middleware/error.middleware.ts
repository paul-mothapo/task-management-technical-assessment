import { Request, Response, NextFunction } from 'express';
import { API_STATUS_CODES, MESSAGES } from '../constants/apiResponses';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(error.stack);

  if (error.name === 'ValidationError') {
    return res.status(API_STATUS_CODES.BAD_REQUEST).json({
      message: MESSAGES.VALIDATION_ERROR,
      details: error.message
    });
  }

  if (error.name === 'UnauthorizedError') {
    return res.status(API_STATUS_CODES.UNAUTHORIZED).json({
      message: MESSAGES.UNAUTHORIZED,
      details: error.message
    });
  }

  return res.status(API_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
    message: MESSAGES.INTERNAL_SERVER_ERROR,
    details: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
}; 