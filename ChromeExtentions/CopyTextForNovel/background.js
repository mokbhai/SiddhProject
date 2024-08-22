// background.js
chrome.runtime.onMessage.addListener((data) => {
  switch (data.event) {
    case "onStart":
      handleStart(data);
      break;
    default:
      break;
  }
});

const handleStart = (data) => {
  console.log("On start in background");
};
