import express from 'express';
import { getRecommendedSportTerms } from '../../controllers/sportTerms/sportTermRecommendationsController.js';
import {
  createSportTerm,
  deleteSportTerm,
  getSportTerm,
  updateSportTerm,
  getAllSportTerms,
} from '../../controllers/sportTerms/sportTermsController.js';

export const sportTermsRouter = express.Router();

sportTermsRouter
  .route('/:id')
  .get(getSportTerm)
  .patch(updateSportTerm)
  .delete(deleteSportTerm);

sportTermsRouter.route('/').post(createSportTerm).get(getAllSportTerms);

sportTermsRouter.get('/recommendations/:id', getRecommendedSportTerms);
