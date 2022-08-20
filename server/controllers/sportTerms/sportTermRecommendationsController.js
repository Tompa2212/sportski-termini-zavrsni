import { StatusCodes } from 'http-status-codes';
import { getDriver } from '../../db/neo4j.js';
import { toNativeTypes } from '../../utils/nativeTypes.js';
import { getUserFavSports } from '../../utils/query.js';

export const getRecommendedSportTerms = async (req, res) => {
  const { id: userId } = req.params;
  const session = getDriver().session();

  const sportTerms = await session.readTransaction(async (tx) => {
    const favSports = await getUserFavSports(tx, userId);

    const resp = await tx.run(
      `
        MATCH (subject:User {id: $userId})
        MATCH (subject)-[:FRIEND_WITH]-(:User)-[:FRIEND_WITH*0..2]-(:User)
        -[:FRIEND_WITH]-(person:User)-[:PLAYED_FOR]->(t:Team)<-[:HAS_TEAM]-(sT:SportTerm)
        -[:PLAYED_SPORT]-(s:Sport)
        WHERE person<>subject AND sT.played = false AND s.name IN $favSports
        WITH sT, count(person) AS score
        MATCH (sT)-[:HAS_ADDRESS]->(a:Address)
        MATCH (sT)<-[:CREATED_SPORT_TERM]-(u:User)
        RETURN sT {
            .*,
            address: a.address,
            city: a.city,
            country: a.country,
            score: score,
            createdBy: u.username
        } as sT
    `,
      { favSports, userId }
    );

    return resp.records.map((row) => toNativeTypes(row.get('sT')));
  });

  await session.close();

  return res
    .status(StatusCodes.OK)
    .json({ data: sportTerms, numOfItems: sportTerms.length });
};
