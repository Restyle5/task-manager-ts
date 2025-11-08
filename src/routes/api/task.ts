import Express from 'express';
import TaskController from '../../controllers/task-controller'; 
import { createTaskSchema, updateTaskSchema } from '../../validators/task-validator';
import { validate } from '../../middlewares/body-validation.js';
const router = Express.Router();

const taskController = new TaskController();

// create task
router.post('/', validate(createTaskSchema), taskController.create);
router.get('/all', taskController.getAll);
router.get('/:id', taskController.getById);
router.get('/', taskController.paginate);
router.put('/:id', validate(updateTaskSchema), taskController.update);
router.delete('/:id', taskController.delete);

export default router;