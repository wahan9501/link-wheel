const wheelHtml = `<style>
  #wheel-container {
    display: none;
    position: fixed;
    z-index: 9999;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    background-color: rgba(0, 0, 0, 0.3);
    /* backdrop-filter: blur(3px) brightness(50%) grayscale(20%); */
  }

  #wheel-container > div {
    position: fixed;
  }

  canvas {
    margin: auto;
    visibility: hidden;
  }

  #wheel-arrow > svg {
    transform: rotate(-45deg);
  }

  .wheel-item {
    position: fixed;
    width: 16em;
  }

  .wheel-item-text {
    text-decoration: none;

    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;

    padding: 1em;
    word-break: break-word;
    text-align: center;

    font-size: 2em;
    line-height: 1em;
    color: #ffffff;

    transition: all 0.2s;
  }

  .wheel-item-text-selected {
    font-size: 3em;
    color: #ffffff;
    animation: neon 1.5s ease-in-out infinite alternate;
  }

  @keyframes neon {
    from {
      text-shadow: 0 0 4px #fff, 0 0 8px #fff, 0 0 12px #fff, 0 0 16px #abebc6, 0 0 28px #abebc6, 0 0 32px #abebc6, 0 0 40px #abebc6, 0 0 60px #abebc6;
    }
    to {
      text-shadow: 0 0 12px #fff;
    }
  }
</style>

<div id="wheel-container">
  <canvas class="wheel-canvas" width="0" height="0"></canvas>
  <div id="wheel-panel">
    <svg version="1.1" width="100%" height="100%" viewbox="-10 -10 120 120" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <mask id="panel-mask-ring" clipPathUnits="userSpaceOnUse">
          <circle cx="50" cy="50" r="50" fill="white" />
          <circle cx="50" cy="50" r="40" file="black" />
        </mask>
        <mask id="panel-mask-outer-ring" clipPathUnits="userSpaceOnUse">
          <rect x="-10" y="-10" width="120" height="120" fill="white" />
          <circle cx="50" cy="50" r="49.9" file="black" />
        </mask>
        <mask id="panel-mask-inner-ring" clipPathUnits="userSpaceOnUse">
          <rect x="-10" y="-10" width="120" height="120" fill="white" />
          <circle cx="50" cy="50" r="39.9" file="black" />
        </mask>
        <radialGradient id="panel-grad" cx="25%" cy="25%" r="100%">
          <stop offset="0%" stop-color="#eee" stop-opacity="90%" />
          <stop offset="50%" stop-color="#eee" stop-opacity="75%" />
          <stop offset="90%" stop-color="#eee" stop-opacity="0%" />
        </radialGradient>
        <filter id="panel-filter-light" filterUnits="objectBoundingBox">
          <feDropShadow dx="0" dy="0" stdDeviation="0.1" flood-color="white" />
        </filter>
        <filter id="panel-filter-outer-shadow" filterUnits="objectBoundingBox">
          <feGaussianBlur stdDeviation="2" />
          <feOffset dx="0" dy="6" result="offsetBlur" />
        </filter>
        <filter id="panel-filter-inner-shadow" filterUnits="objectBoundingBox">
          <feOffset dx="0" dy="6" />
          <feGaussianBlur stdDeviation="3" result="offsetBlur" />
          <feComposite operator="out" in="SourceGraphic" result="inverse" />
          <feFlood flood-color="black" flood-opacity="0.75" result="color" />
          <feComposite operator="in" in="color" in2="inverse" result="shadow" />
          <feComponentTransfer in="shadow" result="shadow">
            <feFuncA type="linear" slope="1.1" />
          </feComponentTransfer>
        </filter>
      </defs>
      <g id="panel">
        <circle cx="50" cy="50" r="50" fill="url(#panel-grad)" mask="url(#panel-mask-ring)" />
      </g>
      <g id="outer-light" mask="url(#panel-mask-outer-ring)">
        <circle cx="50" cy="49.5" r="50" fill="white" fill-opacity="0.95" filter="url(#panel-filter-light)" />
      </g>
      <g id="outer-shadow" mask="url(#panel-mask-outer-ring)">
        <circle cx="50" cy="50" r="50" fill="black" fill-opacity="0.75" filter="url(#panel-filter-outer-shadow)" />
      </g>
      <g id="inner-light" mask="url(#panel-mask-inner-ring)">
        <circle cx="50" cy="50.5" r="40" fill="white" fill-opacity="0.95" filter="url(#panel-filter-light)" />
      </g>
      <g id="inner-shadow">
        <circle cx="50" cy="50.5" r="40" fill="black" filter="url(#panel-filter-inner-shadow)" />
      </g>
    </svg>
  </div>
  <div id="wheel-pointer">
    <svg version="1.1" width="100%" height="100%" viewbox="-10 -10 120 120" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <clipPath id="cursor-clip" clipPathUnits="userSpaceOnUse">
          <circle cx="50" cy="50" r="50" />
        </clipPath>
        <mask id="cursor-mask" clipPathUnits="userSpaceOnUse">
          <rect x="-10" y="-10" width="120" height="120" fill="white" />
          <circle cx="50" cy="50" r="49.9" file="black" />
        </mask>
        <radialGradient id="cursor-grad-light">
          <stop offset="0%" stop-color="#fff" stop-opacity="100%" />
          <stop offset="100%" stop-color="#fff" stop-opacity="0%" />
        </radialGradient>
        <radialGradient id="cursor-grad-dark">
          <stop offset="0%" stop-color="#000" stop-opacity="100%" />
          <stop offset="100%" stop-color="#000" stop-opacity="0%" />
        </radialGradient>
        <filter id="cursor-filter-blur" filterUnits="objectBoundingBox">
          <feGaussianBlur stdDeviation="10" />
        </filter>
        <filter id="cursor-filter-shadow-round" filterUnits="objectBoundingBox">
          <feGaussianBlur stdDeviation="3" result="blur" />
        </filter>
        <filter id="cursor-filter-shadow-drop" filterUnits="objectBoundingBox">
          <feOffset dx="0" dy="6" result="offsetBlur" />
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>

      <g id="cursor" clip-path="url(#cursor-clip)" filter="url(#cursor-filter-blur)">
        <circle cx="50" cy="50" r="50" fill="silver" fill-opacity="0.5" />
        <ellipse cx="50" cy="0" rx="200" ry="45" fill="url(#cursor-grad-light)" />
        <ellipse cx="50" cy="100" rx="200" ry="45" fill="url(#cursor-grad-dark)" />
      </g>
      <g id="cursor-shadow-round" mask="url(#cursor-mask)">
        <circle cx="50" cy="50" r="50" fill="#444" fill-opacity="0.75" filter="url(#cursor-filter-shadow-round)" />
      </g>
      <g id="cursor-shadow-drop" mask="url(#cursor-mask)">
        <circle cx="50" cy="50" r="52" fill="#000" fill-opacity="0.75" filter="url(#cursor-filter-shadow-drop)" />
      </g>
    </svg>
  </div>
  <div id="wheel-arrow">
    <svg version="1.1" width="100%" height="100%" viewbox="-10 -10 70 70" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <path id="arrow-path" d="M 0 0 A 100 100, 0, 0, 1, 50 50 L 50 0 Z" />
        <mask id="arrow-mask" clipPathUnits="userSpaceOnUse">
          <rect x="-10" y="-10" width="120" height="120" fill="white" />
          <use href="#arrow-path" fill="black" />
        </mask>
        <linearGradient id="arrow-grad">
          <stop offset="0%" stop-color="white" />
          <stop offset="33%" stop-color="white" stop-opacity="80%" />
          <stop offset="66%" stop-color="white" stop-opacity="65%" />
          <stop offset="100%" stop-color="white" stop-opacity="50%" />
        </linearGradient>
        <filter id="arrow-filter-shadow-round" filterUnits="objectBoundingBox">
          <feOffset dx="-1" dy="-1" result="offsetBlur" />
          <feGaussianBlur stdDeviation="2" />
        </filter>
        <filter id="arrow-filter-shadow" filterUnits="objectBoundingBox">
          <feOffset dx="1" result="offsetBlur" />
          <feGaussianBlur stdDeviation="1" />
        </filter>
      </defs>
      <g id="arrow-shadow-round">
        <use href="#arrow-path" fill="url(#arrow-grad)" />
      </g>
      <g id="arrow-shadow" mask="url(#arrow-mask)">
        <use href="#arrow-path" fill="black" fill-opacity="0.5" filter="url(#arrow-filter-shadow)" />
      </g>
    </svg>
  </div>
  <div id="wheel-sel-light">
    <svg version="1.1" width="100%" height="100%" viewbox="-10 -10 120 120" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <clipPath id="sel-light-clip" clipPahtUnits="userSpaceOnUse">
          <circle cx="50" cy="50" r="60" />
        </clipPath>
        <radialGradient id="sel-light-grad">
          <stop offset="0%" stop-color="#fff" stop-opacity="100%" />
          <stop offset="20%" stop-color="#fff" stop-opacity="80%" />
          <stop offset="30%" stop-color="#fff" stop-opacity="30%" />
          <stop offset="100%" stop-color="#fff" stop-opacity="0%" />
        </radialGradient>
        <filter id="light-filter" filterUnits="objectBoundingBox">
          <feGaussianBlur stdDeviation="10" edgeMode="duplicate" />
        </filter>
      </defs>
      <g id="arrow-shadow" clip-path="url(#sel-light-clip)">
        <circle cx="50" cy="50" r="50" fill="url(#sel-light-grad)" fill-opacity="0.9" filter="url(#light-filter)" />
      </g>
    </svg>
  </div>
</div>
`
const  WHEEL_ITEMS_STORAGE_KEY = "WHEEL_ITEMS",

