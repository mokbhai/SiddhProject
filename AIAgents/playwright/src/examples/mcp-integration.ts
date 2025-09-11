import { ChatOpenAI } from '@langchain/openai';
import { MultiServerMCPClient } from '@langchain/mcp-adapters';
import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { config, getOpenAIApiKey } from '../utils/config';
import { HumanMessage } from '@langchain/core/messages';

/**
 * MCP Integration Example
 *
 * This example demonstrates:
 * 1. Connecting to MCP servers
 * 2. Loading tools from MCP servers
 * 3. Creating an agent with MCP tools
 * 4. Using MCP tools in conversations
 */

async function mcpIntegrationExample() {
  console.log('🚀 Starting MCP Integration Example\n');

  try {
    // 1. Initialize the ChatOpenAI model
    const model = new ChatOpenAI({
      modelName: config.openai.model,
      temperature: config.openai.temperature,
      apiKey: getOpenAIApiKey(),
    });

    console.log('✅ ChatOpenAI model initialized');

    // 2. Set up MCP client with multiple servers
    console.log('🔗 Setting up MCP client...');

    const mcpClient = new MultiServerMCPClient({
      // Global configuration
      throwOnLoadError: true,
      prefixToolNameWithServerName: false,
      additionalToolNamePrefix: '',
      useStandardContentBlocks: true,

      // MCP server configurations
      mcpServers: {
        playwright: {
          command: 'npx',
          args: ['@playwright/mcp@latest'],
          type: 'stdio',
        //   env: {
        //     PWDEBUG: '1', // Enable Playwright inspector
        //     DEBUG: 'pw:api', // Enable Playwright API logs
        //   },
        },
      },
    });

    // 3. Load tools from MCP servers
    console.log('🔧 Loading tools from MCP servers...');
    const tools = await mcpClient.getTools();

    console.log(`✅ Loaded ${tools.length} tools from MCP servers:`);
    tools.forEach((tool, index) => {
      console.log(`  ${index + 1}. ${tool.name}: ${tool.description}`);
    });

    // 4. Create a React agent with MCP tools
    console.log('\n🤖 Creating React agent with MCP tools...');
    const agent = createReactAgent({
      llm: model,
      tools,
    });

    console.log('✅ React agent created successfully');

    // 5. Example 1: Math operations
    console.log('\n📝 Example 1: Math operations');
    try {
      const streamedEvents = agent.streamEvents(
        {
          messages: [
            new HumanMessage(`OBJECTIVE: Verify the change in number of assets and locations after switching off the centralized pool for an asset owner on assets.oohdit.com.

STEPS:
1. Navigate to https://assets.oohdit.com and verify the page loads successfully.
2. Locate and click the primary action button to open the login form.
3. Enter the brand credentials: username "9818347223" and password "1234", then submit to log in.
4. Navigate to the assets section, wait for assets to load and note the number of assets and locations displayed.
5. Click on Profile icon to open the logout button and then click the logout button to log out from the brand account.
6. On the login page, click the primary action button again to open the login form.
7. Enter the asset owner credentials: username "9818347222" and password "1234", then submit to log in.
8. Navigate to the my profile section by clicking on profile icon and clicking my profile and locate the centralized pool toggle; switch it off.
9. Navigate to the assets section and note the number of assets and locations displayed for the asset owner.
10. Click on Profile icon to open the logout button and then click the logout button to log out from the asset owner account.
11. Log back in with the brand credentials: username "9818347223" and password "1234" using the primary action button and login form.
12. Navigate to the assets section and note the updated number of assets and locations.
13. Verify that the number of assets and locations for the brand has decreased by the amount previously noted for the asset owner after switching off the centralized pool.`),
          ],
        },
        { recursionLimit: 300, version: 'v2' },
      );

      for await (const event of streamedEvents) {
        const eventType = event.event;

        // Log the event type and payload for different steps
        if (eventType === 'on_chain_start') {
          console.log(`\n> Starting chain: ${event.name}`);
          console.log('---');
        } else if (eventType === 'on_chain_end') {
          console.log(`\n> Ending chain: ${event.name}`);
          console.log('---');
        } else if (eventType === 'on_tool_start') {
          console.log(`\n> Calling tool: ${event.name} with input: ${JSON.stringify(event.data.input)}`);
          console.log('---');
        } else if (eventType === 'on_tool_end') {
          console.log(`\n> Tool finished, output: ${JSON.stringify(event.data.output)}`);
          console.log('---');
        } else if (eventType === 'on_llm_start' || eventType === 'on_chat_model_start') {
          console.log(`\n> Calling LLM: ${event.name}`);
          console.log('---');
        } else if (eventType === 'on_llm_end' || eventType === 'on_chat_model_start') {
          console.log(`\n> LLM finished, output: ${JSON.stringify(event.data.output.content)}`);
          console.log('---');
        }
      }
    } catch (error) {
      console.log('Math operations not available (math server may not be running)');
      console.log('Error:', error instanceof Error ? error.message : String(error));
    }

    // 8. Clean up
    console.log('\n🧹 Cleaning up MCP connections...');
    await mcpClient.close();
    console.log('✅ MCP connections closed');

    console.log('\n✅ MCP integration examples completed successfully!');
  } catch (error) {
    console.error('❌ Error in MCP integration example:', error);
    throw error;
  }
}

// Run examples if this file is executed directly
if (require.main === module) {
  mcpIntegrationExample()
    .then(() => {
      console.log('\n🎉 All MCP examples completed!');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n💥 MCP examples failed:', error.message);
      process.exit(1);
    });
}

export { mcpIntegrationExample };
