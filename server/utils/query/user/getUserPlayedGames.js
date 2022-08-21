export const getUserPlayedGames = async (tx, userId) => {
  const resp = await tx.run(
    `
    MATCH (u:User {id: $userId})
    OPTIONAL MATCH (u)-[:PLAYED_FOR]->(t)<-[:HAS_TEAM]-(sT)
    WHERE sT.played = false
    RETURN sT.id AS id
  `,
    { userId }
  );

  return resp.records.map((row) => row.get('id'));
};
