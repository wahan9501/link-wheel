// function getWheelSettign() {
//     chrome.storage.sync.get
// }
import "./wheelSettings.css";

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
//         urlInput.value = workItems[i].url;
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

function render() {
  const wheel = document.createElement("div");
  wheel.innerText = "Hello World";

  document.body.appendChild(wheel);
}

// render();
