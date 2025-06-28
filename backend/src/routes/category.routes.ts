import { Router } from 'express';
import { CategoryController } from '../controllers/category.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import {
  validateCreateCategory,
  validateUpdateCategory,
} from '../middleware/validation.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/', CategoryController.getCategories);
router.post('/', validateCreateCategory, CategoryController.createCategory);
router.put('/:id', validateUpdateCategory, CategoryController.updateCategory);
router.delete('/:id', CategoryController.deleteCategory);

export default router;
