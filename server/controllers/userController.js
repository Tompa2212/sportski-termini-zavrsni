import { StatusCodes } from 'http-status-codes';
import { getDriver } from '../db/neo4j.js';
import { BadRequestError } from '../errors/bad-request.js';
import { NotFoundError } from '../errors/not-found.js';
import { findById } from '../utils/query/findById.js';
import { getUserSportStats } from '../utils/query/user/getUserSportStats.js';

export const getUserInfo = async (req, res) => {
  const { id: userId } = req.params;

  if (!userId) {
    throw new BadRequestError('Please provide user id.');
  }

  const session = getDriver().session();

  const user = await session.readTransaction(async (tx) => {
    const user = (await findById(tx, 'User', userId)) || {};

    if (!user) {
      throw new NotFoundError(`No user with id: ${userId}`);
    }

    const sportStats = await getUserSportStats(tx, userId);
    const { password, ...safeProperties } = user;

    return {
      info: safeProperties,
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
