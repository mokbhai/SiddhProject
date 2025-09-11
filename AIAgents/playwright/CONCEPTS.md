# LangChain, LangGraph, and MCP Integration Guide

## Overview

This guide explains how to use **LangChain**, **LangGraph**, and **Model Context Protocol (MCP)** together in Node.js applications to build powerful AI agents and workflows.

## Core Concepts

### 1. LangChain

LangChain is a framework for developing applications powered by large language models (LLMs).

#### Key Components:

**Chat Models**

```typescript
import { ChatOpenAI } from '@langchain/openai';

const model = new ChatOpenAI({
  modelName: 'gpt-4o-mini',
  temperature: 0,
  apiKey: process.env.OPENAI_API_KEY,
});
```

**Prompt Templates**

```typescript
import { ChatPromptTemplate } from '@langchain/core/prompts';

const prompt = ChatPromptTemplate.fromMessages([
  ['system', 'You are a helpful assistant specialized in {domain}.'],
  ['human', '{question}'],
]);
```

**Chains**

```typescript
const chain = prompt.pipe(model);
const response = await chain.invoke({
  domain: 'software development',
  question: 'What is TypeScript?',
});
```

**Messages**

```typescript
import { HumanMessage, AIMessage, SystemMessage } from '@langchain/core/messages';

const messages = [
  new SystemMessage('You are a helpful assistant.'),
  new HumanMessage('Hello!'),
  new AIMessage('Hi! How can I help you today?'),
];
```

### 2. Model Context Protocol (MCP)

MCP is an open standard that enables AI applications to securely connect to external data sources and tools.

#### Key Benefits:

- **Standardized Interface**: Common protocol for tool integration
- **Security**: Secure access to external resources
- **Extensibility**: Easy to add new tools and data sources
- **Interoperability**: Works across different AI frameworks

#### MCP Architecture:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   AI Agent      │────│   MCP Client    │────│   MCP Server    │
│  (LangChain)    │    │  (Adapter)      │    │   (Tools)       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

#### Using MCP with LangChain:

```typescript
import { MultiServerMCPClient } from '@langchain/mcp-adapters';

const mcpClient = new MultiServerMCPClient({
  mcpServers: {
    math: {
      transport: 'stdio',
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-math'],
    },
    filesystem: {
      transport: 'stdio',
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-filesystem', '/tmp'],
    },
  },
});

const tools = await mcpClient.getTools();
```

### 3. LangGraph

LangGraph is a library for building stateful, multi-agent applications with LLMs.

#### Key Features:

- **State Management**: Persistent state across workflow steps
- **Graph-based Workflows**: Define complex agent interactions
- **Conditional Logic**: Route between different actions based on state
- **Human-in-the-loop**: Enable human oversight and intervention

#### State Definition:

```typescript
import { Annotation } from '@langchain/langgraph';

const WorkflowState = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (x, y) => x.concat(y),
  }),
  currentStep: Annotation<string>({
    reducer: (x, y) => y ?? x,
  }),
  data: Annotation<any>({
    reducer: (x, y) => ({ ...x, ...y }),
  }),
});
```

#### Building Workflows:

```typescript
import { StateGraph, START, END } from '@langchain/langgraph';

const workflow = new StateGraph(WorkflowState)
  .addNode('analyze', analyzeNode)
  .addNode('decide', decideNode)
  .addNode('execute', executeNode)
  .addEdge(START, 'analyze')
  .addEdge('analyze', 'decide')
  .addConditionalEdges('decide', routingFunction, {
    option_a: 'execute',
    option_b: END,
  })
  .addEdge('execute', END);

const app = workflow.compile();
```

## Integration Patterns

### 1. Basic LangChain + MCP Pattern

```typescript
// 1. Set up MCP client
const mcpClient = new MultiServerMCPClient({
  mcpServers: {
    /* server configs */
  },
});

// 2. Load tools
const tools = await mcpClient.getTools();

// 3. Create agent with tools
const agent = createReactAgent({
  llm: model,
  tools,
});

// 4. Use agent
const response = await agent.invoke({
  messages: [new HumanMessage('Calculate 25 * 4')],
});
```

### 2. LangGraph + MCP Workflow Pattern

```typescript
// 1. Define state with MCP integration
const MCPWorkflowState = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (x, y) => x.concat(y),
  }),
  toolResults: Annotation<any[]>({
    reducer: (x, y) => x.concat(y),
  }),
});

// 2. Create nodes that use MCP tools
const toolNode = async state => {
  const tools = await mcpClient.getTools();
  // Use tools...
  return { toolResults: [result] };
};

// 3. Build workflow
const workflow = new StateGraph(MCPWorkflowState).addNode('tool_use', toolNode);
// ... more nodes
```

