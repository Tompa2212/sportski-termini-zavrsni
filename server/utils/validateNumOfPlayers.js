import { BadRequestError } from '../errors/bad-request.js';
import { NotFoundError } from '../errors/not-found.js';

export const validateNumOfPlayers = async (tx, sportTermId, players) => {
  const resp = await tx.run(
    `
        MATCH (sT {id: $sportTermId})
        RETURN sT.maxPlayersPerTeam as maxPlayers
    `,
    { sportTermId }
  );

  if (!resp || !resp.records[0]) {
    throw new NotFoundError(`No tean with id: ${sportTermId}`);
  }

  const playersPerTeam = resp.records[0].get('maxPlayers');

  if (playersPerTeam && players.length > playersPerTeam) {
    throw new BadRequestError(
      `Maximum number of players per team exceeded. Allowed: ${playersPerTeam}`
    );
  }
};
