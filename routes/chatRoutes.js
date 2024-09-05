import { Router } from 'express';
import Chat from '../controllers/chat.js';
import verifyToken from '../middleware/authMiddleware.js';

const chatRoutes = Router();
chatRoutes.post('/', verifyToken, Chat.sendChat);
chatRoutes.get('/:userEmail/', verifyToken, Chat.getUserChat);

export default chatRoutes;
