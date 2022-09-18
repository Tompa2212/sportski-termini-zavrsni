import { Team } from '../models/SportTerm';
import { useUser } from '../providers/authProvider';
import { appRequestLinks } from '../utils/appLinks';
import { useExecuteAction } from './useExecuteAction';
import { useFetch } from './useFetch';

const createFethLink = (sportTermId: string | undefined) => {
  const baseLink = appRequestLinks.sportTerms;

  return `${baseLink}/${sportTermId}/teams`;
};

const createAddPlayerLink = (teamId: string) =>
  `${appRequestLinks.sportTermTeams}${teamId}/add`;

const createRemovePlayerLink = (teamId: string, playerUsername: string) =>
  `${appRequestLinks.sportTermTeams}${teamId}/remove/${playerUsername}`;

export const useSportTermTeams = (sportTermId: string | undefined) => {
  const { data, status, refetchData } = useFetch<{ teams: Team[] }>(
    createFethLink(sportTermId)
  );
  const executeAction = useExecuteAction();
  const user = useUser();

  const teams = data?.teams || [];

  const addPlayer = async (teamId: string) => {
    const isInAnotherTeam = !!teams
      .flatMap((team) => {
        if (team.id === teamId) {
          return [];
        }

        return [team.players];
      })
      .find((players) => players.find((player) => player.id === user?.id));

    if (isInAnotherTeam) {
      await executeAction({
        link: {
          href: createRemovePlayerLink(teamId, user?.username || ''),
          type: 'DELETE',
        },
      });
    }

    await executeAction({
      link: { href: createAddPlayerLink(teamId), type: 'POST' },
      onComplete: () => refetchData(),
    });
  };

  const removePlayer = async (teamId: string, username: string | undefined) => {
    await executeAction({
      link: {
        href: createRemovePlayerLink(teamId, username || ''),
        type: 'DELETE',
      },
      onComplete: () => refetchData(),
    });
  };

  return {
    teams,
    status,
    addPlayer,
    removePlayer,
  };
};
