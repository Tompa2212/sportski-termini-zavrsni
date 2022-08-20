import { StatusCodes } from 'http-status-codes';
import { getDriver } from '../../db/neo4j.js';
import { BadRequestError } from '../../errors/bad-request.js';
import { dateFormat, timeFormat } from '../../constants/dateTime.js';
import { NotFoundError } from '../../errors/not-found.js';
import { cleanObject } from '../../utils/cleanObject.js';
import { allowedSportTermProperties } from '../../constants/graphNodes.js';
import { toNativeTypes } from '../../utils/nativeTypes.js';
import { int } from 'neo4j-driver';
import { queryParamsToMapLiteral } from '../../utils/queryParamsToMapLiteral.js';
import { normalizeQueryParams } from '../../utils/normalizeQueryParams.js';

export const getAllSportTerms = async (req, res) => {
  const { skip = 0, limit = 10, ...restQueryParams } = req.query;

  const session = getDriver().session();

  const resp = await session.readTransaction((tx) =>
    tx.run(
      `
      MATCH (s:Sport)<-[:PLAYED_SPORT]-(sT:SportTerm ${queryParamsToMapLiteral(
        restQueryParams,
        'param'
      )})-[:HAS_ADDRESS]->(a:Address)
      MATCH (sT)<-[:CREATED_SPORT_TERM]-(u:User)
      OPTIONAL MATCH (sT)-[:HAS_TEAM*0..1]->(t:Team)
      CALL {
        WITH t
        MATCH (u:User)-[:PLAYED_FOR]->(t)
        RETURN t {
          .*,
          players: collect(u {.id , .username})
        } as team
      }
      WITH  sT, s, a, u, collect(properties(team)) as teams
      RETURN DISTINCT sT {
          .*,
          address: a.address,
          city: a.city,
          country: a.country,
          sport: s.name,
          teams: teams,
          organizedBy: u.username
      } as sT
      SKIP $skip
      LIMIT $limit
  `,
      {
        param: normalizeQueryParams(restQueryParams),
        skip: int(skip),
        limit: int(limit),
      }
    )
  );

  const sportTerms = resp.records.map((sportTerm) =>
    toNativeTypes(sportTerm.get('sT'))
  );

  return res
    .status(StatusCodes.OK)
    .json({ numOfItems: sportTerms.length, data: sportTerms });
};

export const getSportTerm = async (req, res) => {
  const { id: sportTermId } = req.params;

  const session = getDriver().session();

  const resp = await session.readTransaction((tx) =>
    tx.run(
      `
      MATCH (s:Sport)-[:PLAYED_SPORT]-(sT:SportTerm {id: $sportTermId})-[:HAS_ADDRESS]->(a:Address)
      MATCH (sT)<-[:CREATED_SPORT_TERM]-(u:User)
      OPTIONAL MATCH (sT)-[:HAS_TEAM*0..1]->(t:Team)
      CALL {
        WITH t
        MATCH (u:User)-[:PLAYED_FOR]->(t)
        RETURN t {
          .*,
          players: collect(u {.id , .username})
        } as team
      }
      WITH  sT, s, a, u, collect(properties(team)) as teams
      RETURN DISTINCT sT {
          .*,
          address: a.address,
          city: a.city,
          country: a.country,
          sport: s.name,
          teams: teams,
          vreatedBy: u.username
      } as sT
  `,
      { sportTermId }
    )
  );

  await session.close();

  if (!resp || resp.records.length === 0) {
    throw new NotFoundError(`Unable to find sport term with id: ${sportTermId}`);
  }

  const sportTerm = toNativeTypes(resp.records[0].get('sT'));

  return res.status(StatusCodes.OK).json({ data: sportTerm });
};

export const createSportTerm = async (req, res) => {
  const { userId } = req.user;

  const {
    sport,
    playDate,
    playTime,
    teamGame,
    comment,
    pricePerPerson,
    address,
    city,
    country,
  } = req.body;

  const session = getDriver().session();

  const resp = await session.writeTransaction((tx) =>
    tx.run(
      `
    MATCH (s:Sport {name: $sport})
    MATCH (u:User {id: $userId})
    WITH s, u
    MERGE (a:Address {address: $address, city: $city, country: $country})<-[:HAS_ADDRESS]-(sT:SportTerm {
        id: randomUuid(), 
        played: false, 
        pricePerPerson: $pricePerPerson,
        playDate: date($playDate),
        playTime: time($playTime),
        teamGame: $teamGame,
        comment: $comment 
    })-[:PLAYED_SPORT]->(s)
    MERGE (u)-[:CREATED_SPORT_TERM]->(sT)
    RETURN sT {
      .*,
      playDate: apoc.temporal.format( sT.playDate, '${dateFormat}'),
      playTime: apoc.temporal.format( sT.playTime, '${timeFormat}'),
      sport: s.name,
      address: a.address,
      city: a.city,
      country: a.country
    }
    `,
      {
        sport,
        playDate,
        playTime,
        teamGame,
        comment,
        pricePerPerson,
        address,
        city,
        country,
        userId,
      }
    )
  );

  await session.close();

  if (!resp || resp.records.length === 0) {
    throw new BadRequestError('Unable to create sport term. Please try again.');
  }

  const sportTerm = resp.records[0].get('sT');

  res.status(StatusCodes.CREATED).json({ data: sportTerm });
};

export const deleteSportTerm = async (req, res) => {
  const { id: sportTermId } = req.params;

  const session = getDriver().session();

  const resp = await session.writeTransaction((tx) =>
    tx.run(
      `
    MATCH (sT:SportTerm {id: $sportTermId})-[:HAS_TEAM]-(t)
    DETACH DELETE sT, t
  `,
      { id: sportTermId }
    )
  );

  await session.close();

  if (!resp) {
    throw new NotFoundError(`Unable to find sport term with id: ${sportTermId}`);
  }
};

export const updateSportTerm = async (req, res) => {
  const { id: sportTermId } = req.params;

  const session = await getDriver().session();

  const resp = await session.writeTransaction((tx) =>
    tx.run(
      `
      MATCH (sT:SportTerm {id: $sportTermId}) SET sT += $updatedProperties
      RETURN sT`,
      {
        sportTermId,
        updatedProperties: cleanObject(req.body, allowedSportTermProperties),
      }
    )
  );
  await session.close();

  if (!resp || resp.records.length === 0) {
    throw new NotFoundError(`Sport term with id: ${sportTermId} not found.`);
  }

  const sportTerm = resp.records[0].get('sT');

  return res.status(StatusCodes.OK).json({ sportTerm });
};
