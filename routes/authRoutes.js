import { Router } from 'express';
import Auth from '../controllers/auth.js';

const authRoutes = Router();

authRoutes.post('/login', Auth.login);

export default authRoutes;