const SEL_RANGE = 55;
const POINTER_R = 30;
const PANEL_R = 120;
const ARROW_OFFSET = 100;
const ITEM_DIST = 200;
const SEL_LIGHT_R = 100;
const SEL_LIGHT_OFFSET = 80;

let containerEle;
let canvasEle;
let pointerEle;
let panelEle;
let panelLightEle;
let arrowEle;
let animation;
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
    panelEle.style.opacity = "1.0";
  } else {
    panelEle.style.opacity = "0.8";
  }
}

function drawPointer() {
  pointerEle.style.transform = `translate(${CX + mx - POINTER_R}px, ${CY + my - POINTER_R}px)`;
  if (sel) {
    pointerEle.style.opacity = "1.0";
    panelLightEle.style.transform = `translate(${
      CX - SEL_LIGHT_R / 2 + SEL_LIGHT_OFFSET * Math.sin(sel_id * 45 * (Math.PI / 180))
    }px, ${CY - SEL_LIGHT_R / 2 - SEL_LIGHT_OFFSET * Math.cos(sel_id * 45 * (Math.PI / 180))}px)`;
    panelLightEle.style.display = "block";
  } else {
    pointerEle.style.opacity = "0.8";
    panelLightEle.style.display = "none";
  }
}

function drawArrow() {
  arrowEle.style.transformOrigin = `50% ${ARROW_OFFSET + PANEL_R / 4}px`;
  arrowEle.style.transform = `translate(${CX - PANEL_R / 4}px, ${CY - PANEL_R / 4 - ARROW_OFFSET}px) rotate(${
    sel_id * 45
  }deg)`;

  if (sel) {
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
  });

  if (sel) {
    wheelItemEles[sel_id].firstChild.className = "wheel-item-text wheel-item-text-selected";
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

  const clamp = PANEL_R - POINTER_R * 2;
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
      if (event.altKey && (event.key === "s" || event.key === "S")) {
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
      if (event.key === "Alt" || event.key === "s" || event.key === "S") {
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
    updateCenterPoint(e.currentTarget.innerWidth / 2, e.currentTarget.innerHeight / 2);
  });
}

