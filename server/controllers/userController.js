import { StatusCodes } from 'http-status-codes';
import { getDriver } from '../db/neo4j.js';
import { BadRequestError } from '../errors/bad-request.js';
import { NotFoundError } from '../errors/not-found.js';

export const getUserInfo = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new BadRequestError('Please provide user id.');
  }

  const session = getDriver().session();

  const resp = await session.readTransaction((tx) =>
    tx.run(`
    MATCH (u:User {id: $id})
    
  `)
  );

  await session.close();

  if (!resp || resp.records.length === 0) {
    throw new NotFoundError(`No user with id: ${id}`);
  }
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

  res.status(StatusCodes.OK).json({ data: users });
};
