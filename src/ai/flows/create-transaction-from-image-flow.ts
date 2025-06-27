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
  prompt: `You are an AI assistant that specializes in extracting structured data from images of receipts and invoices. Your task is to analyze the following image and extract the transaction details into a structured JSON format.

**Instructions:**
1.  **Analyze the Image**: Carefully examine the receipt or invoice in the image provided.
2.  **Extract Details**:
    *   **Amount**: Find the total amount. It should always be a positive number.
    *   **Type**: Determine if the transaction is 'revenue' (money coming in, like an invoice you sent) or 'expense' (money going out, like a receipt for a purchase). If it is unclear, default to 'expense'.
    *   **Description**: Extract the merchant's name or a brief, clear summary of the transaction (e.g., "Starbucks Coffee", "Uber Ride").
    *   **Category**: Infer a suitable business category. Examples: 'Client Work', 'Software', 'Office Supplies', 'Meals & Entertainment', 'Travel', 'Utilities'.
    *   **Date**: Extract the transaction date from the image. If no date is present, use the provided current date. The format must be 'YYYY-MM-DD'.
3.  **Format Output**: You MUST respond with ONLY a valid JSON object that strictly adheres to the output schema. Do not include any explanatory text, markdown formatting, or anything else before or after the JSON object.

**Current Date for Reference**: {{currentDate}}
**Image to Analyze**: {{media url=imageDataUri}}`,
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
