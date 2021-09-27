export const IStorage = {
  get: (key) => {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(key, resolve);
    });
  },
};
