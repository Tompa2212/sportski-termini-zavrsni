import express from 'express';
import { getRecommendedFriends } from '../controllers/social/friendsRecommendationsController.js';
import { getRecommendedSportTerms } from '../controllers/sportTerms/sportTermRecommendationsController.js';

export const recommendationsRouter = express.Router();

recommendationsRouter.get('/sportTerms', getRecommendedSportTerms);
recommendationsRouter.get('/friends', getRecommendedFriends);
