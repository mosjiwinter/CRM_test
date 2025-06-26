// use server'
'use server';
/**
 * @fileOverview AI-powered financial insight generator.
 *
 * - generateInsight - A function that generates insights from financial data.
 * - GenerateInsightInput - The input type for the generateInsight function.
 * - GenerateInsightOutput - The return type for the generateInsight function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateInsightInputSchema = z.object({
  revenueData: z.string().describe('Historical revenue data as a JSON string.'),
  expenseData: z.string().describe('Historical expense data as a JSON string.'),
});

export type GenerateInsightInput = z.infer<typeof GenerateInsightInputSchema>;

const GenerateInsightOutputSchema = z.object({
  insights: z.string().describe('Generated insights from the financial data.'),
});

export type GenerateInsightOutput = z.infer<typeof GenerateInsightOutputSchema>;

export async function generateInsight(input: GenerateInsightInput): Promise<GenerateInsightOutput> {
  return generateInsightFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateInsightPrompt',
  input: {schema: GenerateInsightInputSchema},
  output: {schema: GenerateInsightOutputSchema},
  prompt: `You are an AI-powered financial analyst. Analyze the provided revenue and expense data and provide insights, such as identifying unusual revenue spikes or spending patterns.

Revenue Data: {{{revenueData}}}
Expense Data: {{{expenseData}}}

Insights:`,
});

const generateInsightFlow = ai.defineFlow(
  {
    name: 'generateInsightFlow',
    inputSchema: GenerateInsightInputSchema,
    outputSchema: GenerateInsightOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
