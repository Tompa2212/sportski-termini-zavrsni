type AppFetchLinks = Record<string, string>;

const baseApiLink = 'http://localhost:3000/api/v1';

const links: AppFetchLinks = {
  sportTerms: '/sportTerms/',
  recommendedSportTerms: '/recommendations/sportTerms',
  getUsers: '/users?username=',
  users: '/users/',
  friendRequests: '/friendRequests',
  friends: '/friends/',
  sportTermTeams: '/sportTerms/teams/',
};

export const appRequestLinks = new Proxy(links, {
  get: (target, prop: string) => {
    return `${baseApiLink}${target[prop]}`;
  },
  set: () => {
    return false;
  },
});