function initPanel() {
  panelEle = document.getElementById("wheel-panel");
  panelEle.style.width = `${PANEL_R * 2}px`;
  panelEle.style.height = `${PANEL_R * 2}px`;
  panelEle.style.transform = `translate(${CX - PANEL_R}px, ${CY - PANEL_R}px)`;
}

function initPointer() {
  pointerEle = document.getElementById("wheel-pointer");
  pointerEle.style.width = `${POINTER_R * 2}px`;
  pointerEle.style.height = `${POINTER_R * 2}px`;

  panelLightEle = document.getElementById("wheel-sel-light");
  panelLightEle.style.width = `${SEL_LIGHT_R}px`;
  panelLightEle.style.height = `${SEL_LIGHT_R}px`;
  panelLightEle.style.display = "block";
}

function initArrow() {
  arrowEle = document.getElementById("wheel-arrow");
  arrowEle.style.width = `${PANEL_R / 2}px`;
  arrowEle.style.height = `${PANEL_R / 2}px`;
  arrowEle.style.transform = `translate(${CX - PANEL_R / 4}px, ${CY - PANEL_R / 4 - ARROW_OFFSET}px) rotate(${-45}deg)`;
  arrowEle.style.display = "none";
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

chrome.storage.local.get(Constants.WHEEL_ITEMS_STORAGE_KEY, (result) => {
  const items = result[Constants.WHEEL_ITEMS_STORAGE_KEY] ?? new Array(8);

  init(items);
});
