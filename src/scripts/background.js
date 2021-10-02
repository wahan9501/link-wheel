chrome.tabs.onUpdated.addListener(async function (tabId, changeInfo, tab) {
  if (changeInfo.status === "loading") {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["injectWheel.js"],
    });
  }
});

chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.create({ url: chrome.runtime.getURL("wheelSettings.html") });
});

// // chrome://flags/#extensions-on-chrome-url
