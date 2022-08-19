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

  //   const user =
};
