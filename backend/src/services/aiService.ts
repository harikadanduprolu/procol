import { ChatOpenAI } from '@langchain/openai';
import { BufferMemory } from '@langchain/classic/memory';
import { HumanMessage } from '@langchain/core/messages';

const model = new ChatOpenAI({
  model: 'gpt-4o-mini',
  temperature: 0.7,
  apiKey: process.env.OPENAI_API_KEY,
});

const memoryStore = new Map<string, BufferMemory>();

const getMemory = (memoryKey: string) => {
  const existingMemory = memoryStore.get(memoryKey);
  if (existingMemory) {
    return existingMemory;
  }

  const newMemory = new BufferMemory({
    memoryKey: 'chat_history',
    inputKey: 'input',
    outputKey: 'output',
    returnMessages: true,
  });

  memoryStore.set(memoryKey, newMemory);
  return newMemory;
};

const normalizeResponse = (content: unknown) => {
  if (typeof content === 'string') {
    return content;
  }

  if (Array.isArray(content)) {
    return content
      .map((item) => (typeof item === 'string' ? item : JSON.stringify(item)))
      .join('\n');
  }

  return String(content);
};

export const summarizeTasks = async (tasks: string[], memoryKey = 'default') => {
  const combinedText = tasks.join('\n');
  const memory = getMemory(memoryKey);

  const prompt = `
You are an AI assistant for a collaboration platform.

Analyze:
${combinedText}

Return:
1. Summary
2. Insights
3. Pending work
4. Risks
`;

  const response = await model.invoke([
    new HumanMessage(prompt)
  ]);

  const output = normalizeResponse(response.content);

  await memory.saveContext(
    { input: combinedText },
    { output }
  );

  return output;
};

export const clearTaskMemory = (memoryKey?: string) => {
  if (memoryKey) {
    memoryStore.delete(memoryKey);
    return;
  }

  memoryStore.clear();
};
