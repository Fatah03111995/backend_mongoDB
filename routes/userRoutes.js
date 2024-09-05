import { Router } from 'express';
import UserController from '../controllers/user.js';
import verifyToken from '../middleware/authMiddleware.js';

const userRoutes = Router();
userRoutes.post('/:userId', verifyToken, UserController.getUserById);
userRoutes.post('/', verifyToken, UserController.getUserByList);

export default userRoutes;
