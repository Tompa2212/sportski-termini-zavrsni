import { toNativeTypes } from '../../nativeTypes.js';

export const getUserSportStats = async (tx, username) => {
  const statsTotal = await tx.run(
    `
    MATCH (u:User {username: $username})-[:PLAYED_FOR]->(t)<-[:HAS_TEAM]-(sT)
    WHERE sT.played = true AND t.gameResult IS NOT NULL
    WITH count(sT) AS numOfGames, count(CASE t.gameResult WHEN 'W' THEN 1 ELSE NULL END) AS winnedGames
    RETURN {
      played: numOfGames,
      won: winnedGames,
      lost: numOfGames - winnedGames
    } AS stats
  `,
    { username }
  );

  const statsPerSport = await tx.run(
    `
        MATCH (u:User {username: $username})
        MATCH (u)-[:PLAYED_FOR]->(t)
        <-[:HAS_TEAM]-(sT)-[:PLAYED_SPORT]-(s)
        WHERE sT.played = true AND t.gameResult IS NOT NULL
        WITH s, count(sT) AS numOfGames, count(CASE t.gameResult WHEN 'W' THEN 1 ELSE NULL END) AS winnedGames
        RETURN {
            name: s.name,
            played: numOfGames,
            won: winnedGames,
            lost: numOfGames - winnedGames
        } AS stats
        ORDER BY numOfGames DESC
    `,
    { username }
  );

  if (!statsPerSport) {
    return null;
  }

  return {
    ...toNativeTypes(statsTotal.records[0].get('stats')),
    perSport: statsPerSport.records.map((row) => toNativeTypes(row.get('stats'))),
  };
};
