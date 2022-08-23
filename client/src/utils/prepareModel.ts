import { isObjectLike } from 'lodash';

const remove = (obj: Record<string, any>) => {
  Object.keys(obj).forEach((key) => {
    const val = obj[key];

    if (val === null || val === undefined) {
      delete obj[key];
    }

    if (isObjectLike(obj) && !Array.isArray(obj)) {
      remove(val);
    }
  });
};

export const prepareModel = (model: Record<string, any>) => {
  if (!model) {
    return model;
  }

  const newModel = { ...model };

  remove(newModel);

  return model;
};
