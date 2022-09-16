import { BadRequestError } from '../errors/bad-request.js';
import { NotFoundError } from '../errors/not-found.js';
import { toNativeTypes } from './nativeTypes.js';

export const validateNumOfPlayers = async (tx, teamId, userToAdd) => {
  const resp = await tx.run(
    `
        MATCH (t:Team {id: $teamId})<-[:HAS_TEAM]-(st)
        OPTIONAL MATCH (t)<-[:PLAYED_FOR]-(player)
        WITH st, collect(player { .username } ) AS players
        RETURN  {
          playersPerTeam: st.playersPerTeam,
          players: players
        } AS data
    `,
    { teamId }
  );

  if (!resp || !resp.records[0]) {
    throw new NotFoundError(`No team with id: ${teamId}`);
  }

  const { playersPerTeam, players } = toNativeTypes(resp.records[0].get('data'));

  console.log(playersPerTeam, players);

  if (playersPerTeam === players?.length) {
    throw new BadRequestError(
      `Maximum number of players per team exceeded. Allowed: ${playersPerTeam}`
    );
  }

  if (players?.find((player) => player.username === userToAdd)) {
    throw new BadRequestError(
      `Player already in another team in the same sport term`
    );
  }
};
