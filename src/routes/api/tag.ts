import Express from 'express';
import TagController from '../../controllers/tag-controller.js';
import { createTagSchema, updateTagSchema } from '../../validators/tag-validator.js';
import { validate } from '../../middlewares/body-validation.js';

const router = Express.Router();

const Tag = new TagController();

router.post('/', validate(createTagSchema), Tag.create);
router.get('/all', Tag.getAll);
router.get('/', Tag.paginate)
router.put('/:id', validate(updateTagSchema), Tag.update);
router.delete('/:id', Tag.delete);

export default router;