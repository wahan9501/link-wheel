const SEL_RANGE = 55;
const POINTER_R = 30;
const PANEL_R = 120;
const ARROW_OFFSET = 100;
const ITEM_DIST = 200;
const SEL_LIGHT_R = 100;
const SEL_LIGHT_OFFSET = 80;

let containerEle;
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

    if (i === 0) {
      e.firstChild.style.transform = `translate(-50%, -50%)`;
    } else if (i === 1) {
      e.firstChild.style.transform = `translate(0%, -50%) translateX(-2.5rem)`;
    } else if (i === 2) {
      e.firstChild.style.transform = `translate(0%, -50%) translateX(-2.5rem)`;
    } else if (i === 3) {
      e.firstChild.style.transform = `translate(0%, -50%) translateX(-2.5rem)`;
    } else if (i === 4) {
      e.firstChild.style.transform = `translate(-50%, -50%)`;
    } else if (i === 5) {
      e.firstChild.style.transform = `translate(-100%, -50%) translateX(2.5rem)`;
    } else if (i === 6) {
      e.firstChild.style.transform = `translate(-100%, -50%) translateX(2.5rem)`;
    } else if (i === 7) {
      e.firstChild.style.transform = `translate(-100%, -50%) translateX(2.5rem)`;
    }

    if (sel && sel_id === i) {
      e.firstChild.className = "wheel-item-text wheel-item-text-selected";
      e.firstChild.style.transform += " scale(1.2)";
    } else {
      e.firstChild.className = "wheel-item-text";
    }
  });
}

function draw() {
  drawPanel();
  drawPointer();
  drawArrow();
  drawWheelItems();
}

function render() {
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

  render();
}

function setupEventListener() {
  window.addEventListener("message", (event) => {
    if (event.data.type === "mousemove") {
      updatePosition(event.data);
    } else if (event.data.type === "exit") {
      if (sel) {
        if (wheelItems[sel_id]?.url) {
          window.parent.postMessage({ type: "openurl", url: wheelItems[sel_id].url }, "*");
        }
      }
      reset();
    }
  });
}

function updateCenterPoint(WIDTH, HEIGHT) {
  CX = WIDTH;
  CY = HEIGHT;
  render();
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

    if (i === 0) {
      wheelItemText.style.textAlign = "center";
      wheelItemText.style.transformOrigin = "bottom";
      wheelItemText.style.transform = `translate(-50%, -50%)`;
    } else if (i === 1) {
      wheelItemText.style.textAlign = "left";
      wheelItemText.style.transformOrigin = "left bottom";
      wheelItemText.style.transform = `translate(0%, -50%) translateX(-2.5rem)`;
    } else if (i === 2) {
      wheelItemText.style.textAlign = "left";
      wheelItemText.style.transformOrigin = "left";
      wheelItemText.style.transform = `translate(0%, -50%) translateX(-2.5rem)`;
    } else if (i === 3) {
      wheelItemText.style.textAlign = "left";
      wheelItemText.style.transformOrigin = "left top";
      wheelItemText.style.transform = `translate(0%, -50%) translateX(-2.5rem)`;
    } else if (i === 4) {
      wheelItemText.style.textAlign = "center";
      wheelItemText.style.transformOrigin = "top";
      wheelItemText.style.transform = `translate(-50%, -50%)`;
    } else if (i === 5) {
      wheelItemText.style.textAlign = "right";
      wheelItemText.style.transformOrigin = "right top";
      wheelItemText.style.transform = `translate(-100%, -50%) translateX(2.5rem)`;
    } else if (i === 6) {
      wheelItemText.style.textAlign = "right";
      wheelItemText.style.transformOrigin = "right";
      wheelItemText.style.transform = `translate(-100%, -50%) translateX(2.5rem)`;
    } else if (i === 7) {
      wheelItemText.style.textAlign = "right";
      wheelItemText.style.transformOrigin = "right bottom";
      wheelItemText.style.transform = `translate(-100%, -50%) translateX(2.5rem)`;
    }

    wheelItemEles.push(wheelItem);
    containerEle.append(wheelItem);
  }
}

function init(wheelItems) {
  containerEle = document.getElementById("wheel-container");

  setupEventListener();
  addResizeListener();

  updateCenterPoint(window.innerWidth / 2, window.innerHeight / 2);

  initWheelItems(wheelItems);
  initPanel();
  initPointer();
  initArrow();

  render();
}

IStorage.getWheelItems().then((items) => {
  init(items);
});
