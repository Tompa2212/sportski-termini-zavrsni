import { StatusCodes } from 'http-status-codes';
import { BadRequestError } from '../errors/bad-request.js';
import { UnauthenticatedError } from '../errors/unauthenticated.js';
import { genSalt, createJWT } from '../utils/auth.js';
import bcrypt from 'bcryptjs';
import { getDriver } from '../db/neo4j.js';
import { uploadProfilePhoto, validatePhoto } from '../utils/uploadProfilePhoto.js';

export const register = async (req, res) => {
  const { username, password: plainPassword, email } = req.body;

  if (!username || !plainPassword || !email) {
    throw new BadRequestError('Please provide username, password, and email');
  }

  const { profilePhoto } = req.files;

  if (profilePhoto) {
    validatePhoto(profilePhoto);
  }

  const salt = await genSalt();
  const hashedPassword = await bcrypt.hash(plainPassword, salt);

  const session = getDriver().session();

  const user = await session.writeTransaction(async (tx) => {
    const resp = await tx.run(
      `
      CREATE (u:User {id: randomUuid(), username: $username, password:$password, email:$email, 
      initializationFinished: false})
      RETURN u
  `,
      {
        username,
        password: hashedPassword,
        email,
      }
    );

    if (!resp || resp.records.length === 0) {
      throw new BadRequestError('Unable to register user.');
    }

    const userData = resp.records[0].get('u').properties;

    const profilePhotoSrc = await uploadProfilePhoto(profilePhoto, userData.id, tx);

    const { password, email: respEmail, ...safeProperties } = userData;

    return { ...safeProperties, profilePhotoSrc };
  });

  await session.close();

  res.status(StatusCodes.CREATED).json({ ...user, token: createJWT(user) });
};

export const login = async (req, res) => {
  const { username, password: plainPassword } = req.body;

  if (!username || !plainPassword) {
    throw new BadRequestError('Please provide username, password, and email');
  }

  const session = getDriver().session();

  const resp = await session.readTransaction((tx) =>
    tx.run(
      `
    MATCH (u:User {username: $username})
    RETURN u
  `,
      { username }
    )
  );

  await session.close();

  if (!resp || resp.records.length === 0) {
    throw new UnauthenticatedError(`Invalid credentials`);
  }

  const user = resp.records[0].get('u');

  const { password, email: respEmail, ...safeProperties } = user.properties;

  const isPasswordCorrect = bcrypt.compare(plainPassword, password);

  if (!isPasswordCorrect) {
    throw new UnauthenticatedError(`Invalid credentials`);
  }

  res
    .status(StatusCodes.OK)
    .json({ ...safeProperties, token: createJWT(safeProperties) });
};
