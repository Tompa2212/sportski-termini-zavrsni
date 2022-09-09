import { getDriver } from '../../db/neo4j.js';
import { getUserSportStats } from '../../utils/query/user/getUserSportStats.js';
import { StatusCodes } from 'http-status-codes';

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
