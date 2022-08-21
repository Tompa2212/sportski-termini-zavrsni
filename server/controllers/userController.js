import { StatusCodes } from 'http-status-codes';
import { getDriver } from '../db/neo4j.js';
import { BadRequestError } from '../errors/bad-request.js';
import { NotFoundError } from '../errors/not-found.js';
import { toNativeTypes } from '../utils/nativeTypes.js';
import { getUserSportStats } from '../utils/query/user/getUserSportStats.js';

export const getUserInfo = async (req, res) => {
  const { id: userId } = req.params;

  if (!userId) {
    throw new BadRequestError('Please provide user id.');
  }

  const session = getDriver().session();

  const user = await session.readTransaction(async (tx) => {
    const sportStats = await getUserSportStats(tx, userId);

    const resp = await tx.run(
      `
      MATCH (subject:User {id: $userId})
      OPTIONAL MATCH (subject)-[r:FRIEND_WITH]-(person)
      WITH subject, count(person) AS numOfFriends
      RETURN subject {
        .id,
        .username,
        .email,
        numOfFriends: numOfFriends
      } AS info
    `,
      { userId }
    );

    if (!resp || resp.records.length === 0) {
      throw new NotFoundError(`No user with id: ${userId}`);
    }
    const info = toNativeTypes(resp.records[0].get('info'));

    return {
      info,
      sportStats,
    };
  });

  await session.close();

  res.status(StatusCodes.OK).json({ user });
};

export const getUsers = async (req, res) => {
  const { username } = req.query;

  const session = getDriver().session();

  const resp = await session.readTransaction((tx) =>
    tx.run(
      `
    MATCH (u:User)
    WHERE u.username STARTS WITH $username
    RETURN u {
      .username,
      .id
    }
  `,
      { username }
    )
  );

  await session.close();

  const users = resp.records.map((row) => row.get('u'));

  res.status(StatusCodes.OK).json({ users });
};