### 3. Multi-Agent MCP System

```typescript
// Different agents for different purposes
const mathAgent = createReactAgent({
  llm: model,
  tools: await mathMcpClient.getTools(),
});

const fileAgent = createReactAgent({
  llm: model,
  tools: await fileMcpClient.getTools(),
});

// Coordinate with LangGraph
const coordinatorWorkflow = new StateGraph(CoordinatorState)
  .addNode('route_to_math', state => mathAgent.invoke(state))
  .addNode('route_to_file', state => fileAgent.invoke(state));
// ... routing logic
```

## Common Use Cases

### 1. Data Analysis Pipeline

```typescript
const analysisWorkflow = new StateGraph(AnalysisState)
  .addNode('load_data', loadDataFromMCP)
  .addNode('analyze', analyzeWithLLM)
  .addNode('visualize', createVisualization)
  .addNode('report', generateReport);
```

### 2. Code Generation and Execution

```typescript
const codeWorkflow = new StateGraph(CodeState)
  .addNode('understand_requirement', requirementAnalysis)
  .addNode('generate_code', codeGeneration)
  .addNode('test_code', executeCodeViaMCP)
  .addNode('refine', refineBasedOnResults);
```

### 3. Research and Synthesis

```typescript
const researchWorkflow = new StateGraph(ResearchState)
  .addNode('search', searchViaMCPTools)
  .addNode('extract', extractRelevantInfo)
  .addNode('synthesize', synthesizeFindings)
  .addNode('fact_check', verifyViaMCP);
```

## Best Practices

### 1. Error Handling

```typescript
const robustNode = async state => {
  try {
    // Main logic
    return await processWithMCP(state);
  } catch (error) {
    console.error('Node failed:', error);
    return {
      messages: [new AIMessage('I encountered an error. Let me try a different approach.')],
      error: error.message,
    };
  }
};
```

### 2. State Management

```typescript
// Use clear, typed state definitions
const WellDefinedState = Annotation.Root({
  // Always include messages for conversation flow
  messages: Annotation<BaseMessage[]>({
    reducer: (x, y) => x.concat(y),
  }),

  // Track workflow progress
  currentStep: Annotation<string>({
    reducer: (x, y) => y ?? x,
  }),

  // Store intermediate results
  intermediateResults: Annotation<Record<string, any>>({
    reducer: (x, y) => ({ ...x, ...y }),
  }),

  // Handle errors gracefully
  errors: Annotation<string[]>({
    reducer: (x, y) => x.concat(y),
  }),
});
```

### 3. MCP Server Management

```typescript
// Proper lifecycle management
class MCPManager {
  private clients: Map<string, MultiServerMCPClient> = new Map();

  async connect(serverName: string, config: MCPServerConfig) {
    const client = new MultiServerMCPClient({ mcpServers: { [serverName]: config } });
    this.clients.set(serverName, client);
    return client;
  }

  async disconnect(serverName: string) {
    const client = this.clients.get(serverName);
    if (client) {
      await client.close();
      this.clients.delete(serverName);
    }
  }

  async disconnectAll() {
    for (const [name, client] of this.clients) {
      await client.close();
    }
    this.clients.clear();
  }
}
```

### 4. Configuration Management

```typescript
// Centralized configuration
export const config = {
  models: {
    default: 'gpt-4o-mini',
    creative: 'gpt-4o',
    analytical: 'gpt-4o-mini',
  },
  mcp: {
    servers: {
      math: {
        transport: 'stdio',
        command: 'npx',
        args: ['-y', '@modelcontextprotocol/server-math'],
      },
      // ... other servers
    },
    timeouts: {
      connection: 5000,
      operation: 30000,
    },
  },
  workflows: {
    maxRetries: 3,
    timeout: 300000, // 5 minutes
  },
};
```

## Performance Optimization

### 1. Parallel Processing

```typescript
// Process multiple MCP operations in parallel
const parallelNode = async state => {
  const [mathResult, fileResult, webResult] = await Promise.all([
    mathMcpClient.getTools().then(tools => tools[0].invoke(state.mathQuery)),
    fileMcpClient.getTools().then(tools => tools[0].invoke(state.fileQuery)),
    webMcpClient.getTools().then(tools => tools[0].invoke(state.webQuery)),
  ]);

  return {
    results: { math: mathResult, file: fileResult, web: webResult },
  };
};
```

