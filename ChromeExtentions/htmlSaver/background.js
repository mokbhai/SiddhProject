chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "downloadData") {
    const dataUrl =
      "data:text/plain;charset=utf-8," + encodeURIComponent(request.data);
    chrome.downloads.download({
      url: dataUrl,
      filename: "collected_data.txt",
    });
  }
});
