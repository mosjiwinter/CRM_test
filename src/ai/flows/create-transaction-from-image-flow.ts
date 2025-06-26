'use server';
/**
 * @fileOverview AI-powered transaction creation from an image of a receipt or invoice.
 *
 * - createTransactionFromImage - A function that parses an image to create a transaction.
 * - CreateTransactionFromImageInput - The input type for the createTransactionFromImage function.
 * - CreateTransactionOutput - The return type (reused from text flow).
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {format} from 'date-fns';
import { CreateTransactionOutputSchema, type CreateTransactionOutput } from './transaction-schema';

const CreateTransactionFromImageInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "A photo of a receipt or invoice, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  currentDate: z.string().describe('The current date in YYYY-MM-DD format to help with relative date parsing.'),
});
export type CreateTransactionFromImageInput = z.infer<typeof CreateTransactionFromImageInputSchema>;

export async function createTransactionFromImage(input: {imageDataUri: string}): Promise<CreateTransactionOutput> {
  const flowInput: CreateTransactionFromImageInput = {
    ...input,
    currentDate: format(new Date(), 'yyyy-MM-dd'),
  }
  return createTransactionFromImageFlow(flowInput);
}

const prompt = ai.definePrompt({
  name: 'createTransactionFromImagePrompt',
  input: {schema: CreateTransactionFromImageInputSchema},
  output: {schema: CreateTransactionOutputSchema},
  prompt: `You are an AI assistant that helps users create financial transactions by analyzing images of receipts or invoices.
Analyze the following image to extract the transaction details.
- The amount should always be a positive number.
- Determine if it's 'revenue' (e.g., an invoice you sent) or 'expense' (e.g., a receipt for a purchase). If it's ambiguous, assume it's an expense.
- Extract the business name or a concise summary for the description.
- Infer a suitable category (e.g., 'Client Work', 'Software', 'Office Supplies', 'Meals', 'Travel').
- The current date is {{currentDate}}. Use this to resolve relative dates. If no date is found on the receipt, use the current date.

Image: {{media url=imageDataUri}}`,
});

const createTransactionFromImageFlow = ai.defineFlow(
  {
    name: 'createTransactionFromImageFlow',
    inputSchema: CreateTransactionFromImageInputSchema,
    outputSchema: CreateTransactionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
