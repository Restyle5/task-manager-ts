import { authMiddleware } from '../../middlewares/auth.js';
import auth from './auth.js';
import Express from 'express';

import taskRouter from './task.js';


const router = Express.Router();
const protectedRoute = Express.Router();

// protected routes via authMiddleware
protectedRoute.use('/task', taskRouter);

router.use('/auth', auth);
router.use('/' , authMiddleware, protectedRoute);


export default router;