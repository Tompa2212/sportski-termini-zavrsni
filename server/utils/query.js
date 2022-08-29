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

export const setUserFavoriteSports = async (tx, userId, favoriteSports) => {
  try {
    await tx.run(
      `
        MATCH (u:User {id: $userId})<-[r:HAS_FAVORITE_SPORT]-(s)
        UNWIND r as hasFavSport
        DELETE hasFavSport
    `,
      { userId }
    );

    await tx.run(
      `
        MATCH (u:User {id: $userId})
        WITH u
        UNWIND $favoriteSports AS sport
        CREATE (u)-[:HAS_FAVORITE_SPORT]->(s {name: sport})

    `,
      { teamId, favoriteSports }
    );
  } catch (error) {
    throw error;
  }
};

export const setUserFavoriteLocations = async (tx, userId, favoriteLocations) => {
  try {
    await tx.run(
      `
        MATCH (u:User {id: $userId})<-[r:HAS_FAVORITE_LOCATION]-(a)
        UNWIND r as hasFavLocations
        DELETE hasFavLocation
    `,
      { userId }
    );

    await tx.run(
      `
        MATCH (u:User {id: $userId})
        WITH u
        UNWIND $favoriteLocations AS location
        MATCH (a:Address {city: location})
        CREATE (u)-[:HAS_FAVORITE_LOCATION]->(a)

    `,
      { teamId, favoriteLocations }
    );
  } catch (error) {
    throw error;
  }
};
