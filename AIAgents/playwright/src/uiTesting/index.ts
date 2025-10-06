import { ChatOpenAI } from "@langchain/openai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { StateGraph, Annotation, START, END } from "@langchain/langgraph";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import {
  HumanMessage,
  AIMessage,
  type BaseMessage,
} from "@langchain/core/messages";
import { config, getLLMApiKey } from "../utils/config";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { MultiServerMCPClient } from "@langchain/mcp-adapters";
import * as path from "path";
import * as fs from "fs";

/**
 * UI Testing Automation Workflow
 *
 * This workflow demonstrates automated UI testing with intelligent analysis:
 * 1. Accepts URL and testing instructions from user prompt
 * 2. Uses Playwright MCP to automate browser interactions
 * 3. Performs comprehensive UI testing scenarios
 * 4. Analyzes all performed actions and interactions
 * 5. Generates detailed summary reports with insights
 * 6. Saves reports to ./uiTesting/summary directory
 *
 * Features:
 * - Smart interaction detection and analysis
 * - Screenshot capture at key testing points
 * - Performance and usability insights
 * - Comprehensive test coverage reporting
 * - Action-by-action analysis and recommendations
 */

// Define the state schema for our UI testing workflow
const UITestingState = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (x, y) => x.concat(y),
  }),
  currentStep: Annotation<string>({
    reducer: (x, y) => y ?? x,
  }),
  targetUrl: Annotation<string>({
    reducer: (x, y) => y ?? x,
  }),
  testingInstructions: Annotation<string>({
    reducer: (x, y) => y ?? x,
  }),
  mcpTools: Annotation<any[]>({
    reducer: (x, y) => y ?? x,
  }),
  testActions: Annotation<any[]>({
    reducer: (x, y) => y ?? x,
  }),
  screenshots: Annotation<string[]>({
    reducer: (x, y) => [...(x || []), ...(y || [])],
  }),
  testResults: Annotation<string>({
    reducer: (x, y) => y ?? x,
  }),
  analysisReport: Annotation<string>({
    reducer: (x, y) => y ?? x,
  }),
  summaryReport: Annotation<string>({
    reducer: (x, y) => y ?? x,
  }),
  status: Annotation<string>({
    reducer: (x, y) => y ?? x,
  }),
  analysisDepth: Annotation<string>({
    reducer: (x, y) => y ?? x,
  }),
  shouldProceed: Annotation<boolean>({
    reducer: (x, y) => y ?? x,
  }),
});

type chatModels = ChatOpenAI | ChatGoogleGenerativeAI;

type UITestingStateType = typeof UITestingState.State;

function configModel(): chatModels {
  let model: chatModels;
  if (config.llm.provider === "google") {
    // Initialize the ChatGeminiAI model
    model = new ChatGoogleGenerativeAI({
      model: config.llm.model,
      temperature: config.llm.temperature,
      apiKey: getLLMApiKey(),
    });
    console.log("✅ ChatGeminiAI model initialized");
  } else if (config.llm.provider === "openai") {
    model = new ChatOpenAI({
      modelName: config.llm.model,
      temperature: config.llm.temperature,
      apiKey: getLLMApiKey(),
    });
    console.log("✅ ChatOpenAI model initialized");
  } else if (
    config.llm.provider === "azure" ||
    config.llm.provider === "openrouter"
  ) {
    // Initialize the ChatOpenAI model
    model = new ChatOpenAI({
      modelName: config.llm.model,
      temperature: config.llm.temperature,
      configuration: {
        baseURL: config.llm.baseUrl,
        defaultHeaders: {
          "HTTP-Referer": "https://localhost:3000",
          "X-Title": "localhost (AI Job Applier)",
        },
      },
      apiKey: getLLMApiKey(),
    });
    console.log("✅ ChatOpenAI model initialized");
  } else {
    throw new Error(`Unsupported LLM provider: ${config.llm.provider}`);
  }
  return model;
}

