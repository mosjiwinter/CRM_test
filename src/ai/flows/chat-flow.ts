'use server';
/**
 * @fileOverview A conversational AI flow for answering financial questions.
 *
 * - chat - A function that handles the conversational chat process.
 * - ChatInput - The input type for the chat function.
 * - ChatOutput - The return type for the chat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type {Message} from 'genkit/content';

const ChatInputSchema = z.object({
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
  })).describe('The conversation history.'),
  transactions: z.string().describe('Historical revenue and expense data as a JSON string.'),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

const ChatOutputSchema = z.object({
  answer: z.string().describe('The AI-generated answer.'),
});
export type ChatOutput = z.infer<typeof ChatOutputSchema>;

export async function chat(input: ChatInput): Promise<ChatOutput> {
  return chatFlow(input);
}

const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async ({history, transactions}) => {
    
    const systemPrompt = `You are an expert financial analyst AI assistant for a small business owner. Your goal is to answer the user's questions based on the provided financial data and conversation history. Be helpful, insightful, and clear in your responses. Analyze the provided JSON data of transactions to answer the user's question. The transaction data contains revenue and expenses. Do not make up information if the answer is not in the provided data. \n\nTransaction Data:\n${transactions}`;
    
    // The last message in history is the current user prompt.
    const userPrompt = history[history.length - 1].content;
    
    // Convert simple history to Genkit Message array, excluding the last user prompt.
    const genkitHistory: Message[] = history.slice(0, -1).map(h => ({
      role: h.role,
      content: [{text: h.content}],
    }));

    const response = await ai.generate({
      system: systemPrompt,
      prompt: userPrompt,
      history: genkitHistory,
    });

    return { answer: response.text };
  }
);
