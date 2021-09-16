// console.log("background script");

function reddenPage() {
  console.log("inject func", performance.now());
  const url = chrome.runtime.getURL("/wheel.html");
  const iframe = document.createElement("iframe");
  iframe.src = url;
  iframe.style.width = "80vw";
  iframe.style.height = "80vh";
  iframe.style.position = "fixed";
  iframe.style.backgroundColor = "gray";
  // iframe.style.display = "none";

  document.body.insertAdjacentElement("beforebegin", iframe);

  window.addEventListener("message", (e) => {
    if (e.data === "exit") {
      // console.log("parent recv exit");

      // iframe.style.display = "none";
    }
  });

  addEventListener("keydown", (event) => {
    if (event.altKey && (event.key === "s" || event.key === "S")) {
      // console.log("parent key down");
      iframe.style.display = "block";

      // dispatch a new event
      // iframe.contentWindow.dispatchEvent(new KeyboardEvent("keydown", { altKey: event.altKey, key: event.key }));

      // iframe.contentWindow.blur();
    }
  });

  // document.body.style.backgroundColor = 'red';

  // const ele = document.createElement();
}

chrome.tabs.onUpdated.addListener(async function (tabId, changeInfo, tab) {
  if (changeInfo.status === "loading") {
    console.log("on content page load", performance.now());
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: reddenPage,
      // files: ["wheel.js"],
    });
  }
});

// chrome.action.onClicked.addListener((tab) => {
//   chrome.tabs.create({ url: chrome.runtime.getURL("wheelSettings.html") });
// });

// // chrome://flags/#extensions-on-chrome-url
