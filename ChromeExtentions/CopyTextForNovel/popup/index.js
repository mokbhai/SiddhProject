document.getElementById("start").addEventListener("click", async () => {
  // Get the value entered in the input field
  const repetitions = Number(document.getElementById("repetitions").value);

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
