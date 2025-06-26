'use server';
/**
 * @fileOverview AI-powered transaction creation from natural language.
 *
 * - createTransactionFromText - A function that parses natural language to create a transaction.
 * - CreateTransactionInput - The input type for the createTransactionFromText function.
 * - CreateTransactionOutput - The return type for the createTransactionFromText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {format} from 'date-fns';

const CreateTransactionInputSchema = z.object({
  text: z.string().describe('The natural language text describing the transaction.'),
  currentDate: z.string().describe('The current date in YYYY-MM-DD format to help with relative date parsing (e.g., "yesterday").'),
});
export type CreateTransactionInput = z.infer<typeof CreateTransactionInputSchema>;

const CreateTransactionOutputSchema = z.object({
  description: z.string().describe("A concise description of the transaction."),
  category: z.string().describe("A relevant category for the transaction (e.g., 'Client Work', 'Software', 'Office Supplies')."),
  amount: z.number().describe("The transaction amount as a positive number."),
  type: z.enum(['revenue', 'expense']).describe("The type of transaction."),
  date: z.string().describe("The date of the transaction in 'YYYY-MM-DD' format."),
});
export type CreateTransactionOutput = z.infer<typeof CreateTransactionOutputSchema>;

export async function createTransactionFromText(input: {text: string}): Promise<CreateTransactionOutput> {
  const flowInput: CreateTransactionInput = {
    ...input,
    currentDate: format(new Date(), 'yyyy-MM-dd'),
  }
  return createTransactionFlow(flowInput);
}

const prompt = ai.definePrompt({
  name: 'createTransactionPrompt',
  input: {schema: CreateTransactionInputSchema},
  output: {schema: CreateTransactionOutputSchema},
  prompt: `You are an AI assistant that helps users create financial transactions from natural language.
Parse the following text to extract the transaction details.
- The amount should always be a positive number.
- Determine if it's 'revenue' (money coming in) or 'expense' (money going out).
- Infer a suitable category.
- The current date is {{currentDate}}. Use this to resolve relative dates like "today" or "last Tuesday".

Text: {{{text}}}`,
});

const createTransactionFlow = ai.defineFlow(
  {
    name: 'createTransactionFlow',
    inputSchema: CreateTransactionInputSchema,
    outputSchema: CreateTransactionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
