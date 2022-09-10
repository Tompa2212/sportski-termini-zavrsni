import { StatusCodes } from 'http-status-codes';
import { getDriver } from '../../db/neo4j.js';
import { NotFoundError } from '../../errors/not-found.js';
import { toNativeTypes } from '../../utils/nativeTypes.js';
import { getUserFriends } from '../../utils/query/user/getUserFriends.js';
import { getUserFavSports } from '../../utils/query/user/getUserFavSports.js';
import { findById } from '../../utils/query/findById.js';

export const getRecommendedFriends = async (req, res) => {
  const { userId } = req.user;
  const session = getDriver().session();

  const resp = await session.readTransaction(async (tx) => {
    const user = await findById(tx, 'User', userId);
    if (!user) {
      await session.close();
      throw new NotFoundError(`No user with id: ${userId}`);
    }
    const favSports = await getUserFavSports(tx, userId);
    const friends = await getUserFriends(tx, userId);
    return tx.run(
      `
        CALL {
            MATCH (subject:User {id: $userId})
            MATCH (subject)-[:FRIEND_WITH*1..2]-(:User)
            -[:FRIEND_WITH]-(person:User)-[:HAS_FAVORITE_SPORT]->(sport:Sport)
            WHERE person<>subject AND sport.name IN $favSports
            WITH person, sport
            RETURN person.username AS username,
            person.id AS userId,
            count(sport) AS score

            UNION ALL

            MATCH (subject:User {id: $userId})-[:FRIEND_WITH*0..2]-(fr)
            MATCH (fr)-[:PLAYED_FOR]->(t)<-[:HAS_TEAM]-(st)-[:PLAYED_SPORT]->(s)
            MATCH (st)-[:HAS_TEAM]->(team)
            MATCH (players)-[:PLAYED_FOR]->(team)
            WHERE players <> subject AND NOT players.id IN $friends AND s IN $favSports
            RETURN players.username AS username,
            players.id AS userId,
            count(players) AS score
        }
        WITH username, userId, sum(score) AS score
        RETURN DISTINCT username, userId, score
        ORDER BY score DESC
        LIMIT 20
      `,
      { userId, favSports, friends }
    );
  });
  await session.close();

  const recommendedFriends = resp.records.map((row) =>
    toNativeTypes({
      username: row.get('username'),
      userId: row.get('userId'),
    })
  );
  res.status(StatusCodes.OK).json({ recommendedFriends });
};
