import { BadRequestError } from '../../errors/bad-request.js';
import { NotFoundError } from '../../errors/not-found.js';
import { getDriver } from '../../db/neo4j.js';
import { StatusCodes } from 'http-status-codes';

// POST
// Accepting friend request
export const addFriend = async (req, res) => {
  const { sender } = req.body;
  const { userId: acceptorUserId } = req.user;

  console.log(sender);

  const session = getDriver().session();

  const resp = await session.writeTransaction((tx) =>
    tx.run(
      `
    MATCH (sender:User {username: $sender})-[:SENT_FRIEND_REQUEST]->
    (fr)
    <-[:HAS_FRIEND_REQUEST]-(acceptor:User {id: $acceptorUserId})

    DETACH DELETE fr
    WITH sender, acceptor
    CREATE (sender)-[r:FRIEND_WITH]->(acceptor)
    RETURN r
  `,
      { sender, acceptorUserId }
    )
  );

  await session.close();

  console.log(resp.records[0]);

  if (!resp || resp.records.length === 0) {
    throw new BadRequestError('Unable to accept friend request. Please try again.');
  }

  res.status(StatusCodes.OK).json({ msg: 'Friend request accepted.' });
};

// DELETE
export const removeFriend = async (req, res) => {
  const { id: fromUserId } = req.user;
  const { id: toUserId } = req.params;

  if (!fromUserId || !toUserId) {
    throw new BadRequestError('Please provide required info');
  }

  const session = getDriver().session();

  const resp = await session.writeTransaction((tx) =>
    tx.run(
      `
    MATCH (fromUser:User {id:$fromUserId})-[r:FRIEND_WITH]-(toUser:User {id:$toUserId})
    DELETE r
    RETURN fromUser, toUser
  `,
      { fromUserId, toUserId }
    )
  );

  await session.close();

  if (!resp || resp.records.length === 0) {
    throw new BadRequestError('No data found with provided values');
  }

  return res.status(StatusCodes.OK).json({ msg: 'Friend removed' });
};

export const getUserFriends = async (req, res) => {
  const { id: userId } = req.params;

  const session = getDriver().session();

  const resp = await session.readTransaction(async (tx) =>
    tx.run(
      `
    MATCH (u:User {id: $userId})
    OPTIONAL MATCH (u)-[:FRIEND_WITH]-(fr:User)
    RETURN fr {
      .id,
      .username
    } as fr
  `,
      { userId }
    )
  );

  await session.close();

  if (!resp || resp.records.length === 0) {
    throw new NotFoundError(`No user with id: ${userId}`);
  }

  return res.status(StatusCodes.OK).json({
    userId,
    friends: resp.records.flatMap((row) => {
      const friend = row.get('fr');

      return friend ? [friend] : [];
    }),
  });
};
