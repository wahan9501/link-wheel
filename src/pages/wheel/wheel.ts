import wheelHtml from "./wheel.html";

const SEL_RANGE = 50;
const POINTER_R = 20;
const PANEL_R = 80;
const ARROW_OFFSET = 40;
const ITEM_DIST = 160;

let containerEle;
let canvasEle;
let pointerEle;
let panelEle;
let panelLightEle;
let arrowEle;

var animation;

let wheelItems;
let CX = 0;
let CY = 0;
let mx = 0;
let my = 0;
let m_angle = 0;
let sel = false;
let sel_id = -1;
let wheelItemEles = [];

function reset() {
  m_angle = 0;
  mx = 0;
  my = 0;
  sel = false;
  sel_id = -1;
}

function drawPanel() {
  panelEle.style.transform = `translate(${CX - PANEL_R}px, ${CY - PANEL_R}px)`;
  if (sel) {
    panelLightEle.style.transform = `rotate(${m_angle}deg)`;
    panelLightEle.style.display = "block";
  } else {
    panelLightEle.style.display = "none";
  }
}

function drawPointer() {
  pointerEle.style.transform = `translate(${CX + mx - POINTER_R}px, ${CY + my - POINTER_R}px)`;
  if (sel) pointerEle.style.opacity = "0.85";
  else pointerEle.style.opacity = "0.5";
}

function drawArrow() {
  if (sel) {
    arrowEle.style.transform = `rotate(-45deg)`;
    arrowEle.style.transform = `translate(${CX}px, ${CY - PANEL_R}px) rotate(${m_angle - 45}deg) translate(${-5}px, ${5}px)`;
    arrowEle.style.display = "block";
  } else {
    arrowEle.style.display = "none";
  }
}

function drawWheelItems() {
  wheelItemEles.forEach((e, i) => {
    const angle = (45 * i * Math.PI) / 180;
    let x = CX + ITEM_DIST * Math.sin(angle);
    let y = CY - ITEM_DIST * Math.cos(angle);
    e.style.transform = `translate(${x}px, ${y}px)`;

    e.firstChild.className = "wheel-item-text";
    e.firstChild.style.fontSize = "2rem";
  });

  if (sel) {
    wheelItemEles[sel_id].firstChild.className = "wheel-item-text wheel-item-text-selected";
    wheelItemEles[sel_id].firstChild.style.fontSize = "3rem";
  }
}

function draw() {
  drawPanel();
  drawPointer();
  drawArrow();
  drawWheelItems();
}

function update() {
  if (!animation) {
    animation = requestAnimationFrame(function () {
      animation = null;
      draw();
    });
  }
}

function updatePosition(e) {
  mx += e.movementX;
  my += e.movementY;
  let mag = Math.sqrt(mx * mx + my * my);

  const clamp = PANEL_R - POINTER_R;
  if (mag > clamp) {
    mx *= clamp / mag;
    my *= clamp / mag;
    mag = clamp;
  }

  m_angle = (Math.atan2(my, mx) * 180) / Math.PI;
  m_angle = (m_angle + 360 + 90) % 360;

  if (mag > SEL_RANGE) {
    sel = true;
    sel_id = Math.floor(((m_angle + 22.5) % 360) / 45);
  } else {
    sel = false;
  }

  update();
}

function addKeyboardListener() {
  document.addEventListener(
    "keydown",
    (event) => {
      if (event.altKey && event.key === "s") {
        if (containerEle.style.display === "none") {
          reset();
          draw();
        }
        containerEle.style.display = "flex";
        canvasEle.requestPointerLock();
      }
    },
    true
  );

  document.addEventListener(
    "keyup",
    (event) => {
      if (event.key === "Alt" || event.key === "s") {
        containerEle.style.display = "none";
        document.exitPointerLock();
      }
    },
    true
  );
}

function addMouseListener() {
  function lockChangeAlert() {
    if (document.pointerLockElement === canvasEle) {
      document.addEventListener("mousemove", updatePosition, false);
    } else {
      if (sel) {
        if (wheelItems[sel_id]?.url) window.open(wheelItems[sel_id].url, "_blank");
      }
      document.removeEventListener("mousemove", updatePosition, false);
    }
  }
  document.addEventListener("pointerlockchange", lockChangeAlert, false);
}

function updateCenterPoint(WIDTH, HEIGHT) {
  CX = WIDTH;
  CY = HEIGHT;
  update();
}

