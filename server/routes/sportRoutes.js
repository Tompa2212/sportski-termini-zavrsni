import express from 'express';
import { getAllSports } from '../controllers/sportsController.js';

export const sportsRouter = express.Router();

sportsRouter.get('/', getAllSports);
