import { Link } from '../models/Link';

type AppFetchLinks = Record<string, string>;

export const appRequestLinks: AppFetchLinks = {
  recommendedSportTerms: 'http://localhost:3000/api/v1/sportTerms/recommendations',

  getUsers: 'http://localhost:3000/api/v1/users?username=',

  friendRequests: 'http://localhost:3000/api/v1/friendRequests',
  friends: 'http://localhost:3000/api/v1/friends',
};
