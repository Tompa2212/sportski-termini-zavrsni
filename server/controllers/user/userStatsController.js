import { getDriver } from '../../db/neo4j.js';
import { getUserSportStats } from '../../utils/query/user/getUserSportStats.js';
import { StatusCodes } from 'http-status-codes';
import { NotFoundError } from '../../errors/not-found.js';
import { toNativeTypes } from '../../utils/nativeTypes.js';

export const getUserStats = async (req, res) => {
  const session = getDriver().session();
  const { username } = req.params;

  const sportStats = await session.readTransaction(async (tx) => {
    return await getUserSportStats(tx, username);
  });

  if (!sportStats) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: 'No user with provided username.' });
  }

  res.status(StatusCodes.OK).json({ ...sportStats });
};

export const getUserCurrentGames = async (req, res) => {
  const { username } = req.params;

  const session = getDriver().session();

  const resp = await session.readTransaction((tx) =>
    tx.run(
      `
      MATCH (u:User { username: $username })
      MATCH (u)-[:PLAYED_FOR]->(t)<-[:HAS_TEAM]-(sT)-[:HAS_ADDRESS]->(a)
      MATCH (creator)-[:CREATED_SPORT_TERM]->(sT)-[:PLAYED_SPORT]->(s)
      CALL {
        WITH sT
        MATCH (sT)-[:HAS_TEAM]->(t)<-[:PLAYED_FOR]-(player)
        RETURN count(player) AS numOfPlayers
      }
      RETURN sT {
          .*,
          address: a.address,
          city: a.city,
          country: a.country,
          sport: s.name,
          creator: creator.username,
          numOfPlayers: numOfPlayers
      } as sT
    `,
      { username }
    )
  );

  await session.close();

  if (!resp || !resp.records.length) {
    throw new NotFoundError(`No user with username ${username}`);
  }

  const sportTerms = resp.records.map((row) => toNativeTypes(row.get('sT')));

  return res
    .status(StatusCodes.OK)
    .json({ sportTerms, numOfItems: sportTerms.length });
};
