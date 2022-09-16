import express from 'express';

import {
  getTeam,
  createTeam,
  updateTeam,
  addPlayerToTeam,
  removePlayer,
} from '../../controllers/sportTerms/teamsController.js';

export const teamsRouter = express.Router();

teamsRouter.delete('/:id/remove/:username', removePlayer);
teamsRouter.route('/:id').get(getTeam).patch(updateTeam);
teamsRouter.post('/', createTeam);

teamsRouter.post('/:id/add', addPlayerToTeam);
