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
