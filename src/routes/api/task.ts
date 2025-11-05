import Express from 'express';
import TaskController from '../../controllers/task-controller'; 
import { createTaskSchema, updateTaskSchema } from '../../validators/task-validator';
import { validate } from '../../middlewares/body-validation.js';
const router = Express.Router();

// create task
router.post('/', validate(createTaskSchema), TaskController.create);
router.get('/all', TaskController.getAll);
router.get('/:id', TaskController.getById);
router.put('/:id', validate(updateTaskSchema), TaskController.update);
router.delete('/:id', TaskController.delete);


export default router;