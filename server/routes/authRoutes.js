import express from 'express';
import { register, login } from '../controllers/authController.js';
import multer from 'multer';

export const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
