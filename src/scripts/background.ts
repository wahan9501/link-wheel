console.log("background script");

chrome.tabs.onUpdated.addListener(async function (tabId, changeInfo, tab) {
  //code in here will run every time a user goes onto a new tab, so you can insert your scripts into every new tab
  // tab.
  // reddenPage();

  // loadWheel();
  // console.log(JSON.stringify(changeInfo));
  if (changeInfo.status === "loading") {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["wheel.js"],
    });
  }
});

// // chrome://flags/#extensions-on-chrome-url
