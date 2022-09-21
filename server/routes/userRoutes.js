import express from 'express';
import {
  getUserInfo,
  initializeUser,
  searchUsers,
  updateUser,
} from '../controllers/user/userController.js';
import {
  getUserCurrentGames,
  getUserStats,
} from '../controllers/user/userStatsController.js';

export const userRouter = express.Router();

userRouter.get('/', searchUsers);

userRouter.get('/:id', getUserInfo);
userRouter.patch('/:id', updateUser);
userRouter.post('/initialize', initializeUser);

userRouter.get('/:username/stats', getUserStats);
userRouter.get('/:username/games', getUserCurrentGames);
