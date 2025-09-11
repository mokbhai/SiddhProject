import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { config, getOpenAIApiKey } from '../utils/config';

/**
 * Basic LangChain Example
 *
 * This example demonstrates:
 * 1. Setting up a ChatOpenAI model
 * 2. Creating and using prompt templates
 * 3. Chaining prompts with models
 * 4. Invoking the model with different message types
 */

async function basicLangChainExample() {
  console.log('🚀 Starting Basic LangChain Example\n');

  try {
    // 1. Initialize the ChatOpenAI model
    const model = new ChatOpenAI({
      modelName: config.openai.model,
      temperature: config.openai.temperature,
      apiKey: getOpenAIApiKey(),
    });

    console.log('✅ ChatOpenAI model initialized');

    // 2. Simple direct invocation with messages
    console.log('\n📝 Example 1: Direct message invocation');
    const directResponse = await model.invoke([
      new SystemMessage('You are a helpful assistant that explains complex topics simply.'),
      new HumanMessage('What is LangChain and how does it work?'),
    ]);

    console.log('Response:', directResponse.content);

    // 3. Using ChatPromptTemplate for structured prompts
    console.log('\n📝 Example 2: Using ChatPromptTemplate');
    const promptTemplate = ChatPromptTemplate.fromMessages([
      ['system', 'You are an expert {role} who explains things clearly and concisely.'],
      ['human', 'Explain {topic} in simple terms with practical examples.'],
    ]);

    // Chain the prompt template with the model
    const chain = promptTemplate.pipe(model);

    const templateResponse = await chain.invoke({
      role: 'software architect',
      topic: 'Model Context Protocol (MCP)',
    });

    console.log('Response:', templateResponse.content);

    // 4. Multiple conversation turns
    console.log('\n📝 Example 3: Multi-turn conversation');
    const tutorResponse1 = await model.invoke([
      new SystemMessage('You are a coding tutor. Keep responses concise but helpful.'),
      new HumanMessage('I want to learn about TypeScript'),
    ]);

    console.log('Tutor Response 1:', tutorResponse1.content);

    const tutorResponse2 = await model.invoke([
      new SystemMessage('You are a coding tutor. Keep responses concise but helpful.'),
      new HumanMessage('I want to learn about TypeScript'),
      tutorResponse1,
      new HumanMessage('How is it different from JavaScript?'),
    ]);

    console.log('Tutor Response 2:', tutorResponse2.content);

    // 5. Streaming responses
    console.log('\n📝 Example 4: Streaming response');
    console.log('Streaming response for: "Explain the benefits of using LangChain"');

    const streamingPrompt = ChatPromptTemplate.fromMessages([
      ['system', 'You are a technical writer. Provide detailed explanations.'],
      ['human', '{question}'],
    ]);

    const streamingChain = streamingPrompt.pipe(model);
    const stream = await streamingChain.stream({
      question: 'Explain the benefits of using LangChain in AI applications',
    });

    for await (const chunk of stream) {
      const content = typeof chunk.content === 'string' ? chunk.content : JSON.stringify(chunk.content);
      process.stdout.write(content);
    }

    console.log('\n\n✅ Basic LangChain examples completed successfully!');
  } catch (error) {
    console.error('❌ Error in basic LangChain example:', error);
    throw error;
  }
}

// Run the example if this file is executed directly
if (require.main === module) {
  basicLangChainExample()
    .then(() => {
      console.log('\n🎉 All examples completed!');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n💥 Example failed:', error.message);
      process.exit(1);
    });
}

export { basicLangChainExample };
