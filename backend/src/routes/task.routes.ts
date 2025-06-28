import { Router } from 'express';
import { TaskController } from '../controllers/task.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validateCreateTask, validateUpdateTask } from '../middleware/validation.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/', TaskController.getTasks);
router.post('/', validateCreateTask, TaskController.createTask);
router.put('/:id', validateUpdateTask, TaskController.updateTask);
router.delete('/:id', TaskController.deleteTask);

export default router;
