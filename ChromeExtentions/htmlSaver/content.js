let collectedData = localStorage.getItem("collectedData") || "";
let pageCount = parseInt(localStorage.getItem("pageCount")) || 0;
const maxPages = parseInt(localStorage.getItem("maxPages")) || 50;
const delay = parseInt(localStorage.getItem("delay")) || 2000;
const contentClass = localStorage.getItem("contentClass") || "post-content";
const nextButtonClass = localStorage.getItem("nextButtonClass") || "next";

function extractDataAndNext() {
  const postContent = document.querySelector(`.${contentClass}`);
  if (!postContent) return;

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "childList" || mutation.type === "subtree") {
        observer.disconnect();
        collectedData += postContent.innerText + "\n\n";
        localStorage.setItem("collectedData", collectedData);
        proceedToNextPage();
      }
    });
  });

  observer.observe(postContent, {
    childList: true,
    subtree: true,
  });

  // Fallback in case translation doesn't trigger mutation
  setTimeout(() => {
    observer.disconnect();
    collectedData += postContent.innerText + "\n\n";
    localStorage.setItem("collectedData", collectedData);
    proceedToNextPage();
  }, delay + 5000); // Adding extra time to ensure translation
}

function proceedToNextPage() {
  pageCount++;
  localStorage.setItem("pageCount", pageCount);

  if (pageCount < maxPages) {
    const nextButton = document.querySelector(`.${nextButtonClass}`);
    if (nextButton) {
      nextButton.click();
      setTimeout(extractDataAndNext, delay + 2000); // Wait for the next page to load and translate
    }
  } else {
    chrome.runtime.sendMessage({ action: "downloadData", data: collectedData });
    localStorage.removeItem("collectedData");
    localStorage.removeItem("pageCount");
  }
}

// Start the process
extractDataAndNext();
