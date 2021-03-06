import wheelSettingsLine from "./wheelSettingsLine.svg";
import "./wheelSettings.css";

function validURL(str) {
  var pattern = new RegExp(
    "^(https?:\\/\\/)" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // fragment locator
  return !!pattern.test(str);
}

let wheelItems;
let sel = -1;

function init(items = new Array(8)) {
  wheelItems = items;

  const wheelSelector = document.getElementById("wheel-selector");
  const wheelEditor = document.getElementById("wheel-editor");
  wheelSelector.onclick = () => {
    if (sel !== -1) document.getElementById(`item-${sel}`).className = "item";
    wheelEditor.style.display = "none";
    sel = -1;
  };

  // Draw lines.
  for (let i = 0; i < 8; i++) {
    let line = document.createElement("div");
    line.className = "line";
    let img = new DOMParser().parseFromString(wheelSettingsLine, "image/svg+xml").documentElement;
    line.appendChild(img);
    line.style.transform = `translate(-50%, -50%) translate(50vw, 50vh) translate(-200px, 0) rotate(${i * 45}deg)`;
    wheelSelector.appendChild(line);
  }

  // Draw items.
  // TODO draw ellipse path instead of circle.
  for (let i = 0; i < 8; i++) {
    let id = (i + 6) % 8;
    let text = document.createElement("div");
    text.className = "text";
    text.innerText = wheelItems[id]?.title ?? "N/A";

    let item = document.createElement("div");
    item.className = "item";
    item.tabIndex = -1;
    item.id = `item-${id}`;
    item.style.transform = `translate(-50%, -50%) translate(50vw, 50vh) rotate(${
      i * 45
    }deg) translate(-380px, 0) rotate(${-i * 45}deg)`;
    item.onclick = (e) => {
      if (id !== sel) {
        if (sel !== -1) {
          document.getElementById(`item-${sel}`).className = "item";
        }
        sel = id;
        item.className = "item item-selected";
        document.getElementById("input-title").value = wheelItems[sel]?.title ?? "";
        document.getElementById("input-url").value = wheelItems[sel]?.url ?? "";
        wheelEditor.style.display = "block";
      }
      e.stopPropagation();
    };

    item.appendChild(text);
    wheelSelector.appendChild(item);
  }

  // Bind save button callback.
  const saveBtn = document.getElementById("save-btn");
  saveBtn.onclick = () => {
    let title = document.getElementById("input-title").value;
    let url = document.getElementById("input-url").value;
    if (!validURL(url)) {
      alert("Invalid url");
      return;
    }

    wheelItems[sel] = { title, url };
    document.querySelector(`#item-${sel} .text`).innerText = title;
    IStorage.saveWheelItems(wheelItems).then(() => {
      alert("Saved!");
    });
  };

  // Bind clear button callback.
  const clearBtn = document.getElementById("clear-btn");
  clearBtn.onclick = () => {
    wheelItems[sel] = null;
    document.querySelector(`#item-${sel} .text`).innerText = "N/A";
    document.getElementById("input-title").value = "";
    document.getElementById("input-url").value = "";

    IStorage.saveWheelItems(wheelItems).then(() => {
      alert("Cleared!");
    });
  };

  wheelSelector.style.display = "block";
}

IStorage.getWheelItems().then((items) => {
  init(items);
});
