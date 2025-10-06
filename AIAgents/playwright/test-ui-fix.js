// Simple test to verify the UI testing fix
const { runUITesting } = require("./src/uiTesting/index.ts");

async function testUIFix() {
  console.log("🧪 Testing UI Testing Fix...");

  const testPrompt =
    "go to https://dashboard.mindler.com/login\nuse credentials drcode1@gmail.com, password: 12345\ngo to all services button, open assessment, start answering questions from mcq. select random answers. after 5 answers, try to go back and verify the back functionality. ideally it should be able to go back only one question. try going back more than one question and confirm if it is happening or not?";

  try {
    await runUITesting(testPrompt);
    console.log("✅ Test completed");
  } catch (error) {
    console.error("❌ Test failed:", error.message);
  }
}

testUIFix();
