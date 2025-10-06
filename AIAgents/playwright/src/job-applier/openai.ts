// agent.mts

// Increase max listeners to prevent warning
import { setMaxListeners } from "events";

// Set higher limits to prevent MaxListenersExceededWarning
setMaxListeners(20); // Increase limit for EventEmitter instances
process.setMaxListeners(0); // Remove limit for process events

import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { StateGraph, MessagesAnnotation } from "@langchain/langgraph";
import { MultiServerMCPClient } from "@langchain/mcp-adapters";
import { config, getLLMApiKey } from "../utils/config";

const MAX_RECURSION_LIMIT = 300;

async function mcpAutomate() {
  let mcpClient: MultiServerMCPClient | null = null;
  let keepAliveInterval: NodeJS.Timeout | null = null;

  try {
    // Define the tools for the agent to use
    mcpClient = new MultiServerMCPClient({
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
      // const streamEvents = model.streamEvents(state.messages, {
      //   recursionLimit: 300,
      //   version: "v2",
      // });

      // while (true) {
      //   const event = await streamEvents.next();
      //   if (event.done) break;

      //   // Process the event (e.g., log it, update state, etc.)
      //   console.log("Received event:", event);
      // }

      // // We return a list, because this will get added to the existing list
      // return { messages: [streamEvents] };

      const response = await model.invoke(state.messages, {
        recursionLimit: MAX_RECURSION_LIMIT,
      });
      console.log("Model response:", response.tool_calls || response.text);
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
    const finalState = await app.invoke(
      {
        messages: [
          new HumanMessage(
            "go to https://dashboard.mindler.com/login\nuse credentials drcode1@gmail.com, password: 12345\ngo to all services button, open assessment, start answering questions from mcq. select random answers. after 5 answers, try to go back and verify the back functionality. ideally it should be able to go back only one question. try going back more than one question and confirm if it is happening or not? If any popups appear, handle them appropriately.\n" +
              "If found any popup related to orion ai close it ASAP\n ALWAYS CHECK FOR POPUPS AND RESPONSE ACCORDINGLY" +
              "\n you are allowed to use the playwright tools."
          ),
        ],
      },
      {
        recursionLimit: MAX_RECURSION_LIMIT,
      }
    );
    console.log(finalState.messages[finalState.messages.length - 1].content);

    // Return the final state and keep client alive for browser persistence
    return { finalState, mcpClient };
  } catch (error) {
    // Cleanup on error
    if (mcpClient) {
      try {
        await mcpClient.close();
      } catch (closeError) {
        console.warn("Warning: Error closing MCP client:", closeError);
      }
    }
    if (keepAliveInterval) {
      clearInterval(keepAliveInterval);
    }
    throw error;
  }
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
    .then(({ finalState, mcpClient }) => {
      console.log("\n🎉 Job application automation completed!");

      // Keep process alive to maintain browser session
      let keepAliveCounter = 0;
      const keepAlive = setInterval(() => {
        keepAliveCounter++;
        console.log(
          `🔄 Browser session active (${
            keepAliveCounter * 30
          }s) - check browser window`
        );
      }, 30000);

      // Set up graceful shutdown
      const cleanup = async () => {
        console.log("\n🛑 Shutting down...");
        clearInterval(keepAlive);
        if (mcpClient) {
          try {
            await mcpClient.close();
            console.log("✅ MCP client closed");
          } catch (error) {
            console.warn("Warning: Error closing MCP client:", error);
          }
        }
        process.exit(0);
      };

      process.on("SIGINT", cleanup);
      process.on("SIGTERM", cleanup);
    })
    .catch((error) => {
      console.error(
        "\n💥 Job Application automation failed:",
        error instanceof Error ? error.message : String(error)
      );
      process.exit(1);
    });
}
