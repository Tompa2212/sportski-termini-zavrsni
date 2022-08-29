import { StatusCodes } from 'http-status-codes';
import { getDriver } from '../db/neo4j.js';
import { BadRequestError } from '../errors/bad-request.js';
import { NotFoundError } from '../errors/not-found.js';
import { toNativeTypes } from '../utils/nativeTypes.js';
import { getUserSportStats } from '../utils/query/user/getUserSportStats.js';
import { allowedUserProps } from '../constants/graphNodes.js';
import { setUserFavoriteLocations, setUserFavoriteSports } from '../utils/query.js';

export const getUserInfo = async (req, res) => {
  const { id: username } = req.params;
  const { userId: viewer } = req.user;

  if (!username) {
    throw new BadRequestError('Please provide username for user.');
  }

  const session = getDriver().session();

  const user = await session.readTransaction(async (tx) => {
    const resp = await tx.run(
      `
      MATCH (subject:User {username: $username})
      MATCH (viewer:User {id: $viewer})
      OPTIONAL MATCH (subject)-[rFr:FRIEND_WITH]-(person)
      OPTIONAL MATCH (subject)-[rFWU:FRIEND_WITH]-(viewer)
      OPTIONAL MATCH (subject)-[rFRS:SENT_FRIEND_REQUEST]->(frS)--(viewer)
      OPTIONAL MATCH (subject)-[rFRH:HAS_FRIEND_REQUEST]->(frH)--(viewer)
      WITH subject, count(person) AS numOfFriends, rFWU IS NOT NULL AS isFriendWithViewer,
      rFRS IS NOT NULL AS sentFriendRequestToViewer, rFRH IS NOT NULL AS hasFriendRequestFromViewer
      RETURN subject {
        .username,
        numOfFriends: numOfFriends,
        isFriendWithViewer: isFriendWithViewer,
        sentFriendRequestToViewer: sentFriendRequestToViewer,
        hasFriendRequestFromViewer: hasFriendRequestFromViewer
      } AS info
    `,
      { username, viewer }
    );

    if (!resp || resp.records.length === 0) {
      throw new NotFoundError(`No user with username: ${username}`);
    }
    const info = toNativeTypes(resp.records[0].get('info'));

    return {
      ...info,
    };
  });

  await session.close();

  res.status(StatusCodes.OK).json({ user });
};

export const getUserStats = async (req, res) => {
  const session = getDriver().session();
  const { id: username } = req.params;

  const sportStats = await session.readTransaction(async (tx) => {
    return await getUserSportStats(tx, username);
  });

  if (!sportStats) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: 'No user with provided username.' });
  }

  res.status(StatusCodes.OK).json({ ...sportStats });
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

export const updateUser = async (req, res) => {
  const { userId } = req.user;
  const {favoriteSports, favoriteLocations, ...baseUserProps} = req.body;

  const session = getDriver().session();

  const resp = await session.writeTransaction((tx) => {

    if(favoriteSports) {
      await setUserFavoriteSports(tx, userId, favoriteSports)
    }

    if(favoriteLocations) {
      await setUserFavoriteLocations(tx, userId, favoriteLocations)
    }

    return await tx.run(
      `
        MATCH (u:User {id: $userId})
        SET u += $updatedProperties
        RETURN u {
          .*
        }
        
  `,
      { userId, updatedProperties: cleanObject(baseUserProps, allowedUserProps) }
    )
  }
  );

  if (!resp || resp.records.length === 0) {
    throw new Error('unable to update user');
  }

  await session.close();

  const user = resp.records[0].get('u');

  res.status(StatusCodes.OK).json({ user });
};
