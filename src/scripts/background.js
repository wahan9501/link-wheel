chrome.tabs.onUpdated.addListener(async function (tabId, changeInfo, tab) {
  if (changeInfo.status === "loading") {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["injectWheel.js"],
    });
  }
});

chrome.action.onClicked.addListener((tab) => {
  const url = chrome.runtime.getURL("wheelSettings.html");
  chrome.tabs.query({ url }).then((result) => {
    if (result.length > 0) {
      chrome.tabs.highlight({ tabs: result[0].index });
    } else {
      chrome.tabs.create({ url });
    }
  });
});

// // chrome://flags/#extensions-on-chrome-url
