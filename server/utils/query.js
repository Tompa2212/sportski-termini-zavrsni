/**
 * Deletes old players of wanted team and creates
 * new players for the team
 * @param {*} tx DB transaction object
 * @param {*} teamId ID of team
 * @param {*} players Array of player objects(id required)
 * @returns undefined
 */
export const setPlayersOfTeam = async (tx, teamId, players) => {
  try {
    await tx.run(
      `
        MATCH (t:Team {id: $teamId})<-[r:PLAYED_FOR]-(u)
        UNWIND r as playedFor
        DELETE playedFor
    `,
      { teamId }
    );

    await tx.run(
      `
        MATCH (t:Team {id: $teamId})
        WITH t
        UNWIND $players AS player
        MATCH (u:User {id: player.id})
        CREATE (u)-[:PLAYED_FOR]->(t)

    `,
      { teamId, players }
    );
  } catch (error) {
    throw error;
  }
};

export const getUserFavSports = async (tx, userId) => {
  const resp = await tx.run(
    `
      MATCH (u:User {id: $userId})
      MATCH (u)-[:HAS_FAVORITE_SPORT]-(s:Sport)
      RETURN s.name as name
    `,
    { userId }
  );

  return resp.records.map((row) => row.get('name'));
};

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
