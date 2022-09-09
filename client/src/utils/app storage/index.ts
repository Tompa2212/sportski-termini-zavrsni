const getItem = (key: string) => {
  const storageValue = localStorage.getItem(key);

  if (!storageValue) {
    return null;
  }

  return JSON.parse(storageValue);
};

const setItem = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const removeItem = (key: string) => {
  localStorage.removeItem(key);
};

export const appStorage = {
  getItem,
  setItem,
  removeItem,
};
