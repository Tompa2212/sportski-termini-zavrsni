export const cleanObject = (obj, allowedProperties) => {
  const newObj = {};

  for (let prop in obj) {
    if (allowedProperties.includes(prop)) {
      newObj[prop] = obj[prop];
    }
  }

  return newObj;
};
