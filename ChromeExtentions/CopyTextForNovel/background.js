let allText = "";

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.action === "Download") {
    downloadTextFile(allText);
  }
});

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.action === "extractData") {
    console.log("Bg starting .... ");

    let tabId = Number(request.tabId);

    if (!tabId) {
      console.error("Tab ID not received in background script.");
      return;
    }

    let runCount = 0; // Counter to track the number of runs
    const maxRuns = Number(request.repetitions); // Maximum number of runs

    // Call the function to start extracting data
    extractDataFromPage({ runCount, maxRuns, tabId });
  }
});

function extractDataFromPage({ runCount, maxRuns, tabId }) {
  if (runCount >= maxRuns) {
    console.log("Reached the maximum number of runs. Stopping the process.");
    downloadTextFile(allText);
    return;
  }
  runCount++;

  setTimeout(() => {
    getContent(tabId);
    goToNextPage({ runCount, maxRuns, tabId });
  }, 2000);
}

function goToNextPage({ runCount, maxRuns, tabId }) {
  chrome.scripting.executeScript(
    {
      target: { tabId: tabId },
      func: () => {
        return document.querySelector("#linkNext")?.href || null;
      },
    },
    (nextLinkResults) => {
      if (chrome.runtime.lastError) {
        console.error("Error injecting script:", chrome.runtime.lastError);
        return;
      }

      const nextLink = nextLinkResults[0].result;

      if (nextLink) {
        const url = nextLink;
        chrome.tabs.update(tabId, { url: url }, () => {
          setTimeout(
            () => extractDataFromPage({ runCount, maxRuns, tabId }),
            1000
          ); // 1-second delay
        });
      } else {
        console.log("No next link found. Ending process.");
        downloadTextFile(allText);
      }
    }
  );
}

function getContent(tabId) {
  chrome.scripting.executeScript(
    {
      target: { tabId: tabId },
      func: () => {
        const element = document.querySelector(".readcontent");

        return element.textContent;
      },
    },
    (injectionResults) => {
      // Check if there was a runtime error
      if (chrome.runtime.lastError) {
        console.error("Runtime error:", chrome.runtime.lastError);
        return;
      }

      // Check if injectionResults is defined and has a result
      if (
        injectionResults &&
        injectionResults[0] &&
        injectionResults[0].result
      ) {
        const textContent = injectionResults[0].result;
        allText += `\n\n${textContent}\n\n`;
      } else {
        console.error(
          "Failed to extract content. injectionResults:",
          injectionResults
        );
        // Add more detailed debugging here to understand why injectionResults is not as expected
        // For example, check the length of injectionResults, log its contents, etc.
      }
    }
  );
}

const checkElement = () => {
  console.log("checkElement started");
  const element = document.querySelector(".readcontent");
  console.log("element:", element);

  if (!element) {
    console.warn("Element '.readcontent' not found. Retrying...");

    return setTimeout(checkElement, 100);
  }
  if (isContentInChinese(element.textContent)) {
    console.log("Content is still in Chinese. Waiting...");
    return setTimeout(checkElement, 100);
  }

  if (isContentTranslatedToEnglish(element.textContent)) {
    console.log("Content has been translated to English!");
    return element.textContent;
  }

  console.log("checkElement timed out or other error. Resolving with null.");
  return "Error ....";
};

// Function to download text file
function downloadTextFile(text) {
  const blob = new Blob([text], { type: "text/plain" });
  const reader = new FileReader();

  reader.onloadend = () => {
    const dataUrl = reader.result;
    chrome.downloads.download({
      url: dataUrl,
      filename: "extracted_data.txt",
    });
  };

  reader.readAsDataURL(blob);
}

// Function to check if the content is in English
function isContentTranslatedToEnglish(text) {
  // Simple heuristic: Check if the text contains common English words
  const englishWords = ["the", "and", "is", "of", "to", "in", "that", "it"];
  return englishWords.some((word) => text.includes(word));
}

// Function to check if the content is in Chinese
function isContentInChinese(text) {
  // Common Chinese characters and phrases
  const znWords = [
    "章", // Chapter
    "返回顶部", // Return to top
    "下一页", // Next page
    "上一页", // Previous page
    "目录", // Table of contents
    "小说", // Novel
    "阅读", // Read
    "作者", // Author
    "简介", // Introduction
    "更新", // Update
    "最新", // Latest
    "全部章节", // All chapters
    "正文", // Main text
    "书籍", // Book
    "首页", // Home page
    "结束", // End
    "开始", // Start
    "翻页", // Turn page
    "继续阅读", // Continue reading
    "评论", // Comments
    "推荐", // Recommend
    "收藏", // Bookmark
    "搜索", // Search
    "章节列表", // Chapter list
    "下载", // Download
    "分享", // Share
    "热门", // Popular
    "点击", // Click
    "阅读模式", // Reading mode
    "字体", // Font
    "大小", // Size
    "设置", // Settings
    "返回", // Return
    "更多", // More
    "免费", // Free
    "连载", // Serialized
    "完结", // Completed
    "更新中", // Updating
    "评论区", // Comment section
    "书架", // Bookshelf
    "登录", // Login
    "注册", // Register
    "退出", // Logout
    "用户", // User
    "账号", // Account
    "密码", // Password
    "确认", // Confirm
    "取消", // Cancel
    "加载中", // Loading
    "广告", // Advertisement
    "关闭", // Close
    "阅读记录", // Reading history
  ];

  // Check if any of the Chinese words are present in the text
  return znWords.some((word) => text.includes(word));
}