### 2. Caching

```typescript
// Cache MCP tool results
const cache = new Map();

const cachedToolCall = async (toolName: string, input: any) => {
  const key = `${toolName}:${JSON.stringify(input)}`;

  if (cache.has(key)) {
    return cache.get(key);
  }

  const result = await actualToolCall(toolName, input);
  cache.set(key, result);
  return result;
};
```

### 3. Resource Management

```typescript
// Limit concurrent MCP connections
const semaphore = new Semaphore(5); // Max 5 concurrent operations

const managedToolCall = async (tool: any, input: any) => {
  await semaphore.acquire();
  try {
    return await tool.invoke(input);
  } finally {
    semaphore.release();
  }
};
```

## Security Considerations

### 1. Input Validation

```typescript
// Validate inputs before passing to MCP tools
const validateInput = (input: any) => {
  if (typeof input !== 'object' || input === null) {
    throw new Error('Invalid input format');
  }

  // Check for potentially dangerous operations
  const dangerous = ['rm -rf', 'del /f', 'format', 'DROP TABLE'];
  const inputStr = JSON.stringify(input);

  for (const danger of dangerous) {
    if (inputStr.includes(danger)) {
      throw new Error('Potentially dangerous operation detected');
    }
  }

  return true;
};
```

### 2. Sandboxing

```typescript
// Use restricted MCP servers
const safeMcpConfig = {
  filesystem: {
    transport: 'stdio',
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-filesystem', '/safe/sandbox/path'],
    // Restrict to specific directory
  },
};
```

### 3. Authentication

```typescript
// Secure MCP server connections
const authenticatedMcpConfig = {
  customServer: {
    url: 'https://secure-mcp-server.com',
    headers: {
      Authorization: `Bearer ${process.env.MCP_TOKEN}`,
      'X-API-Key': process.env.MCP_API_KEY,
    },
  },
};
```

## Testing Strategies

### 1. Unit Testing Nodes

```typescript
// Test individual workflow nodes
describe('Analysis Node', () => {
  it('should analyze user input correctly', async () => {
    const mockState = {
      messages: [new HumanMessage('Test input')],
    };

    const result = await analysisNode(mockState);

    expect(result.analysis).toBeDefined();
    expect(result.currentStep).toBe('analysis_complete');
  });
});
```

### 2. Integration Testing

```typescript
// Test MCP integration
describe('MCP Integration', () => {
  let mcpClient: MultiServerMCPClient;

  beforeAll(async () => {
    mcpClient = new MultiServerMCPClient({
      mcpServers: testMcpConfig,
    });
  });

  afterAll(async () => {
    await mcpClient.close();
  });

  it('should load tools successfully', async () => {
    const tools = await mcpClient.getTools();
    expect(tools.length).toBeGreaterThan(0);
  });
});
```

### 3. Workflow Testing

```typescript
// Test complete workflows
describe('Complete Workflow', () => {
  it('should process user request end-to-end', async () => {
    const app = workflow.compile();

    const result = await app.invoke({
      messages: [new HumanMessage('Test request')],
    });

    expect(result.finalResponse).toBeDefined();
    expect(result.currentStep).toBe('completed');
  });
});
```

## Deployment Considerations

### 1. Environment Configuration

```typescript
// Production-ready configuration
const productionConfig = {
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    maxRetries: 3,
    timeout: 30000,
  },
  mcp: {
    servers: JSON.parse(process.env.MCP_SERVERS_CONFIG || '{}'),
    connectionTimeout: 10000,
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: 'json',
  },
};
```

### 2. Monitoring

```typescript
// Add monitoring and metrics
const monitoredNode = async state => {
  const startTime = Date.now();

  try {
    const result = await originalNode(state);

    // Log success metrics
    logger.info('Node completed', {
      node: 'analysis',
      duration: Date.now() - startTime,
      success: true,
    });

    return result;
  } catch (error) {
    // Log error metrics
    logger.error('Node failed', {
      node: 'analysis',
      duration: Date.now() - startTime,
      error: error.message,
    });

    throw error;
  }
};
```

### 3. Scaling

```typescript
// Horizontal scaling with worker queues
import { Worker, Queue } from 'bullmq';

const workflowQueue = new Queue('workflow processing');

// Worker for processing workflows
const worker = new Worker('workflow processing', async job => {
  const { workflowType, input } = job.data;

  const app = getWorkflowApp(workflowType);
  return await app.invoke(input);
});
```

This comprehensive guide should give you a solid foundation for building sophisticated AI applications using LangChain, LangGraph, and MCP together!
