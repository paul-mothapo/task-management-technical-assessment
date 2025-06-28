import { Request, Response } from 'express';
import { CategoryModel } from '../models/category.model';
import { API_STATUS_CODES, MESSAGES } from '../constants/apiResponses';

export class CategoryController {
  static async getCategories(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(API_STATUS_CODES.UNAUTHORIZED).json({ message: MESSAGES.UNAUTHORIZED });
      }

      const categories = await CategoryModel.findAllByUser(userId);
      res.json({ categories });
    } catch (error) {
      res
        .status(API_STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json({ message: MESSAGES.INTERNAL_SERVER_ERROR });
    }
  }

  static async createCategory(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(API_STATUS_CODES.UNAUTHORIZED).json({ message: MESSAGES.UNAUTHORIZED });
      }

      const { name } = req.body;
      const category = await CategoryModel.create(userId, name);
      res.status(API_STATUS_CODES.CREATED).json({
        message: MESSAGES.CATEGORY_CREATED,
        category,
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes('duplicate key')) {
        return res.status(API_STATUS_CODES.BAD_REQUEST).json({
          message: MESSAGES.CATEGORY_ALREADY_EXISTS,
        });
      }
      res
        .status(API_STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json({ message: MESSAGES.INTERNAL_SERVER_ERROR });
    }
  }

  static async updateCategory(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(API_STATUS_CODES.UNAUTHORIZED).json({ message: MESSAGES.UNAUTHORIZED });
      }

      const categoryId = parseInt(req.params.id);
      if (isNaN(categoryId)) {
        return res
          .status(API_STATUS_CODES.BAD_REQUEST)
          .json({ message: MESSAGES.INVALID_CATEGORY_ID });
      }

      const { name } = req.body;
      const category = await CategoryModel.update(categoryId, userId, name);
      if (!category) {
        return res
          .status(API_STATUS_CODES.NOT_FOUND)
          .json({ message: MESSAGES.CATEGORY_NOT_FOUND });
      }

      res.json({
        message: MESSAGES.CATEGORY_UPDATED,
        category,
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes('duplicate key')) {
        return res.status(API_STATUS_CODES.BAD_REQUEST).json({
          message: MESSAGES.CATEGORY_ALREADY_EXISTS,
        });
      }
      res
        .status(API_STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json({ message: MESSAGES.INTERNAL_SERVER_ERROR });
    }
  }

  static async deleteCategory(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(API_STATUS_CODES.UNAUTHORIZED).json({ message: MESSAGES.UNAUTHORIZED });
      }

      const categoryId = parseInt(req.params.id);
      if (isNaN(categoryId)) {
        return res
          .status(API_STATUS_CODES.BAD_REQUEST)
          .json({ message: MESSAGES.INVALID_CATEGORY_ID });
      }

      const deleted = await CategoryModel.delete(categoryId, userId);
      if (!deleted) {
        return res
          .status(API_STATUS_CODES.NOT_FOUND)
          .json({ message: MESSAGES.CATEGORY_NOT_FOUND });
      }

      res.json({ message: MESSAGES.CATEGORY_DELETED });
    } catch (error) {
      res
        .status(API_STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json({ message: MESSAGES.INTERNAL_SERVER_ERROR });
    }
  }
}