function addResizeListener() {
  window.addEventListener("resize", (e) => {
    updateCenterPoint((e.currentTarget as Window).innerWidth / 2, (e.currentTarget as Window).innerHeight / 2);
  });
}

function initPanel() {
  panelLightEle = document.createElement("div");
  panelLightEle.className = "wheel-panel-light";
  panelLightEle.style.width = `${PANEL_R * 2}px`;
  panelLightEle.style.height = `${PANEL_R * 2}px`;
  panelLightEle.style.display = "none";

  panelEle = document.createElement("div");
  panelEle.className = "wheel-panel";
  panelEle.style.width = `${PANEL_R * 2}px`;
  panelEle.style.height = `${PANEL_R * 2}px`;
  panelEle.style.transform = `translate(${CX - PANEL_R}px, ${CY - PANEL_R}px)`;
  panelEle.appendChild(panelLightEle);

  panelEle.appendChild(panelLightEle);
  containerEle.appendChild(panelEle);
}

function initPointer() {
  var parser = new DOMParser();
  // pointerEle = parser.parseFromString(pointerImg, "image/svg+xml").documentElement;
  // console.log(">>", pointerEle);

  // pointerEle.style.width = `${POINTER_R * 2}px`;
  // pointerEle.style.height = `${POINTER_R * 2}px`;

  // pointerEle = document.createElement("div");
  // pointerEle.className = "wheel-pointer";
  // pointerEle.style.width = `${POINTER_R * 2}px`;
  // pointerEle.style.height = `${POINTER_R * 2}px`;
  // pointerEle.style.boxShadow = `inset ${-POINTER_R / 3}px ${-POINTER_R / 3}px ${(POINTER_R * 2) / 3}px  rgba(0,0,0,0.6), 1px 1px 5px #3e3e3e`;
  // containerEle.appendChild(pointerEle);
}

function initArrow() {
  arrowEle = document.createElement("div");
  arrowEle.className = "wheel-arrow";
  arrowEle.style.width = `${PANEL_R}px`;
  arrowEle.style.height = `${PANEL_R}px`;
  arrowEle.style.clipPath = `path("M ${ARROW_OFFSET} 0 A ${PANEL_R} ${PANEL_R}, 0, 0, 1, ${PANEL_R} ${PANEL_R - ARROW_OFFSET} L ${PANEL_R} 0 Z")`;
  arrowEle.style.display = "none";

  containerEle.appendChild(arrowEle);
}

function initWheelItems(items) {
  wheelItems = items ?? new Array(8);

  for (let i = 0; i < 8; i++) {
    let wheelItemText = document.createElement("div");
    wheelItemText.className = "wheel-item-text";
    wheelItemText.innerText = wheelItems[i]?.title ?? "N/A";

    let wheelItem = document.createElement("div");
    wheelItem.className = "wheel-item";
    wheelItem.append(wheelItemText);

    const angle = (45 * i * Math.PI) / 180;
    let x = CX + ITEM_DIST * Math.sin(angle);
    let y = CY - ITEM_DIST * Math.cos(angle);
    wheelItem.style.transform = `translate(${x}px, ${y}px)`;

    if (i === 0 || i === 4) {
      wheelItemText.style.textAlign = "center";
      wheelItemText.style.transform = "translate(-50%, -50%)";
    } else if (i > 0 && i < 4) {
      wheelItemText.style.textAlign = "left";
      wheelItemText.style.transform = "translate(0%, -50%) translateX(-2em)";
    } else if (i > 4 && i < 8) {
      wheelItemText.style.textAlign = "right";
      wheelItemText.style.transform = "translate(-100%, -50%) translateX(2em)";
    }

    wheelItemEles.push(wheelItem);
    containerEle.append(wheelItem);
  }
}

function init(wheelItems) {
  if (!document.getElementById("wheel-container")) {
    document.body.insertAdjacentHTML("beforebegin", wheelHtml);
    containerEle = document.getElementById("wheel-container");
    canvasEle = document.querySelector("canvas.wheel-canvas");

    // TODO remove listener?
    addKeyboardListener();
    addMouseListener();
    addResizeListener();

    updateCenterPoint(window.innerWidth / 2, window.innerHeight / 2);

    initWheelItems(wheelItems);
    initPanel();
    initPointer();
    initArrow();

    draw();
  }
}

const key = "wheelItems";
chrome.storage.local.get(key, (result) => {
  let items;
  if (result && result[key]) {
    items = result[key];
  } else {
    items = new Array(8);
  }

  console.log(">>>>", result, items);

  init(items);
});
