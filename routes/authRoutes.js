import { Router } from 'express';
import Auth from '../controllers/auth.js';

const authRoutes = Router();

authRoutes.post('/register', Auth.login);
authRoutes.post('/login', Auth.register);

export default authRoutes;
