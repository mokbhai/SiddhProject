// // popup.js

// document.addEventListener("DOMContentLoaded", async () => {
//   try {
//     // Remove the button immediately when the popup loads
//     const button = document.getElementById("extractData");
//     if (button) {
//       button.remove();
//     }

//     // Get the current active tab
//     const [currentTab] = await chrome.tabs.query({
//       active: true,
//       currentWindow: true,
//     });

//     if (!currentTab || !currentTab.id) {
//       console.error("Could not get current tab ID in popup.");
//       return;
//     }

//     // Send a message to the background script to start the extraction process
//     chrome.runtime.sendMessage({ action: "extractData", tabId: currentTab.id });
//   } catch (error) {
//     console.error("Error in popup:", error);
//   }
// });

document.getElementById("start").addEventListener("click", async () => {
  // Get the value entered in the input field
  console.log("starting... ");
  const repetitions = Number(document.getElementById("repetitions").value);
  console.log(repetitions);

  // Validate the input
  if (!repetitions || repetitions <= 0) {
    alert("Please enter a valid number greater than 0.");
    return;
  }

  // Get the current active tab
  const [currentTab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });

  if (!currentTab || !currentTab.id) {
    console.error("Could not get current tab ID in popup.");
    return;
  }

  // Send a message to the background script
  chrome.runtime.sendMessage({
    action: "extractData",
    tabId: currentTab.id,
    repetitions: repetitions,
  });
});
