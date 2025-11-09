import { Router } from 'express';

import { authenticate } from '../../middlewares/authMiddleware.js';
import { loginUser, me, registerUser } from './user.controller.js';

export const userRouter = Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/me', authenticate, me);
