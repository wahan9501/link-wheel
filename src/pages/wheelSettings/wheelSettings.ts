import "./wheelSettings.css";
import wheelSettingsLine from "./wheelSettingsLine.svg";

interface WheelItem {
  titile: string;
  url: string;
}

function set(key, item): Promise<void> {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set({ key: item }, () => {
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError);
      }
      resolve();
    });
  });
}

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

const key = "wheelItems";

function init() {
  // Draw lines.
  for (let i = 0; i < 8; i++) {
    let line = document.createElement("div");
    line.className = "line";
    let img = new DOMParser().parseFromString(
      wheelSettingsLine,
      "image/svg+xml"
    ).documentElement;
    line.appendChild(img);
    line.style.transform = `translate(-50%, -50%) translate(50vw, 50vh) translate(-200px, 0) rotate(${
      i * 45
    }deg)`;
    document.body.appendChild(line);
  }

  // Draw items.
  // TODO draw ellipse path instead of circle.
  for (let i = 0; i < 8; i++) {
    let item = document.createElement("div");
    item.className = "item";
    item.tabIndex = -1;
    item.style.transform = `translate(-50%, -50%) translate(50vw, 50vh) rotate(${
      i * 45
    }deg) translate(-380px, 0) rotate(${-i * 45}deg)`;

    let text = document.createElement("div");
    text.className = "text";
    text.innerText = "N/A";

    item.appendChild(text);
    document.body.appendChild(item);
  }
}

init();

// chrome.storage.local.get(key, function (result) {
//   let workItems;
//   if (result && result[key]) {
//     workItems = result[key] as WheelItem[];
//   } else {
//     workItems = new Array(8);
//   }

//   for (let i = 0; i < 8; i++) {
//     if (workItems[i]) {
//       const inputItem = document.getElementsByClassName("input-item")[i];
//       const titleInput = inputItem
//         .getElementsByClassName("input-title")[0]
//         .getElementsByTagName("input")[0];
//       titleInput.value = workItems[i].title;
//       const urlInput = inputItem
//         .getElementsByClassName("input-url")[0]
//         .getElementsByTagName("input")[0];
//       urlInput.value = workItems[i].url;
//     }
//   }

//   const onSaveBtnClick = () => {
//     for (let i = 0; i < 8; i++) {
//       const inputItem = document.getElementsByClassName("input-item")[i];
//       const title = inputItem
//         .getElementsByClassName("input-title")[0]
//         .getElementsByTagName("input")[0].value;
//       const url = inputItem
//         .getElementsByClassName("input-url")[0]
//         .getElementsByTagName("input")[0].value;
//       if (title && url && validURL(url)) {
//         workItems[i] = { title, url };
//       }
//     }

//     chrome.storage.local.set({ [key]: workItems }, () => {
//       alert("saved!");
//     });
//   };

//   document.getElementById("saveBtn").onclick = onSaveBtnClick;
//   document.getElementById("root").style.display = "block";
// });
