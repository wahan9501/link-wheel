// import wheelHtml from "../pages/wheel/wheel.html";
// // import "../pages/wheel/wheel.css";

// function injectWheel() {
//   // Inject html.
//   document.body.insertAdjacentHTML("beforebegin", wheelHtml);
//   // Inject css.
//   // Eval js.
// }
const key = "wheelItems";

function reddenPage() {
  fetch(chrome.runtime.getURL("/wheel.html"))
    .then((r) => r.text())
    .then((html) => {
      document.body.insertAdjacentHTML("beforebegin", html);
    })
    .then(() => {
      chrome.storage.local.get("wheelItems", (result) => {
        // const item = { title: "Bing", url: "https://bing.com" };
        // const item2 = { title: "Google", url: "https://google.com" };
        // const item3 = { title: "Baidu", url: "https://baidu.com" };
        // const items = [item, item2, item3, item, item, item, item, item];
        let items;
        if (result && result["wheelItems"]) {
          items = result["wheelItems"];
        } else {
          items = new Array(8);
        }

        let container;
        let canvas;
        let ctx;
        var animation;
        var tracker;

        const WIDTH = 480;
        const HEIGHT = 480;
        const CX = WIDTH / 2;
        const CY = HEIGHT / 2;
        const WHEEL_SEL_R = 70;
        const WHEEL_INNER_R = 100;
        const WHEEL_OUTER_R = 120;
        const POINTER_R = 10;
        const ARROW_SIDE = 20;

        let mx = 0;
        let my = 0;
        let sel = false;
        let sel_id = -1;

        function reset() {
          mx = 0;
          my = 0;
          sel = false;
          sel_id = -1;
        }

        function setupKeyboardListener() {
          document.addEventListener(
            "keydown",
            (event) => {
              if (event.altKey && event.key === "s") {
                // event.preventDefault();
                if (canvas.style.display === "none") {
                  reset();
                  draw();
                }
                container.style.display = "flex";
                canvas.requestPointerLock();
              }
            },
            true
          );

          document.addEventListener(
            "keyup",
            (event) => {
              if (event.key === "Alt" || event.key === "s") {
                container.style.display = "none";
                document.exitPointerLock();
              }
            },
            true
          );
        }

        function drawWheel() {
          ctx.save();

          ctx.translate(CX, CY);

          ctx.strokeStyle = sel ? "#0f0" : "#000";
          ctx.beginPath();
          ctx.arc(0, 0, WHEEL_INNER_R, 0, Math.PI * 2, true);
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(0, 0, WHEEL_OUTER_R, 0, Math.PI * 2, true);
          ctx.stroke();

          ctx.restore();
        }

        function drawArrow() {
          ctx.save();

          ctx.translate(CX, CY);
          ctx.rotate((45 * sel_id * Math.PI) / 180);
          ctx.translate(0, -WHEEL_OUTER_R - ARROW_SIDE);

          ctx.fillStyle = "#0f0";

          ctx.beginPath();
          const h = ARROW_SIDE * (Math.sqrt(3) / 2);
          ctx.moveTo(0, (-h * 2) / 3);
          ctx.lineTo((h * 2) / 3, h / 3);
          ctx.lineTo((-h * 2) / 3, h / 3);
          ctx.closePath();
          ctx.fill();

          ctx.restore();
        }

        function drawItems() {
          ctx.save();
          ctx.translate(CX, CY);

          // ctx.translate(0, -WHEEL_OUTER_R - ARROW_SIDE - ARROW_SIDE);

          for (let i = 0; i < 8; i++) {
            ctx.save();
            ctx.fillStyle = "black";
            ctx.font = "16px Arial";
            ctx.textBaseline = "middle";
            ctx.textAlign = "center";
            if (sel && i === sel_id) {
              ctx.fillStyle = "red";
              ctx.font = "24px Arial";
            }
            if (i > 0 && i < 4) {
              ctx.textAlign = "left";
            } else if (i > 4 && i < 8) {
              ctx.textAlign = "right";
            }
            const angle = (45 * i * Math.PI) / 180;
            const len = WHEEL_OUTER_R + ARROW_SIDE * 2;
            const y = len * Math.cos(angle);
            const x = len * Math.sin(angle);

            // tracker.textContent = "angle: " + angle + "   len: " + len;
            // tracker.textContent = "x: " + x + "   y: " + y;

            ctx.translate(x, -y);
            ctx.fillText(items[i]?.title ?? "N/A", 0, 0);

            ctx.restore();
          }

          ctx.restore();
        }

        function drawPointer() {
          ctx.save();

          ctx.translate(CX, CY);

          ctx.fillStyle = "#f00";
          ctx.beginPath();
          ctx.arc(mx, my, POINTER_R, 0, Math.PI * 2, true);
          ctx.fill();

          ctx.restore();
        }

        function draw() {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          drawWheel();
          drawPointer();
          if (sel) drawArrow();
          drawItems();

          // tracker.textContent = "Sel? : " + sel + "   Id: " + sel_id;
        }

        function updatePosition(e) {
          mx += e.movementX;
          my += e.movementY;
          let mag = Math.sqrt(mx * mx + my * my);

          const clamp = WHEEL_INNER_R - POINTER_R;
          if (mag > clamp) {
            mx *= clamp / mag;
            my *= clamp / mag;
            mag = clamp;
          }

          let angle = (Math.atan2(my, mx) * 180) / Math.PI;
          angle = (angle + 360 + 90 + 22.5) % 360;

          if (mag > WHEEL_SEL_R) {
            sel = true;
            sel_id = Math.floor(angle / 45);
          } else {
            sel = false;
          }

          if (!animation) {
            animation = requestAnimationFrame(function () {
              animation = null;
              draw();
            });
          }
        }

        function setupMouseListener() {
          function lockChangeAlert() {
            if (document.pointerLockElement === canvas) {
              // console.log("The pointer lock status is now locked");
              document.addEventListener("mousemove", updatePosition, false);
            } else {
              console.log("The pointer lock status is now unlocked");
              if (sel) {
                // if (sel_id > 0 && sel_id < 8 && items[sel_id] && )

                if (items[sel_id]?.url) window.open(items[sel_id].url, "_blank");
              }
              document.removeEventListener("mousemove", updatePosition, false);
            }
          }
          document.addEventListener("pointerlockchange", lockChangeAlert, false);
        }

        function init() {
          container = document.getElementById("wheel-container");
          canvas = document.getElementById("tutorial");
          // if (!canvas?.getContext) throw new Error("Not support canvas");
          ctx = canvas.getContext("2d");
          tracker = document.getElementById("tracker");

          setupKeyboardListener();
          setupMouseListener();

          draw();
        }

        init();
      });
    });
  // document.body.style.backgroundColor = 'red';

  // const ele = document.createElement();
}

chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.create({ url: chrome.runtime.getURL("wheelSettings.html") });
});

// chrome.action.onClicked.addListener((tab) => {
//   console.log(">>");
//   chrome.scripting.executeScript({
//     target: { tabId: tab.id },
//     function: reddenPage,
//   });
// });
function injectWheelIframe() {
  fetch(chrome.runtime.getURL("/wheelIframe.html"))
    .then((r) => r.text())
    .then((html) => {
      if (!document.getElementById("wheel-iframe")) {
        document.body.insertAdjacentHTML("beforebegin", html);

        // TODO find by position
        const iframeEle = document.getElementById("wheel-iframe") as HTMLIFrameElement;
        iframeEle.src = chrome.runtime.getURL("wheel.html");
        // iframeEle.onfocus = () => console.log("focused");
        // iframeEle.onblur = () => console.log("lose focused");

        document.addEventListener(
          "keydown",
          (event) => {
            if (event.altKey && event.key === "z") {
              console.log(">> ", iframeEle.style.display);
              if (iframeEle.style.display === "none" || !iframeEle.style.display) {
                iframeEle.style.display = "flex";
                iframeEle.focus();
              }
            }
          },
          true
        );

        // document.addEventListener("keyup", (event) => {
        //   if (event.key === "Alt" || event.key === "z") {
        //     console.log("top >> key up");
        //     // if (iframeEle.style.display === "flex") {
        //     iframeEle.style.display = "none";
        //     // iframeEle.focus();
        //     // }
        //   }
        // });

        window.addEventListener("message", (event) => {
          if ((event as MessageEvent).data === "exit") {
            console.log("top >> key up");
            iframeEle.style.display = "none";
            // iframeEle.focus();
          }
        });
      }

      // const iframeEle = document.getElementById("wheel-iframe") as HTMLIFrameElement;
      // iframeEle.style.display = "flex";
      // iframeEle.contentWindow.focus();
      // iframeEle.contentWindow.disp(new KeyboardEvent("keydown", { key: "s", altKey: true }));
      // iframeEle.contentWindow.postMessage("start", "*");

      // document.body.insertAdjacentHTML("beforebegin", html);
    });
}

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  //code in here will run every time a user goes onto a new tab, so you can insert your scripts into every new tab
  // tab.
  // reddenPage();

  // console.log(JSON.stringify(changeInfo));
  if (changeInfo.status === "loading") {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: injectWheelIframe,
      // func: reddenPage,
    });

    // chrome.scripting.executeScript({
    //   target: { tabId: tab.id },
    //   file: "wheel.js",
    // });
  }
});

// chrome://flags/#extensions-on-chrome-urls
