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
