import { Router } from 'express';
import Chat from '../controllers/chat.js';

const chatRoutes = Router();
chatRoutes.post('/', Chat.sendChat);
chatRoutes.get('/:userId/:toId', Chat.getUserChatToSpesific);

export default chatRoutes;
