var baseUrl = "";
const currentFeatureList = JSON.parse(localStorage.getItem("features"));

const updateBrowserStorage = (key, value) => {
  const oldLocalstorage = JSON.parse(localStorage.getItem("features"));
  localStorage.setItem(
    "features",
    JSON.stringify({ ...oldLocalstorage, [key]: value })
  );
  window.location.reload();
};

const FEATURE_LIST_INITIAL_VALUES = {
  USE_SEARCH: false,
  "*": false,
};

const generateFeatures = () => {
  const currentFeatures = Object.entries({
    ...FEATURE_LIST_INITIAL_VALUES,
    ...currentFeatureList,
  }).map(([key, value]) => ({ name: key, value: value }));
  console.log(currentFeatures);
  const featureList = document.querySelector("#feature-list");
  for (let i = 0; i < currentFeatures.length; i++) {
    const li = document.createElement("li");
    const currentFeature = currentFeatures[i];

    li.innerHTML = ` <span>${currentFeature.name}</span> <label class="switch">
    <input class="feature-switch" ${currentFeature.value && "checked"} name="${
      currentFeature.name
    }" type="checkbox" id="${currentFeature.name}">
    <span class="slider round"></span>
  </label>`;
    featureList.appendChild(li);
  }
};

document.addEventListener("DOMContentLoaded", function () {
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, function (tabs) {
    const tab = tabs[0];

    generateFeatures();

    document.querySelectorAll(".feature-switch").forEach((item) => {
      item.addEventListener("click", (event) => {
        const eventCaller = event.target.name;

        console.log(
          "update storage ",
          JSON.stringify({
            ...currentFeatureList,
            [eventCaller]: event.target.checked,
          })
        );

        localStorage.setItem(
          "features",
          JSON.stringify({
            ...currentFeatureList,
            [eventCaller]: event.target.checked,
          })
        );

        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: updateBrowserStorage,
          args: [eventCaller, event.target.checked],
        });
      });
    });
  });
});
