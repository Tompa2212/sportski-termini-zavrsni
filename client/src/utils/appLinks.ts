type AppFetchLinks = Record<string, string>;

export const appRequestLinks: AppFetchLinks = {
  sportTerms: 'http://localhost:3000/api/v1/sportTerms/',
  recommendedSportTerms: 'http://localhost:3000/api/v1/sportTerms/recommendations',
  getUsers: 'http://localhost:3000/api/v1/users?username=',
  users: 'http://localhost:3000/api/v1/users/',
  friendRequests: 'http://localhost:3000/api/v1/friendRequests',
  friends: 'http://localhost:3000/api/v1/friends/',
};
