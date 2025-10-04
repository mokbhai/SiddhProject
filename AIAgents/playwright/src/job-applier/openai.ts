// agent.mts

// IMPORTANT - Add your API keys here. Be careful not to publish them.
process.env.OPENAI_API_KEY = "sk-...";
process.env.TAVILY_API_KEY = "tvly-...";

import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { StateGraph, MessagesAnnotation } from "@langchain/langgraph";
import { MultiServerMCPClient } from "@langchain/mcp-adapters";
import { config, getLLMApiKey } from "../utils/config";
import { detailedResume } from "./detailedResume";

async function mcpAutomate() {
  // Define the tools for the agent to use
  const mcpClient = new MultiServerMCPClient({
    mcpServers: {
      playwright: config.mcp.playwright,
    },
  });

  console.log("🎯 Playwright MCP configuration:", config.mcp.playwright);

  // Get MCP tools
  const mcpTools = await mcpClient.getTools();
  const toolNode = new ToolNode(mcpTools);

  // Create a model and give it access to the tools
  const model = new ChatOpenAI({
    model: config.llm.model,
    temperature: 0,
    apiKey: getLLMApiKey(),
  }).bindTools(mcpTools);

  // Define the function that determines whether to continue or not
  function shouldContinue({ messages }: typeof MessagesAnnotation.State) {
    const lastMessage = messages[messages.length - 1] as AIMessage;

    // If the LLM makes a tool call, then we route to the "tools" node
    if (lastMessage.tool_calls?.length) {
      return "tools";
    }
    // Otherwise, we stop (reply to the user) using the special "__end__" node
    return "__end__";
  }

  // Define the function that calls the model
  async function callModel(state: typeof MessagesAnnotation.State) {
    const response = await model.invoke(state.messages);

    // We return a list, because this will get added to the existing list
    return { messages: [response] };
  }

  // Define a new graph
  const workflow = new StateGraph(MessagesAnnotation)
    .addNode("agent", callModel)
    .addEdge("__start__", "agent") // __start__ is a special name for the entrypoint
    .addNode("tools", toolNode)
    .addEdge("tools", "agent")
    .addConditionalEdges("agent", shouldContinue);

  // Finally, we compile it into a LangChain Runnable.
  const app = workflow.compile();

  // Use the agent
  const finalState = await app.invoke({
    messages: [
      new HumanMessage(
        "open the url https://docs.google.com/forms/d/e/1FAIpQLSfraX6t7Tml7-aeSkk2toMPHwF8_MXxg_NUQasi31AA2bw8Fw/viewform and fill the form with the details. \n" +
          JSON.stringify(detailedResume) +
          "\n you are allowed to use the playwright tools."
      ),
    ],
  });
  console.log(finalState.messages[finalState.messages.length - 1].content);
}

// Run examples if this file is executed directly
if (require.main === module) {
  // Example usage
  const exampleUrl =
    "https://docs.google.com/forms/d/e/1FAIpQLSfraX6t7Tml7-aeSkk2toMPHwF8_MXxg_NUQasi31AA2bw8Fw/viewform";

  // Example with job description
  const exampleJD = `
    Company - Humans Of Football
Role - Product Management Intern
Batch - 2024/2025/2026
Stipend - 20,000 - 30,000/month
Location - Gurgaon
About the Role:
• Help drive a brand-new product - Team vs Team games across
India.
  `;

  // Run with job description (recommended)
  mcpAutomate()
    .then(() => {
      console.log("\n🎉 Job application automation completed!");
      // Keep process alive
      setInterval(() => {
        console.log("🔄 Browser session active - check browser window");
      }, 30000);
    })
    .catch((error) => {
      console.error(
        "\n💥 Job Application automation failed:",
        error instanceof Error ? error.message : String(error)
      );
      process.exit(1);
    });
}
