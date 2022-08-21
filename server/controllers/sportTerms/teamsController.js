import { StatusCodes } from 'http-status-codes';
import { allowedTeamProperties } from '../../constants/graphNodes.js';
import { BadRequestError } from '../../errors/bad-request.js';
import { NotFoundError } from '../../errors/not-found.js';
import { cleanObject } from '../../utils/cleanObject.js';
import { validateNumOfPlayers } from '../../utils/validateNumOfPlayers.js';
import { getDriver } from '../../db/neo4j.js';
import { setPlayersOfTeam } from '../../utils/query.js';

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
  const { name, players, sportTermId } = req.body;

  if (!sportTermId || !name) {
    throw new BadRequestError('Please provide name and sport term id.');
  }

  const session = getDriver().session();

  if (players) {
    await session.readTransaction(async (tx) => {
      try {
        await validateNumOfPlayers(tx, sportTermId, players);
      } catch (error) {
        throw error;
      }
    });
  }

  const team = await session.writeTransaction(async (tx) => {
    let team = await tx.run(
      `
        MATCH (sT:SportTerm {id: $sportTermId})
        CREATE (sT)-[:HAS_TEAM]->(t:Team {id: randomUuid(), name: $name})
        RETURN t
  `,
      { sportTermId, name }
    );

    if (!team || team.records.length === 0) {
      throw new NotFoundError(`No sport term with id: ${sportTermId}`);
    }

    team = team.records[0].get('t');

    if (!players) {
      return team;
    }

    const resp = await tx.run(
      `
        MATCH (t:Team {id: $teamId})
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
      { teamId: team.properties.id, players }
    );

    return {
      ...resp.records[0].get('t'),
    };
  });

  await session.close();

  return res.status(StatusCodes.CREATED).json({ team });
};

export const updateTeam = async (req, res) => {
  const { players, ...teamBaseProps } = req.body;
  const { id: teamId } = req.params;

  const session = getDriver().session();

  if (players) {
    await session.readTransaction(async (tx) => {
      try {
        await validateNumOfPlayers(tx, teamId, players);
      } catch (error) {
        throw error;
      }
    });
  }

  const team = await session.writeTransaction(async (tx) => {
    if (players) {
      await setPlayersOfTeam(tx, teamId, players);
    }

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
      { teamId, updatedProperties: cleanObject(teamBaseProps, allowedTeamProperties) }
    );

    if (!resp || resp.records.length === 0) {
      throw new NotFoundError(`Team with id: ${teamId} not found.`);
    }

    return resp.records[0].get('t');
  });

  await session.close();

  return res.status(StatusCodes.OK).json({ team });
};
