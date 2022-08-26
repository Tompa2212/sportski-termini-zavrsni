import { UnauthenticatedError } from '../errors/unauthenticated.js';
import jwt from 'jsonwebtoken';

export const authMiddleware = (req, _, next) => {
  const authorization = req.headers.authorization;

  if (!authorization) {
    throw new UnauthenticatedError('Unathenticated');
  }

  try {
    const payload = jwt.verify(authorization.split(' ')[1], process.env.JWT_SECRET);

    console.log(payload);

    req.user = {
      userId: payload.id,
      email: payload.email,
      username: payload.username,
    };

    next();
  } catch (error) {
    throw new UnauthenticatedError('Unathenticated');
  }
};
