import express from 'express';
import {
  createSportTerm,
  deleteSportTerm,
  getSportTerm,
  updateSportTerm,
  getAllSportTerms,
  getSportTermTeams,
} from '../../controllers/sportTerms/sportTermsController.js';

export const sportTermsRouter = express.Router();

sportTermsRouter
  .route('/:id')
  .get(getSportTerm)
  .patch(updateSportTerm)
  .delete(deleteSportTerm);

sportTermsRouter.route('/').post(createSportTerm).get(getAllSportTerms);

sportTermsRouter.get('/:id/teams', getSportTermTeams);
