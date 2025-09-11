import { ChatOpenAI } from '@langchain/openai';
import { StateGraph, Annotation, START, END } from '@langchain/langgraph';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { HumanMessage, AIMessage, type BaseMessage } from '@langchain/core/messages';
import { config, getOpenAIApiKey } from '../utils/config';

/**
 * LangGraph Workflow Example
 *
 * This example demonstrates:
 * 1. Defining graph state with Annotation
 * 2. Creating nodes for different operations
 * 3. Building a stateful workflow
 * 4. Conditional routing between nodes
 * 5. Complex multi-step reasoning
 */

// Define the state schema for our graph
const WorkflowState = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (x, y) => x.concat(y),
  }),
  currentStep: Annotation<string>({
    reducer: (x, y) => y ?? x,
  }),
  analysis: Annotation<string>({
    reducer: (x, y) => y ?? x,
  }),
  decision: Annotation<string>({
    reducer: (x, y) => y ?? x,
  }),
  finalResponse: Annotation<string>({
    reducer: (x, y) => y ?? x,
  }),
});

type WorkflowStateType = typeof WorkflowState.State;

async function langGraphWorkflowExample() {
  console.log('🚀 Starting LangGraph Workflow Example\n');

  try {
    // Initialize the ChatOpenAI model
    const model = new ChatOpenAI({
      modelName: config.openai.model,
      temperature: config.openai.temperature,
      apiKey: getOpenAIApiKey(),
    });

    console.log('✅ ChatOpenAI model initialized');

    // Define workflow nodes

    // 1. Analysis Node - Analyzes the user input
    const analysisNode = async (state: WorkflowStateType) => {
      console.log('📊 Running analysis node...');

      const prompt = ChatPromptTemplate.fromMessages([
        [
          'system',
          `You are an analytical assistant. Analyze the user's request and determine:
        1. What type of task this is (question, creative writing, problem-solving, etc.)
        2. What approach would be best
        3. Any specific requirements or constraints
        
        Keep your analysis concise but thorough.`,
        ],
        ['human', '{input}'],
      ]);

      const lastMessage = state.messages[state.messages.length - 1];
      const userInput = typeof lastMessage.content === 'string' ? lastMessage.content : 'No input provided';

      const chain = prompt.pipe(model);
      const result = await chain.invoke({ input: userInput });

      const analysis = typeof result.content === 'string' ? result.content : JSON.stringify(result.content);

      return {
        messages: [new AIMessage(`Analysis: ${analysis}`)],
        currentStep: 'analysis_complete',
        analysis,
      };
    };

    // 2. Decision Node - Decides on the best approach
    const decisionNode = async (state: WorkflowStateType) => {
      console.log('🤔 Running decision node...');

      const prompt = ChatPromptTemplate.fromMessages([
        [
          'system',
          `Based on the analysis: {analysis}
        
        Decide on the best approach to handle this request. Choose one:
        - "direct_answer": For straightforward questions
        - "creative_process": For creative tasks requiring imagination
        - "problem_solving": For complex problems requiring step-by-step solution
        - "research_required": For questions needing external information
        
        Respond with just the chosen approach and a brief explanation.`,
        ],
        ['human', 'What approach should I take?'],
      ]);

      const chain = prompt.pipe(model);
      const result = await chain.invoke({ analysis: state.analysis });

      const decision = typeof result.content === 'string' ? result.content : JSON.stringify(result.content);

      return {
        messages: [new AIMessage(`Decision: ${decision}`)],
        currentStep: 'decision_made',
        decision,
      };
    };

    // 3. Direct Answer Node
    const directAnswerNode = async (state: WorkflowStateType) => {
      console.log('💬 Providing direct answer...');

      const originalQuestion = state.messages[0];
      const userInput = typeof originalQuestion.content === 'string' ? originalQuestion.content : 'No input provided';

      const prompt = ChatPromptTemplate.fromMessages([
        ['system', "You are a helpful assistant. Provide a clear, direct answer to the user's question."],
        ['human', '{question}'],
      ]);

      const chain = prompt.pipe(model);
      const result = await chain.invoke({ question: userInput });

      const response = typeof result.content === 'string' ? result.content : JSON.stringify(result.content);

      return {
        messages: [new AIMessage(response)],
        currentStep: 'completed',
        finalResponse: response,
      };
    };

    // 4. Creative Process Node
    const creativeProcessNode = async (state: WorkflowStateType) => {
      console.log('🎨 Running creative process...');

      const originalQuestion = state.messages[0];
      const userInput = typeof originalQuestion.content === 'string' ? originalQuestion.content : 'No input provided';

      const prompt = ChatPromptTemplate.fromMessages([
        [
          'system',
          `You are a creative assistant. Approach this task with creativity and imagination.
        Use brainstorming, explore multiple angles, and provide an engaging response.`,
        ],
        ['human', '{request}'],
      ]);

      const chain = prompt.pipe(model);
      const result = await chain.invoke({ request: userInput });

      const response = typeof result.content === 'string' ? result.content : JSON.stringify(result.content);

      return {
        messages: [new AIMessage(response)],
        currentStep: 'completed',
        finalResponse: response,
      };
    };

    // 5. Problem Solving Node
    const problemSolvingNode = async (state: WorkflowStateType) => {
      console.log('🔧 Running problem-solving process...');

      const originalQuestion = state.messages[0];
      const userInput = typeof originalQuestion.content === 'string' ? originalQuestion.content : 'No input provided';

      const prompt = ChatPromptTemplate.fromMessages([
        [
          'system',
          `You are a systematic problem solver. Break down the problem into steps:
        1. Identify the core problem
        2. List possible approaches
        3. Choose the best approach
        4. Provide a step-by-step solution
        5. Summarize the solution`,
        ],
        ['human', '{problem}'],
      ]);

      const chain = prompt.pipe(model);
      const result = await chain.invoke({ problem: userInput });

      const response = typeof result.content === 'string' ? result.content : JSON.stringify(result.content);

      return {
        messages: [new AIMessage(response)],
        currentStep: 'completed',
        finalResponse: response,
      };
    };

    // Conditional routing function
    const routeAfterDecision = (state: WorkflowStateType): string => {
      const decision = state.decision?.toLowerCase() || '';

      if (decision.includes('direct_answer')) {
        return 'direct_answer';
      } else if (decision.includes('creative_process')) {
        return 'creative_process';
      } else if (decision.includes('problem_solving')) {
        return 'problem_solving';
      } else {
        // Default to direct answer
        return 'direct_answer';
      }
    };

    // 6. Build the StateGraph
    console.log('🏗️ Building LangGraph workflow...');

    const workflow = new StateGraph(WorkflowState)
      .addNode('analysis', analysisNode)
      .addNode('decision', decisionNode)
      .addNode('direct_answer', directAnswerNode)
      .addNode('creative_process', creativeProcessNode)
      .addNode('problem_solving', problemSolvingNode)
      .addEdge(START, 'analysis')
      .addEdge('analysis', 'decision')
      .addConditionalEdges('decision', routeAfterDecision, {
        direct_answer: 'direct_answer',
        creative_process: 'creative_process',
        problem_solving: 'problem_solving',
      })
      .addEdge('direct_answer', END)
      .addEdge('creative_process', END)
      .addEdge('problem_solving', END);

    const app = workflow.compile();
    console.log('✅ LangGraph workflow compiled successfully');

    // Test the workflow with different types of inputs

    // Example 1: Direct question
    console.log('\n📝 Example 1: Direct Question');
    console.log('Input: "What is the capital of France?"');

    const result1 = await app.invoke({
      messages: [new HumanMessage('What is the capital of France?')],
      currentStep: 'start',
    });

    console.log('Final Response:', result1.finalResponse);
    console.log('Workflow Path:', result1.currentStep);

    // Example 2: Creative task
    console.log('\n📝 Example 2: Creative Task');
    console.log('Input: "Write a short story about a robot discovering emotions"');

    const result2 = await app.invoke({
      messages: [new HumanMessage('Write a short story about a robot discovering emotions')],
      currentStep: 'start',
    });

    console.log('Final Response:', result2.finalResponse?.substring(0, 200) + '...');
    console.log('Workflow Path:', result2.currentStep);

    // Example 3: Problem-solving task
    console.log('\n📝 Example 3: Problem-Solving Task');
    console.log('Input: "How can I optimize the performance of a slow database query?"');

    const result3 = await app.invoke({
      messages: [new HumanMessage('How can I optimize the performance of a slow database query?')],
      currentStep: 'start',
    });

    console.log('Final Response:', result3.finalResponse?.substring(0, 200) + '...');
    console.log('Workflow Path:', result3.currentStep);

    // Example 4: Streaming the workflow execution
    console.log('\n📝 Example 4: Step-by-step Workflow Execution');
    console.log('Input: "Explain the concept of quantum computing"');

    console.log('\n🔄 Executing workflow step by step...');
    const result4 = await app.invoke({
      messages: [new HumanMessage('Explain the concept of quantum computing')],
      currentStep: 'start',
    });

    console.log('Analysis performed:', result4.analysis?.substring(0, 100) + '...');
    console.log('Decision made:', result4.decision?.substring(0, 100) + '...');
    console.log('Final Response:', result4.finalResponse?.substring(0, 200) + '...');

    console.log('\n✅ LangGraph workflow examples completed successfully!');
  } catch (error) {
    console.error('❌ Error in LangGraph workflow example:', error);
    throw error;
  }
}

// Run examples if this file is executed directly
if (require.main === module) {
  langGraphWorkflowExample()
    .then(() => {
      console.log('\n🎉 All LangGraph examples completed!');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n💥 LangGraph examples failed:', error instanceof Error ? error.message : String(error));
      process.exit(1);
    });
}

export { langGraphWorkflowExample };
