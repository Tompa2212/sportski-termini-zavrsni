import express from 'express';
import {
  getUserInfo,
  getUsers,
  getUserStats,
  updateUser,
} from '../controllers/userController.js';

export const userRouter = express.Router();

userRouter.get('/', getUsers);
userRouter.get('/:id', getUserInfo);
userRouter.get('/stats/:id', getUserStats);

userRouter.get('/edit', updateUser);
