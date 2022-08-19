import { StatusCodes } from 'http-status-codes';
import { getDriver } from '../../db/neo4j.js';
import { NotFoundError } from '../../errors/not-found.js';
import { toNativeTypes } from '../../utils/nativeTypes.js';
import { getUserFavSports, getUserPlayedGames } from '../../utils/query.js';
import { findById } from '../../utils/query/findById.js';

export const getRecommendedFriends = async (req, res) => {
  const { id: userId } = req.params;

  const session = getDriver().session();

  const resp = await session.readTransaction(async (tx) => {
    const user = await findById(tx, 'User', userId);

    if (!user) {
      throw new NotFoundError(`No user with id: ${userId}`);
    }
    const favSports = await getUserFavSports(tx, userId);
    const playedGames = await getUserPlayedGames(tx, userId);

    return tx.run(
      `
        CALL {
            MATCH (subject:User {id: $userId})
            MATCH p=(subject)-[:FRIEND_WITH]-(:User)-[:FRIEND_WITH*0..2]-(:User)
            -[:FRIEND_WITH]-(person:User)-[:HAS_FAVORITE_SPORT]->(sport:Sport)
            WHERE person<>subject AND sport.name IN $favSports
            WITH person, sport, min(length(p)) as pathLength
            RETURN person.username AS username,
            person.id AS userId,
            count(sport) AS score
            
            UNION ALL
    
            MATCH p=(subject:User {id: $userId})-[:FRIEND_WITH]-(:User)-[:FRIEND_WITH*0..2]-(:User)
            -[:FRIEND_WITH]-(person:User)-[:PLAYED_FOR]->(t:Team)<-[:HAS_TEAM]-(sT:SportTerm)
            WHERE person<>subject AND sT.id IN $playedGames
            WITH person, sT
            RETURN
            person.username AS username,
            person.id AS userId,
            count(sT) AS score
        }
        WITH username, userId, sum(score) AS score
        RETURN username, userId, score
        ORDER BY score DESC
      `,
      { userId, favSports, playedGames }
    );
  });

  const recommendedFriends = resp.records.map((row) =>
    toNativeTypes({
      username: row.get('username'),
      userId: row.get('userId'),
    })
  );

  res.status(StatusCodes.OK).json({ data: recommendedFriends });
};
