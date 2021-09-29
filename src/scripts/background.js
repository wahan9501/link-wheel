// NOTE This function will be serialized and execute in a sandbox environment when inject by chrome runtime.
// So we can't refer to value outside this function, or we can simply think the 'this' of this function will be
// bound to an empty object.
function injectWheelIframe() {
  const iframeHTMLString = `<style>
  #wheel-iframe {
    display: none;
    /* Hidden by default */
    position: fixed;
    /* Stay in place */
    z-index: 9999;
    /* Sit on top */
    /* padding-top: 100px; */
    /* Location of the box */
    left: 0;
    top: 0;
    width: 100%;
    /* Full width */
    height: 100%;
    /* Full height */
    overflow: auto;
    /* Enable scroll if needed */
    background-color: rgb(0, 0, 0);
    /* Fallback color */
    background-color: rgba(0, 0, 0, 0.4);
    /* Black w/ opacity */
  }
</style>
<iframe id="wheel-iframe" sandbox="allow-popups allow-scripts"> </iframe>`;

  // Inject the iframe if not injected.
  if (!document.getElementById("wheel-iframe")) {
    document.body.insertAdjacentHTML("beforeend", iframeHTMLString);
    const iframeEle = document.getElementById("wheel-iframe");
    iframeEle.src = chrome.runtime.getURL("wheel.html");

    document.addEventListener(
      "keydown",
      (event) => {
        if (event.altKey && (event.key === "s" || event.key === "S")) {
          if (iframeEle.style.display === "none" || !iframeEle.style.display) {
            iframeEle.style.display = "flex";
            iframeEle.requestPointerLock();
          }
        }
      },
      true
    );

    document.addEventListener("keyup", (event) => {
      iframeEle.style.display = "none";
      document.exitPointerLock();
    });

    function messagePoster(e) {
      iframeEle.contentWindow.postMessage({ type: "mousemove", movementX: e.movementX, movementY: e.movementY }, "*");
    }

    function addMouseListener() {
      function lockChangeAlert() {
        if (document.pointerLockElement === iframeEle) {
          document.addEventListener("mousemove", messagePoster, false);
        } else {
          document.removeEventListener("mousemove", messagePoster, false);
          iframeEle.contentWindow.postMessage({ type: "exit" }, "*");
        }
      }
      document.addEventListener("pointerlockchange", lockChangeAlert, false);
    }

    addEventListener("message", (event) => {
      if (event.data.type === "openurl") {
        window.open(event.data.url, "_blank");
      }
    });

    addMouseListener();
  }
}

chrome.tabs.onUpdated.addListener(async function (tabId, changeInfo, tab) {
  if (changeInfo.status === "loading") {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: injectWheelIframe,
    });
  }
});

chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.create({ url: chrome.runtime.getURL("wheelSettings.html") });
});

// // chrome://flags/#extensions-on-chrome-url
