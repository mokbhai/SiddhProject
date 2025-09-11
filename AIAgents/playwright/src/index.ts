import { validateConfig } from './utils/config';
import { basicLangChainExample } from './examples/basic-langchain';
import { mcpIntegrationExample } from './examples/mcp-integration';
import { langGraphWorkflowExample } from './examples/langgraph-workflow';

/**
 * Main entry point for the LangChain + LangGraph + MCP demonstration
 *
 * This file orchestrates all the examples and provides a comprehensive
 * demonstration of how to use these technologies together.
 */

async function main() {
  console.log('🌟 Welcome to LangChain + LangGraph + MCP Integration Demo');
  console.log('='.repeat(60));

  try {
    // Validate configuration
    console.log('🔧 Validating configuration...');
    validateConfig();
    console.log('✅ Configuration validated successfully\n');

    // Show what we'll be demonstrating
    console.log('📋 This demo will show you:');
    console.log('  1. Basic LangChain usage and patterns');
    console.log('  2. MCP (Model Context Protocol) integration');
    console.log('  3. LangGraph workflows and state management');
    console.log('  4. Real-world examples combining all three\n');

    console.log('🚀 Starting demonstrations...\n');

    // Run Basic LangChain Example
    // console.log('='.repeat(60));
    // console.log('SECTION 1: BASIC LANGCHAIN EXAMPLES');
    // console.log('='.repeat(60));
    // await basicLangChainExample();

    console.log('\n' + '='.repeat(60));
    console.log('SECTION 2: MCP INTEGRATION EXAMPLES');
    console.log('='.repeat(60));
    await mcpIntegrationExample();

    console.log('\n' + '='.repeat(60));
    console.log('SECTION 3: LANGGRAPH WORKFLOW EXAMPLES');
    console.log('='.repeat(60));
    await langGraphWorkflowExample();

    console.log('\n' + '='.repeat(60));
    console.log('🎉 ALL DEMONSTRATIONS COMPLETED SUCCESSFULLY!');
    console.log('='.repeat(60));

    console.log('\n📚 Summary of what you learned:');
    console.log('✅ How to set up and use LangChain with different models');
    console.log('✅ How to integrate MCP servers for external tool access');
    console.log('✅ How to build complex workflows with LangGraph');
    console.log('✅ How to combine all three for powerful AI applications');

    console.log('\n🔗 Next steps:');
    console.log('  • Explore the individual example files in src/examples/');
    console.log('  • Try modifying the workflows for your use cases');
    console.log('  • Add new MCP servers for your specific tools');
    console.log('  • Build more complex multi-agent systems');

    console.log('\n💡 Tips for production:');
    console.log('  • Add proper error handling and retries');
    console.log('  • Implement logging and monitoring');
    console.log('  • Use environment-specific configurations');
    console.log('  • Add authentication and security measures');
    console.log('  • Consider rate limiting and cost optimization');
  } catch (error) {
    console.error('\n❌ Demo failed with error:');
    console.error(error instanceof Error ? error.message : String(error));

    if (error instanceof Error && error.message.includes('OPENAI_API_KEY')) {
      console.log('\n💡 To fix this:');
      console.log('  1. Get an OpenAI API key from https://platform.openai.com/');
      console.log('  2. Add it to your .env file: OPENAI_API_KEY=your_key_here');
      console.log('  3. Run the demo again');
    }

    process.exit(1);
  }
}

// Additional utility function for running specific examples
export async function runExample(exampleName: string) {
  try {
    validateConfig();

    switch (exampleName.toLowerCase()) {
      case 'basic':
      case 'langchain':
        await basicLangChainExample();
        break;

      case 'mcp':
      case 'mcp-integration':
        await mcpIntegrationExample();
        break;

      case 'langgraph':
      case 'workflow':
        await langGraphWorkflowExample();
        break;

      default:
        console.log('❌ Unknown example:', exampleName);
        console.log('Available examples: basic, mcp, langgraph');
        return;
    }

    console.log('✅ Example completed successfully!');
  } catch (error) {
    console.error('❌ Example failed:', error instanceof Error ? error.message : String(error));
    throw error;
  }
}

// Run main function if this file is executed directly
if (require.main === module) {
  main()
    .then(() => {
      console.log('\n👋 Thank you for exploring LangChain + LangGraph + MCP!');
      process.exit(0);
    })
    .catch(() => {
      process.exit(1);
    });
}

export { main };
