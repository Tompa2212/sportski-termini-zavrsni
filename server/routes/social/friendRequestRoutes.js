import express from 'express';

import {
  sendFriendRequest,
  deleteFriendRequest,
  getUserFriendRequests,
} from '../../controllers/social/friendRequestsController.js';

export const friendRequestsRouter = express.Router();

friendRequestsRouter.post('/', sendFriendRequest);
friendRequestsRouter.post('/remove', deleteFriendRequest);
friendRequestsRouter.get('/', getUserFriendRequests);
