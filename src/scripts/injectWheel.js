import hotkeys from "hotkeys-js";
import iframeHTMLString from "./wheelIframe.html";

if (!document.getElementById("wheel-iframe")) {
  document.body.insertAdjacentHTML("beforeend", iframeHTMLString);
  const iframeEle = document.getElementById("wheel-iframe");
  iframeEle.src = chrome.runtime.getURL("wheel.html");

  function messageRouter(e) {
    iframeEle.contentWindow.postMessage({ type: "mousemove", movementX: e.movementX, movementY: e.movementY }, "*");
  }

  function addMouseListener() {
    function lockChangeAlert() {
      if (document.pointerLockElement === iframeEle) {
        document.addEventListener("mousemove", messageRouter, false);
      } else {
        document.removeEventListener("mousemove", messageRouter, false);
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

// Allow hotkey in INPUT SELECT TEXTAREA elements.
// REF: https://github.com/jaywcjlove/hotkeys#filter
hotkeys.filter = function (event) {
  return true;
};

hotkeys("alt+s", function (event, handler) {
  if (event.type === "keydown") {
    const iframeEle = document.getElementById("wheel-iframe");
    if (iframeEle) {
      iframeEle.style.display = "flex";
      iframeEle.requestPointerLock();
    }
  }
});

hotkeys("*", { keydown: false, keyup: true }, function (event, handler) {
  const iframeEle = document.getElementById("wheel-iframe");
  if (iframeEle) {
    iframeEle.style.display = "none";
    document.exitPointerLock();
  }
});
