import { ChatOpenAI } from '@langchain/openai';
import { BufferMemory } from '@langchain/classic/memory';
import { HumanMessage } from '@langchain/core/messages';

class AISummaryError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 500) {
    super(message);
    this.name = 'AISummaryError';
    this.statusCode = statusCode;
  }
}

const createModel = () => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new AISummaryError('OPENAI_API_KEY is not configured on the server', 500);
  }

  return new ChatOpenAI({
    model: 'gpt-4o-mini',
    temperature: 0.7,
    apiKey,
  });
};

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
  if (!Array.isArray(tasks) || tasks.length === 0) {
    throw new AISummaryError('tasks must be a non-empty array', 400);
  }

  if (tasks.length > 50) {
    throw new AISummaryError('tasks array is too large (max 50)', 400);
  }

  const combinedText = tasks.join('\n');
  const memory = getMemory(memoryKey);
  const model = createModel();

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

  let response;
  try {
    response = await model.invoke([
      new HumanMessage(prompt)
    ]);
  } catch (error: any) {
    const providerMessage = error?.response?.data?.error?.message || error?.message || 'AI provider request failed';
    const statusCode = typeof error?.status === 'number'
      ? error.status
      : typeof error?.response?.status === 'number'
        ? error.response.status
        : 502;
    throw new AISummaryError(providerMessage, statusCode);
  }

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

export { AISummaryError };
