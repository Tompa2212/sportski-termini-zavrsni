import express from 'express';

import {
  addFriend,
  getUserFriends,
  removeFriend,
} from '../../controllers/social/friendsController.js';

export const friendsRouter = express.Router();

friendsRouter.post('/', addFriend);
friendsRouter.route('/:id').get(getUserFriends).delete(removeFriend);
