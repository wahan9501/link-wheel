import { STORAGE_KEY_WHEEL_ITEMS } from "../constants";

export const IStorage = {
  getWheelItems: () => {
    return new Promise((resolve, reject) => {
      let items;
      try {
        items = JSON.parse(localStorage.getItem(STORAGE_KEY_WHEEL_ITEMS));
      } catch {}
      resolve(items ?? new Array(8));
    });
  },
  saveWheelItems: (val) => {
    return new Promise((resolve, reject) => {
      resolve(localStorage.setItem(STORAGE_KEY_WHEEL_ITEMS, JSON.stringify(val)));
    });
  },
};