async function uiTestingWorkflow() {
  console.log("🚀 Starting UI Testing Automation Workflow\n");

  // Initialize MCP client for Playwright tools
  console.log("🔧 Initializing Playwright MCP client...");
  const mcpClient = new MultiServerMCPClient({
    mcpServers: {
      playwright: config.mcp.playwright,
    },
  });

  try {
    let model: chatModels = configModel();

    console.log("🎯 Playwright MCP configuration:", config.mcp.playwright);

    // Get MCP tools
    const mcpTools = await mcpClient.getTools();
    const modelWithTools = model.bindTools(mcpTools);
    console.log(`✅ Loaded ${mcpTools.length} Playwright MCP tools`);

    // Define workflow nodes

    // 1. Setup MCP Tools Node - Initializes MCP tools for the workflow
    const setupMCPToolsNode = async (state: UITestingStateType) => {
      console.log("🔧 Setting up MCP tools...");

      return {
        messages: [new AIMessage("MCP tools initialized successfully")],
        currentStep: "mcp_setup",
        mcpTools,
      };
    };

    // 2. Parse User Input Node - Extracts URL and testing instructions
    const parseUserInputNode = async (state: UITestingStateType) => {
      console.log("📝 Parsing user input for URL and testing instructions...");

      const userMessage = state.messages[0];
      let targetUrl = "";
      let testingInstructions = "";

      if (userMessage && typeof userMessage.content === "string") {
        const content = userMessage.content;

        // Extract URL from the user's message
        const urlMatch = content.match(/(https?:\/\/[^\s]+)/);
        if (urlMatch) {
          targetUrl = urlMatch[1];
          // Remove URL from content to get testing instructions
          testingInstructions = content.replace(urlMatch[0], "").trim();
        } else {
          testingInstructions = content;
        }
      }

      if (!targetUrl || !targetUrl.startsWith("http")) {
        throw new Error("Please provide a valid URL for UI testing");
      }

      console.log(`🎯 Target URL: ${targetUrl}`);
      console.log(
        `📋 Testing Instructions: ${
          testingInstructions || "General UI testing"
        }`
      );

      return {
        messages: [new AIMessage(`URL and instructions parsed: ${targetUrl}`)],
        currentStep: "input_parsed",
        targetUrl,
        testingInstructions:
          testingInstructions ||
          "Perform comprehensive UI testing including navigation, interactions, and usability assessment",
      };
    };

    // 3. Execute UI Testing Node - Provides initial instructions to the agent
    const executeUITestingNode = async (state: UITestingStateType) => {
      console.log("🤖 Setting up UI testing automation instructions...");

      // Create comprehensive instructions for UI testing
      const testingInstructions = `You are an expert UI/UX tester with access to Playwright browser automation tools.
          
Your ultimate goal is to perform all the actions that user has instructed to and do not END until all the operations are completed!!

You have access to Playwright MCP tools to:
1. Navigate to web pages
2. Take screenshots at different stages
3. Interact with UI elements (click, type, hover, etc.)
4. Fill forms and input fields
5. Click buttons, links, and navigation elements
6. Handle authentication and login flows
7. Navigate through multi-step processes
8. Test specific functionality as requested

DIRECT AUTOMATION APPROACH:
Follow the user's specific instructions step by step:
1. **Navigate to the target URL: ${state.targetUrl}**
2. **Execute each instruction in sequence:**
   ${state.testingInstructions}
3. **Document everything:**
   - Take screenshots at each major step
   - Record all actions performed
   - Note any issues or unexpected behavior
   - Capture successful completions

CRITICAL DOCUMENTATION REQUIREMENTS:
- Take screenshots at key testing points
- Document every action performed
- Record any issues or bugs found
- Note positive aspects and good UX patterns
- Capture performance observations
- Document accessibility findings

BROWSER PERSISTENCE RULES:
- Keep browser open throughout testing
- Take regular screenshots for documentation
- Use headed mode for visibility
- Do NOT close browser windows
- Maintain browser session for analysis

Record all actions performed for the analysis report.

Please start by navigating to the target URL and then follow the testing instructions step by step.`;

      // Add the testing instructions as a human message to guide the agent
      const instructionMessage = new HumanMessage(testingInstructions);

      return {
        messages: [...(state.messages || []), instructionMessage],
        currentStep: "testing_instructions_set",
        status: "ready_for_automation",
      };
    };

    // 5. Analyze Test Results Node - Analyzes all performed actions
    const analyzeTestResultsNode = async (state: UITestingStateType) => {
      console.log("🔍 Analyzing test results and actions...");

      // Extract test results from the message history
      const allMessages = state.messages || [];
      const testResults = allMessages
        .filter((msg) => msg instanceof AIMessage)
        .map((msg) =>
          typeof msg.content === "string"
            ? msg.content
            : JSON.stringify(msg.content)
        )
        .join("\n\n");

      const analysisPrompt = ChatPromptTemplate.fromMessages([
        [
          "system",
          `You are an expert UI/UX analyst. Analyze the automation testing results and provide comprehensive insights.
          
          Create a detailed analysis covering:
          
          1. **Actions Performed Analysis:**
             - List all actions that were executed step by step
             - Document the sequence of interactions
             - Note any deviations from expected flow
          
          2. **Functionality Assessment:**
             - Did the specific functionality work as expected?
             - Were there any errors or issues encountered?
             - How responsive were the interactions?
          
          3. **User Experience Observations:**
             - How smooth was the overall flow?
             - Were there any confusing or problematic areas?
             - Did the interface behave predictably?
          
          4. **Issues and Bugs Found:**
             - Any functional issues or bugs discovered
             - Broken features or unexpected behavior
             - Performance problems or slow responses
          
          5. **Success Criteria:**
             - Which parts of the instructions were completed successfully?
             - What worked well in the application?
             - Any positive aspects of the user experience?
          
          6. **Recommendations:**
             - Immediate fixes needed
             - Improvements for better user experience
             - Technical optimizations suggested
          
          Focus on providing actionable insights based on the specific automation performed.`,
        ],
        [
          "human",
          `Please analyze the following automation testing results:
          
          Target URL: {url}
          Instructions Given: {instructions}
          Automation Messages: {results}
          
          Provide a comprehensive analysis of what happened during the automation and any issues found.`,
        ],
      ]);

      const chain = analysisPrompt.pipe(model);
      const result = await chain.invoke({
        url: state.targetUrl,
        instructions: state.testingInstructions,
        results: testResults,
      });

      const analysisReport =
        typeof result.content === "string"
          ? result.content
          : JSON.stringify(result.content);

      console.log("✅ Test results analysis completed");

      return {
        messages: [
          ...(state.messages || []),
          new AIMessage(`Analysis Report: ${analysisReport}`),
        ],
        currentStep: "results_analyzed",
        analysisReport,
        testResults,
      };
    };

    // 6. Generate Summary Report Node - Creates comprehensive summary
    const generateSummaryReportNode = async (state: UITestingStateType) => {
      console.log("📋 Generating comprehensive summary report...");

      const summaryPrompt = ChatPromptTemplate.fromMessages([
        [
          "system",
          `You are an expert technical writer specializing in automation testing reports.
          
          Create a comprehensive, professional summary report that includes:
          
          # UI Automation Testing Summary Report
          
          ## Executive Summary
          - Brief overview of the automation task performed
          - Key findings and overall success/failure
          - Critical issues discovered
          
          ## Automation Details
          - Target URL and application tested
          - Specific instructions that were automated
          - Tools and methods used (Playwright MCP)
          
          ## Automation Results
          - Step-by-step actions performed
          - Success rate of each instruction
          - Any errors or failures encountered
          
          ## Analysis and Findings
          - Detailed analysis of the application behavior
          - Performance observations during automation
          - Functional issues identified
          - User experience assessment
          
          ## Issues and Bugs
          - Critical bugs that prevent functionality
          - Minor issues that affect user experience
          - Unexpected behaviors observed
          - Recommendations for fixes
          
          ## Positive Highlights
          - Features that worked as expected
          - Good user experience elements
          - Smooth functionality observed
          
          ## Conclusion
          - Overall assessment of the application
          - Summary of automation success
          - Next steps recommendations
          
          Use professional formatting with clear sections and bullet points.
          Make it suitable for developers and QA teams.`,
        ],
        [
          "human",
          `Create a comprehensive summary report for the automation testing session:
          
          Target URL: {url}
          Instructions Automated: {instructions}
          Automation Results: {results}
          Analysis Report: {analysis}
          Testing Status: {status}
          
          Generate a professional, detailed summary report suitable for development teams.`,
        ],
      ]);

      const chain = summaryPrompt.pipe(model);
      const result = await chain.invoke({
        url: state.targetUrl,
        instructions: state.testingInstructions,
        results: state.testResults,
        analysis: state.analysisReport,
        status: state.status,
      });

      const summaryReport =
        typeof result.content === "string"
          ? result.content
          : JSON.stringify(result.content);

      console.log("✅ Summary report generated");

      // Save the report to file
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const reportFilename = `ui-testing-report-${timestamp}.md`;
      const reportPath = path.join(__dirname, "summary", reportFilename);

      try {
        fs.writeFileSync(reportPath, summaryReport, "utf8");
        console.log(`📁 Report saved to: ${reportPath}`);
      } catch (error) {
        console.error("❌ Error saving report:", error);
      }

      return {
        messages: [new AIMessage(`Summary Report Generated: ${summaryReport}`)],
        currentStep: "report_generated",
        summaryReport,
        status: "complete",
      };
    };

    // Define the function that determines whether to continue with tools or proceed to analysis
    const shouldContinueWithTools = ({ messages }: any) => {
      const lastMessage = messages[messages.length - 1] as AIMessage;

      // If the LLM makes a tool call, continue with tools
      if (lastMessage.tool_calls?.length) {
        return "tools";
      }
      // Otherwise, proceed to analysis
      return "analyze_results";
    };

    // Define the agent function that calls the model for tool execution
    const callModelForTools = async (state: UITestingStateType) => {
      const response = await modelWithTools.invoke(state.messages || [], {
        recursionLimit: 50,
      });

      console.log("Model response:", response.tool_calls || "No tool calls");
      return {
        messages: [...(state.messages || []), response],
        currentStep: "agent_called",
      };
    };

    // Create tool node
    const toolNode = new ToolNode(mcpTools);

    // 7. Build the StateGraph with proper agent-tools loop
    console.log("🏗️ Building UI Testing workflow...");

    const workflow = new StateGraph(UITestingState)
      .addNode("setup_mcp", setupMCPToolsNode)
      .addNode("parse_input", parseUserInputNode)
      .addNode("execute_testing", executeUITestingNode)
      .addNode("agent", callModelForTools)
      .addNode("tools", toolNode)
      .addNode("analyze_results", analyzeTestResultsNode)
      .addNode("generate_report", generateSummaryReportNode)
      .addEdge(START, "setup_mcp")
      .addEdge("setup_mcp", "parse_input")
      .addEdge("parse_input", "execute_testing")
      .addEdge("execute_testing", "agent")
      .addEdge("tools", "agent")
      .addConditionalEdges("agent", shouldContinueWithTools)
      .addEdge("analyze_results", "generate_report")
      .addEdge("generate_report", END);

    const app = workflow.compile();
    console.log("✅ UI Testing workflow compiled successfully");

    return { app, mcpClient };
  } catch (error) {
    console.error("❌ Error in UI Testing workflow:", error);
    // Keep mcpClient alive to maintain browser session
    throw error;
  }
}

