/**** replace with wheel.html ****/
/**** replace with constants.js ****/
/**** replace with wheel.js ****/
chrome.storage.local.get(Constants.WHEEL_ITEMS_STORAGE_KEY, (result) => {
  const items = result[Constants.WHEEL_ITEMS_STORAGE_KEY] ?? new Array(8);

  init(items);
});
