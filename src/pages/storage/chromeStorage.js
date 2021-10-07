import { STORAGE_KEY_WHEEL_ITEMS } from "../constants";

export const IStorage = {
  getWheelItems: () => {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(STORAGE_KEY_WHEEL_ITEMS, (result) => {
        let items = new Array(8);
        if (result && result[STORAGE_KEY_WHEEL_ITEMS]) {
          items = result[STORAGE_KEY_WHEEL_ITEMS];
        }
        resolve(items);
      });
    });
  },
  saveWheelItems: (wheelItems) => {
    return new Promise((resolve, reject) => {
      chrome.storage.local.set({ [STORAGE_KEY_WHEEL_ITEMS]: wheelItems }, resolve);
    });
  },
};
