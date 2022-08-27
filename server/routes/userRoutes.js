import express from 'express';
import {
  getUserInfo,
  getUsers,
  getUserStats,
} from '../controllers/userController.js';

export const userRouter = express.Router();

userRouter.get('/', getUsers);
userRouter.get('/:id', getUserInfo);
userRouter.get('/stats/:id', getUserStats);
