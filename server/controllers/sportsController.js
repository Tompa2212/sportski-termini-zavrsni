import { StatusCodes } from 'http-status-codes';
import { getDriver } from '../db/neo4j.js';
import { CustomAPIError } from '../errors/custom-api.js';
import { toNativeTypes } from '../utils/nativeTypes.js';

export const getAllSports = async (req, res) => {
  const { mostPopular } = req.query;

  const sortByMostPopular = mostPopular === 'true';

  const session = getDriver().session();

  const resp = await session.readTransaction((tx) => {
    if (sortByMostPopular) {
      return tx.run(`
        MATCH (s:Sport)
        OPTIONAL MATCH (s)<-[rf:HAS_FAVORITE_SPORT]-()
        OPTIONAL MATCH (s)<-[rp:PLAYED_SPORT]-()
        WITH s , count(DISTINCT rp) AS playedGames, COUNT(DISTINCT rf) AS userFavorite
        RETURN s {
            .*,
            playedGames: playedGames,
            userFavorite: userFavorite
        }
        ORDER BY playedGames DESC, userFavorite DESC
        `);
    }

    return tx.run(`
    MATCH (s:Sport) 
    RETURN properties(s) AS s
    ORDER BY s.name`);
  });

  await session.close();

  if (!resp) {
    throw new CustomAPIError('Unable to get sports. Please try again.');
  }

  const sports = resp.records.map((sport) => toNativeTypes(sport.get('s')));

  return res.status(StatusCodes.OK).json({ sports });
};
