import { StatusCodes } from 'http-status-codes';
import { getDriver } from '../../db/neo4j.js';
import { toNativeTypes } from '../../utils/nativeTypes.js';
import { getUserFavSports } from '../../utils/query/user/getUserFavSports.js';

export const getRecommendedSportTerms = async (req, res) => {
  const { id: userId } = req.params;
  const session = getDriver().session();

  const sportTerms = await session.readTransaction(async (tx) => {
    const favSports = await getUserFavSports(tx, userId);

    const resp = await tx.run(
      `
        MATCH (subject:User {id: $userId})
        MATCH (subject)-[:FRIEND_WITH]-(:User)-[:FRIEND_WITH*0..2]-
        (person:User)-[:PLAYED_FOR]->(t:Team)<-[:HAS_TEAM]-(sT:SportTerm)
        -[:PLAYED_SPORT]-(s:Sport)
        WHERE person<>subject AND sT.played = false AND s.name IN $favSports
        WITH sT, s, count(person) AS score
        MATCH (u:User)-[:CREATED_SPORT_TERM]->(sT)-[:HAS_ADDRESS]->(a:Address)
        OPTIONAL MATCH (sT)-[:HAS_TEAM]-(t)<-[:PLAYED_FOR]-(player)
        WITH sT, u, a, s, score, count(player) AS numOfPlayers
        RETURN sT {
            .*,
            address: a.address,
            city: a.city,
            country: a.country,
            createdBy: u.username,
            sport: s.name,
            numOfPlayers: numOfPlayers
        } as sT
        ORDER BY score
    `,
      { favSports, userId }
    );

    return resp.records.map((row) => toNativeTypes(row.get('sT')));
  });

  await session.close();

  return res
    .status(StatusCodes.OK)
    .json({ sportTerms, numOfItems: sportTerms.length });
};
