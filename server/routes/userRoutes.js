import express from 'express';
import { getUserInfo, getUsers } from '../controllers/userController.js';

export const userRouter = express.Router();

userRouter.get('/', getUsers);
userRouter.get('/:id', getUserInfo);
