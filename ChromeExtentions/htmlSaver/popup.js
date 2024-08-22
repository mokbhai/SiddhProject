document.getElementById("start").addEventListener("click", () => {
  const iterations = document.getElementById("iterations").value;
  const speed = document.getElementById("speed").value;
  const contentClass = document.getElementById("contentClass").value;
  const nextButtonClass = document.getElementById("nextButtonClass").value;

  localStorage.setItem("maxPages", iterations);
  localStorage.setItem("delay", speed);
  localStorage.setItem("contentClass", contentClass);
  localStorage.setItem("nextButtonClass", nextButtonClass);

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      files: ["content.js"],
    });
  });
});
