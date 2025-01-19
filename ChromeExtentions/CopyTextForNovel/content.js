// Function to create and inject the download button
function addDownloadButton() {
  // Check if the button already exists to avoid duplicates
  if (document.getElementById("custom-download-button")) return;

  // Create the button element
  const button = document.createElement("button");
  button.id = "custom-download-button";
  button.innerText = "Download";
  button.style.position = "fixed";
  button.style.bottom = "20px";
  button.style.right = "20px";
  button.style.padding = "10px 20px";
  button.style.backgroundColor = "#007bff";
  button.style.color = "#fff";
  button.style.border = "none";
  button.style.borderRadius = "5px";
  button.style.cursor = "pointer";
  button.style.zIndex = "10000";

  // Add click event listener to trigger the download
  button.addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "Download" });
  });

  // Append the button to the body
  document.body.appendChild(button);
}

// Add the button when the content script is loaded
addDownloadButton();
