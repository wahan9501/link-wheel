export const IStorage = {
  get: (key) => {
    return new Promise((resolve, reject) => {
      resolve(localStorage.getItem(key));
    });
  },
};
