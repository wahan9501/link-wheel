import { Constants } from "../common/constants";
import { initWheel } from "../common/wheel";
import wheelHtml from "./wheel.html";

function init(wheelItems) {
  if (!document.getElementById("wheel-container")) {
    // TODO defer inject til key down
    document.body.insertAdjacentHTML("beforebegin", wheelHtml);

    initWheel(wheelItems);
  }
}

chrome.storage.local.get(Constants.WHEEL_ITEMS_STORAGE_KEY, (result) => {
  const items = result[Constants.WHEEL_ITEMS_STORAGE_KEY] ?? new Array(8);

  init(items);
});
