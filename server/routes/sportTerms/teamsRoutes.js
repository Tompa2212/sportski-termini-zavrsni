import express from 'express';

import {
  getTeam,
  createTeam,
  updateTeam,
} from '../../controllers/sportTerms/teamsController.js';

export const teamsRouter = express.Router();

teamsRouter.route('/:id').get(getTeam).patch(updateTeam);
teamsRouter.post('/', createTeam);