// Function to run the UI testing automation
async function runUITesting(userPrompt: string) {
  console.log("🎯 Starting UI Testing Automation");
  console.log(`📝 User Prompt: ${userPrompt}`);

  try {
    const { app, mcpClient } = await uiTestingWorkflow();

    // Prepare messages from user prompt
    const messages = [new HumanMessage(userPrompt)];

    const result = await app.invoke({
      messages,
      currentStep: "start",
    });

    // CRITICAL: Never close MCP client to keep browser session alive
    console.log(
      "✅ UI Testing workflow completed - browser session maintained for continued access"
    );
    console.log(
      "🔴 IMPORTANT: MCP client kept alive to prevent browser closure"
    );
    console.log("🌐 Browser should be visible and accessible in headed mode");
    console.log(
      "🔒 Browser persistence monitoring: Session kept alive indefinitely"
    );

    console.log("\n📊 UI Testing Process Summary:");
    console.log("=====================================");
    console.log(`🌐 Target URL: ${result.targetUrl}`);
    console.log(`📋 Instructions: ${result.testingInstructions}`);
    console.log(`📝 Status: ${result.status}`);

    if (result.testResults) {
      console.log("\n🎯 Test Results:");
      console.log(result.testResults?.substring(0, 300) + "...");
    }

    if (result.analysisReport) {
      console.log("\n🔍 Analysis Report:");
      console.log(result.analysisReport?.substring(0, 300) + "...");
    }

    console.log("\n📁 Summary Report:");
    console.log(result.summaryReport?.substring(0, 500) + "...");

    console.log("\n⚠️  IMPORTANT REMINDERS:");
    console.log("1. UI testing completed with comprehensive analysis");
    console.log("2. Browser is kept OPEN for continued exploration");
    console.log("3. Summary report saved to ./uiTesting/summary directory");
    console.log("4. Review the full report for detailed insights");
    console.log("5. Close the browser manually when done exploring");
    console.log(
      "\n🌐 Browser Session: ACTIVE - Check your browser for the tested website"
    );

    // Keep the process alive to maintain browser session
    console.log("\n🔄 Keeping process alive to maintain browser session...");
    console.log(
      "💡 Press Ctrl+C to exit and close browser when done reviewing"
    );
    console.log(
      "🌐 Browser should be visible in a new window (headed mode enabled)"
    );
    console.log("🔍 Check your screen for the opened Chrome browser window");

    // Set up a keep-alive mechanism with enhanced monitoring
    let keepAliveCounter = 0;
    const keepAlive = setInterval(() => {
      keepAliveCounter++;
      console.log(
        `🔄 Browser session active (${
          keepAliveCounter * 30
        }s) - Testing environment available`
      );
    }, 30000); // Check every 30 seconds

    // Return result but don't exit the function
    return result;
  } catch (error) {
    console.error("❌ UI testing automation failed:", error);
    throw error;
  }
}

// Example usage function for testing
async function runExample() {
  const examplePrompts = [
    "go to https://dashboard.mindler.com/login\nuse credentials drcode1@gmail.com, password: 12345\ngo to all services button, open assessment, start answering questions from mcq. select random answers. after 5 answers, try to go back and verify the back functionality. ideally it should be able to go back only one question. try going back more than one question and confirm if it is happening or not?" +
      "If found any popup related to orion ai close it ASAP\n ALWAYS CHECK FOR POPUPS AND RESPONSE ACCORDINGLY" +
      "\n you are allowed to use the playwright tools.",
  ];

  const selectedPrompt = examplePrompts[0];

  console.log("🚀 Running UI Testing Example");
  console.log(`📝 Selected Prompt: ${selectedPrompt}`);

  try {
    await runUITesting(selectedPrompt);
    console.log("\n🎉 UI Testing automation completed!");
  } catch (error) {
    console.error(
      "\n💥 UI Testing automation failed:",
      error instanceof Error ? error.message : String(error)
    );
    throw error;
  }
}

// Run example if this file is executed directly
if (require.main === module) {
  runExample()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export { uiTestingWorkflow, runUITesting };
