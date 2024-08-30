import { Router } from 'express';
import Chat from '../controllers/chat.js';

const chatRoutes = Router();
chatRoutes.post('/', Chat.sendChat);
chatRoutes.get('/:userEmail/', Chat.getUserChat);

export default chatRoutes;
