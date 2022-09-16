import { StatusCodes } from 'http-status-codes';
import { allowedTeamProperties } from '../../constants/graphNodes.js';
import { BadRequestError } from '../../errors/bad-request.js';
import { NotFoundError } from '../../errors/not-found.js';
import { cleanObject } from '../../utils/cleanObject.js';
import { validateNumOfPlayers } from '../../utils/validateNumOfPlayers.js';
import { getDriver } from '../../db/neo4j.js';
import { CustomAPIError } from '../../errors/custom-api.js';
import { toNativeTypes } from '../../utils/nativeTypes.js';

export const getTeam = async (req, res) => {
  const { id: teamId } = req.params;

  if (!teamId) {
    throw new BadRequestError('Please provide team id');
  }

  const session = getDriver().session();

  const resp = await session.readTransaction((tx) =>
    tx.run(
      `
    MATCH (u:User)-[:PLAYED_FOR]->(t:Team {id: $teamId})
    WITH t, collect(u {.id , .username}) as players
    RETURN t {
        .*,
        players: players
    }
  `,
      { teamId }
    )
  );

  await session.close();

  if (!resp) {
    throw new NotFoundError(`Unable to find team with id: ${teamId}`);
  }

  const team = resp.records[0].get('t');

  res.status(StatusCodes.OK).json({ team });
};

export const createTeam = async (req, res) => {
  const { name, sportTermId } = req.body;

  if (!sportTermId || !name) {
    throw new BadRequestError('Please provide name and sport term id.');
  }

  const session = getDriver().session();

  const resp = await session.writeTransaction((tx) => {
    return tx.run(
      `
        MATCH (sT:SportTerm {id: $sportTermId})
        CREATE (sT)-[:HAS_TEAM]->(t:Team {id: randomUuid(), name: $name})
        WITH t
        UNWIND $players AS player
        MATCH (u:User {id: player.id})
        CREATE (u)-[:PLAYED_FOR]->(t)
        WITH t, collect( u {.id, .username}) as players
        RETURN t {
            .*,
            players: players
        }
  `,
      { sportTermId, name }
    );
  });

  await session.close();

  if (!resp || !resp.records.length) {
    throw new BadRequestError('Unable to create team');
  }

  const team = resp.records[0].get('t');

  return res.status(StatusCodes.CREATED).json({ team });
};

export const updateTeam = async (req, res) => {
  const { id: teamId } = req.params;

  const session = getDriver().session();

  const team = await session.writeTransaction(async (tx) => {
    const resp = tx.run(
      `
        MATCH (t:Team {id: $teamId})
        OPTIONAL MATCH (u)-[:PLAYED_FOR]->(t)
        SET t += $updatedProperties
        WITH t, collect(u { .id, .username }) AS players
        RETURN t {
            .*,
            players: players
        }
        
  `,
      { teamId, updatedProperties: cleanObject(req.body, allowedTeamProperties) }
    );

    if (!resp || resp.records.length === 0) {
      throw new NotFoundError(`Team with id: ${teamId} not found.`);
    }

    return resp.records[0].get('t');
  });

  await session.close();

  return res.status(StatusCodes.OK).json({ team });
};

export const addPlayerToTeam = async (req, res) => {
  const { username } = req.user;
  const { id: teamId } = req.params;

  const session = getDriver().session();

  const team = await session.writeTransaction(async (tx) => {
    try {
      await validateNumOfPlayers(tx, teamId, username);
    } catch (error) {
      throw error;
    }

    const resp = await tx.run(
      `
        MATCH (t:Team {id: $teamId})<-[:HAS_TEAM]-(st)
        MATCH (subject:User {username: $username})
        CREATE (t)<-[:PLAYED_FOR]-(subject)
        RETURN t
  `,
      { teamId, username }
    );

    return toNativeTypes(resp.records[0].get('t').properties);
  });

  if (!team) {
    throw new CustomAPIError('Unable to add user to team.');
  }

  res.status(StatusCodes.OK).json({ team });
};

export const removePlayer = async (req, res) => {
  const { id: teamId, username } = req.params;

  const session = getDriver().session();

  const resp = await session.writeTransaction((tx) =>
    tx.run(
      `
    MATCH (t:Team {id: $teamId})
    MATCH (u:User {username: $username})
    MATCH (t)<-[r:PLAYED_FOR]-(u)
    DELETE r
    RETURN r
  `,
      { teamId, username }
    )
  );

  await session.close();

  if (!resp || !resp.records.length) {
    throw new BadRequestError(
      `User ${username} is not playing for team with id: ${teamId}`
    );
  }

  return res.status(StatusCodes.OK).json({ msg: 'OK' });
};
