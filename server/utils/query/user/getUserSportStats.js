import { toNativeTypes } from '../../nativeTypes.js';

export const getUserSportStats = async (tx, userId) => {
  const statsTotal = await tx.run(`
    MATCH (u:User)-[:PLAYED_FOR]->(t)<-[:HAS_TEAM]-(sT)
    WHERE sT.played = true
    WITH count(sT) AS numOfGames, count(CASE t.gameResult WHEN 'W' THEN 1 ELSE NULL END) AS winnedGames
    RETURN {
      played: numOfGames,
      won: winnedGames,
      lost: numOfGames - winnedGames
    } AS stats
  `);

  const statsPerSport = await tx.run(
    `
        MATCH (u:User {id: $userId})
        MATCH (u)-[:PLAYED_FOR]->(t)
        <-[:HAS_TEAM]-(sT)-[:PLAYED_SPORT]-(s)
        WHERE sT.played = true
        WITH s, count(sT) AS numOfGames, count(CASE t.gameResult WHEN 'W' THEN 1 ELSE NULL END) AS winnedGames
        RETURN {
            name: s.name,
            played: numOfGames,
            won: winnedGames,
            lost: numOfGames - winnedGames
        } AS stats
        ORDER BY numOfGames DESC
    `,
    { userId }
  );

  if (!statsPerSport) {
    return null;
  }

  return {
    ...toNativeTypes(statsTotal.records[0].get('stats')),
    perSport: statsPerSport.records.map((row) => toNativeTypes(row.get('stats'))),
  };
};
