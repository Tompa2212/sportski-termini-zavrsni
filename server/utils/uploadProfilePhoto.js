import { BadRequestError } from '../errors/bad-request.js';
import fs from 'fs';
import * as Cloudinary from 'cloudinary';

const cloudinary = Cloudinary.v2;

// 1 MB
const MAX_SIZE = 1024 * 1024;

export const validatePhoto = (photo) => {
  if (photo.mimetype.startsWith('image') === false) {
    throw new BadRequestError(`Only image type files are allowed.`);
  }

  if (photo.size > MAX_SIZE) {
    throw new BadRequestError(`File too large.`);
  }
};

export const uploadProfilePhoto = async (profilePhoto, userId, tx) => {
  if (!profilePhoto) {
    return null;
  }

  const result = await cloudinary.uploader.upload(profilePhoto.tempFilePath, {
    use_filename: true,
    folrer: 'sportski-termini-api',
    transformation: [{ width: 250, height: 250, crop: 'scale', quality: 'auto' }],
  });

  const profilePhotoSrc = result.secure_url;

  fs.unlinkSync(profilePhoto.tempFilePath);

  const resp = await tx.run(
    `
    MATCH (u:User {id: $userId})
    SET u += {profilePhotoSrc: $profilePhotoSrc}
    RETURN u
  `,
    { userId, profilePhotoSrc }
  );

  if (resp.records && resp.records.length) {
    return profilePhotoSrc;
  }

  return null;
};
