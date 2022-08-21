import { toNativeTypes } from '../../nativeTypes.js';

export const getUserSportStats = async (tx, userId) => {
  const resp = await tx.run(
    `
        MATCH (u:User {id: $userId})
        MATCH (u)-[:PLAYED_FOR]->(t)
        <-[:HAS_TEAM]-(sT)-[:PLAYED_SPORT]-(s)
        WITH s, count(sT) AS numOfGames, count(CASE t.gameResult WHEN 'W' THEN 1 ELSE NULL END) AS winnedGames
        RETURN {
            name: s.name,
            numOfGames: numOfGames,
            winnedGames: winnedGames
        } AS s
        ORDER BY numOfGames DESC
    `,
    { userId }
  );

  if (!resp) {
    return null;
  }

  return resp.records.map((row) => toNativeTypes(row.get('s')));
};
