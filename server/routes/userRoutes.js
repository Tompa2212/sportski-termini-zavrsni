import express from 'express';
import { getUserInfo } from '../controllers/userController.js';

export const userRouter = express.Router();

userRouter.get('/:id', getUserInfo);
