import { StatusCodes } from 'http-status-codes';
import { getDriver } from '../../db/neo4j.js';
import { BadRequestError } from '../../errors/bad-request.js';
import { NotFoundError } from '../../errors/not-found.js';
import { toNativeTypes } from '../../utils/nativeTypes.js';

export const getUserFriendRequests = async (req, res) => {
  const { userId } = req.user;

  const session = getDriver().session();

  const resp = await session.readTransaction(async (tx) =>
    tx.run(
      `
    MATCH (receiver:User {id: $userId})
    OPTIONAL MATCH (receiver)-[:HAS_FRIEND_REQUEST]->(fr:FriendRequest)<-[:SENT_FRIEND_REQUEST]-(sender)
    RETURN fr {
      .id,
      .sentAt,
      sender: sender.username
    }
    ORDER BY fr.sentAt DESC
  `,
      { userId }
    )
  );

  await session.close();

  if (!resp || resp.records.length === 0) {
    throw NotFoundError(`No user with id: ${userId}`);
  }

  return res.status(StatusCodes.OK).json({
    friendRequests: resp.records.flatMap((row) => {
      const fr = row.get('fr');

      return fr ? [fr] : [];
    }),
  });
};

// POST
export const sendFriendRequest = async (req, res) => {
  const { userId: fromUserId } = req.user;
  const { toUser } = req.body;

  if (!fromUserId || !toUser) {
    throw new BadRequestError('Please provide users');
  }

  const session = getDriver().session();

  const fr = await session.readTransaction((tx) =>
    tx.run(
      `
    MATCH (u1:User {id: $fromUserId})-[:SENT_FRIEND_REQUEST]->(fr)<-[:HAS_FRIEND_REQUEST]-(u2:User { username: $toUser})
    RETURN fr
  `,
      { fromUserId, toUser }
    )
  );

  if (fr && fr.records.length !== 0) {
    throw new BadRequestError('Friend request between users already exists.');
  }

  const resp = await session.writeTransaction((tx) =>
    tx.run(
      `
    MATCH (u1:User {id: $fromUserId})
    MATCH (u2:User {username: $toUser})
    WITH u1, u2
    CREATE (u1)-[:SENT_FRIEND_REQUEST]->(fr:FriendRequest {id: randomUuid(), sentAt: timestamp()})<-[:HAS_FRIEND_REQUEST]-(u2)
    RETURN fr
  `,
      { fromUserId, toUser }
    )
  );

  await session.close();

  if (!resp || resp.records.length === 0) {
    throw new BadRequestError('Unable to create friend request');
  }

  const friendRequest = toNativeTypes(resp.records[0].get('fr').properties);

  return res.status(StatusCodes.CREATED).json({ friendRequest });
};

// POST
export const deleteFriendRequest = async (req, res) => {
  const { sender, receiver } = req.body;

  if (!sender || !receiver) {
    throw new BadRequestError('Users info not provided.');
  }

  const session = getDriver().session();

  const resp = await session.writeTransaction((tx) =>
    tx.run(
      `
    MATCH (sender:User {username: $sender})-[:SENT_FRIEND_REQUEST]
    ->(fr)<-[:HAS_FRIEND_REQUEST]-(receiver:User {username: $receiver})
    DETACH DELETE fr
  `,
      { sender, receiver }
    )
  );
  await session.close();

  res.status(StatusCodes.OK).json({ msg: 'Deleted friend request' });
};
