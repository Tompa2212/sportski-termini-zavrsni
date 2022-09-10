import { StatusCodes } from 'http-status-codes';
import { getDriver } from '../../db/neo4j.js';
import { toNativeTypes } from '../../utils/nativeTypes.js';
import { getUserFavSports } from '../../utils/query/user/getUserFavSports.js';

export const getRecommendedSportTerms = async (req, res) => {
  const { userId } = req.user;

  const session = getDriver().session();

  const sportTerms = await session.readTransaction(async (tx) => {
    const favSports = await getUserFavSports(tx, userId);

    const resp = await tx.run(
      `
        MATCH (subject:User {id: $userId})
        MATCH (subject)-[:FRIEND_WITH]-(:User)-[:FRIEND_WITH*0..2]-
        (person:User)-[:PLAYED_FOR]->(t:Team)<-[:HAS_TEAM]-(sT:SportTerm)
        -[:PLAYED_SPORT]->(s:Sport)
        MATCH (sT)<-[:CREATED_SPORT_TERM]-(creator:User)
        MATCH (sT)-[:HAS_ADDRESS]->(a:Address)
        OPTIONAL MATCH (sT)-[:HAS_TEAM]->(t)<-[:PLAYED_FOR]-(player)
        WHERE person <> subject AND sT.played = false
        AND s.name IN $favSports AND creator <> subject
        WITH subject, sT, s, a, creator, count(person) AS score,
        collect(player) AS players, count(player) AS numOfPlayers
        WHERE NOT subject IN players
        RETURN sT {
            .*,
            address: a.address,
            city: a.city,
            country: a.country,
            createdBy: creator.username,
            sport: s.name,
            numOfPlayers: numOfPlayers
        } as sT
        ORDER BY score DESC
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
