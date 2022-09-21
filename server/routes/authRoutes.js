import express from 'express';
import { register, login } from '../controllers/authController.js';
import fileUpload from 'express-fileupload';

export const authRouter = express.Router();

authRouter.use(fileUpload({ useTempFiles: true }));

authRouter.post('/register', register);
authRouter.post('/login', login);
