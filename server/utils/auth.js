import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const genSalt = async () => {
  const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS));

  return salt;
};

export const createJWT = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
};
