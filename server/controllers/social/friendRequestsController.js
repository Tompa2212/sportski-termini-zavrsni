import { StatusCodes } from 'http-status-codes';
import { getDriver } from '../../db/neo4j.js';
import { BadRequestError } from '../../errors/bad-request.js';
import { NotFoundError } from '../../errors/not-found.js';
import { toNativeTypes } from '../../utils/nativeTypes.js';

// POST
export const sendFriendRequest = async (req, res) => {
  const { userId: fromUserId } = req.user;
  const { toUserId } = req.body;

  if (!fromUserId || !toUserId) {
    throw new BadRequestError('Invalid user id values');
  }

  const session = getDriver().session();

  const fr = await session.readTransaction((tx) =>
    tx.run(
      `
    MATCH (u1:User {id: $fromUserId})-[:SENT_FRIEND_REQUEST]->(fr)<-[:HAS_FRIEND_REQUEST]-(u2:User {id:$toUserId})
    RETURN fr
  `,
      { fromUserId, toUserId }
    )
  );

  if (fr && fr.records.length !== 0) {
    throw new BadRequestError('Friend request between users already exists.');
  }

  const resp = await session.writeTransaction((tx) =>
    tx.run(
      `
    MATCH (u1:User {id: $fromUserId})
    MATCH (u2:User {id: $toUserId})
    WITH u1, u2
    CREATE (u1)-[:SENT_FRIEND_REQUEST]->(fr:FriendRequest {id: randomUuid(), sentAt: timestamp()})<-[:HAS_FRIEND_REQUEST]-(u2)
    RETURN fr
  `,
      { fromUserId, toUserId }
    )
  );

  await session.close();

  if (!resp || resp.records.length === 0) {
    throw new BadRequestError('Unable to create friend request');
  }

  const friendRequest = toNativeTypes(resp.records[0].get('fr').properties);

  return res.status(StatusCodes.CREATED).json({ friendRequest });
};

// DELETE
export const deleteFriendRequest = async (req, res) => {
  const { id: friendRequestId } = req.params;

  if (!friendRequestId) {
    throw new BadRequestError('Friend request info was not provided.');
  }

  const session = getDriver().session();

  const resp = await session.writeTransaction((tx) =>
    tx.run(
      `
    MATCH (fr:FriendRequest {id: $friendRequestId})
    DETACH DELETE fr
    RETURN fr
  `,
      { friendRequestId }
    )
  );
  await session.close();

  if (!resp || resp.records.length === 0) {
    throw new NotFoundError('No friend request with provided id.');
  }

  res.status(StatusCodes.OK).json({ msg: 'Deleted friend request' });
};

export const getUserFriendRequests = async (req, res) => {
  const { id: userId } = req.user;

  const session = getDriver().session();

  const resp = await session.readTransaction(async (tx) =>
    tx.run(
      `
    MATCH (u:User {id: $userId})
    OPTIONAL MATCH (u)-[:HAS_FRIEND_REQUEST]->(fr:FriendRequest)
    RETURN fr {
      .id,
      .sentAt
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
    userId,
    friendRequests: resp.records.flatMap((row) => {
      const fr = row.get('fr');

      return fr ? [fr] : [];
    }),
  });
};
