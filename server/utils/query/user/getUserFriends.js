export const getUserFriends = async (tx, userId) => {
  const resp = await tx.run(
    `
    MATCH (u:User {id: $userId})
    OPTIONAL MATCH (u)-[:FRIEND_WITH]-(friend)
    RETURN friend.id AS id
  `,
    { userId }
  );

  return resp.records.flatMap((row) => (row.get('id') !== null ? row.get('id') : []));
};
