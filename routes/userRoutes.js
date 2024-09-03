import { Router } from 'express';
import UserController from '../controllers/user.js';

const userRoutes = Router();
userRoutes.post('/:userId', UserController.getUserById);
userRoutes.post('/', UserController.getUserByList);

export default userRoutes;
