// import "./wheel.css";

console.log("wheel.ts");

window.onload = () => {
  console.log("wheel.html onload");
  // let items;
  // if (result && result["wheelItems"]) {
  //   items = result["wheelItems"];
  // } else {
  //   items = new Array(8);
  // }

  const items = new Array(8);

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
    // window.top.addEventListener("keydown", () => {
    //   console.log("Listener from iframe");
    // });
    window.addEventListener("keydown", (event) => {
      // console.log("iframe >> key down");
      if (event.altKey && event.key === "z") {
        if (container.style.display === "none" || !container.style.display) {
          container.style.display = "flex";
          canvas.requestPointerLock();
          console.log("iframe >> key down");
          reset();
          draw();
        }
      }
    });

    document.addEventListener("keyup", (event) => {
      if (event.key === "Alt" || event.key === "z") {
        container.style.display = "none";
        console.log("iframe >> key up");
        window.parent.postMessage("exit", "*");
        window.parent.window.focus();
      }
    });
    // document.addEventListener("message", (event) => {
    //   console.log("iframe recv message");
    //   // if (event.altKey && event.key === "s") {
    //   if ((event as MessageEvent).data === "start") {
    //     reset();
    //     draw();
    //     canvas.requestPointerLock();
    //   }
    // });
    // window.onfocus = () => {
    //   console.log("wheel.html on focus");
    //   reset();
    //   draw();
    //   // canvas.requestPointerLock();
    // };
    // window.onblur = () => {
    //   console.log("wheel.html on blur");
    //   document.exitPointerLock();
    // };
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

  console.log("wheel.html loaded");
};
