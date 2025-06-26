'use server';

import { generateInsight } from '@/ai/flows/generate-insight';
import { createTransactionFromText } from '@/ai/flows/create-transaction-flow';
import { createTransactionFromImage } from '@/ai/flows/create-transaction-from-image-flow';
import { chat } from '@/ai/flows/chat-flow';
import type { Transaction } from '@/lib/types';

export async function getAiInsights(transactions: Transaction[]) {
  try {
    const revenueData = transactions.filter((t) => t.type === 'revenue');
    const expenseData = transactions.filter((t) => t.type === 'expense');

    if (revenueData.length === 0 && expenseData.length === 0) {
      return 'Not enough data to generate insights. Please add some revenue and expenses first.';
    }

    // Sort data to help the model understand trends
    const sortData = (data: Transaction[]) => data.sort((a, b) => a.date.getTime() - b.date.getTime());

    const result = await generateInsight({
      revenueData: JSON.stringify(sortData(revenueData)),
      expenseData: JSON.stringify(sortData(expenseData)),
    });
    return result.insights;
  } catch (error) {
    console.error('Error generating insights:', error);
    return 'We had trouble generating insights. Please try again later.';
  }
}

export async function createTransactionFromTextAction(text: string) {
    try {
        const result = await createTransactionFromText({ text });
        return { success: true, data: result };
    } catch (error) {
        console.error('Error creating transaction from text:', error);
        return { success: false, error: 'Failed to parse transaction from text. Please try again or enter manually.' };
    }
}

export async function createTransactionFromImageAction(imageDataUri: string) {
    try {
        const result = await createTransactionFromImage({ imageDataUri });
        return { success: true, data: result };
    } catch (error) {
        console.error('Error creating transaction from image:', error);
        return { success: false, error: 'Failed to parse transaction from image. Please try again or enter manually.' };
    }
}

export async function getAiChatResponse(history: { role: 'user' | 'model'; content: string }[], transactions: Transaction[]) {
    try {
        const sortData = (data: Transaction[]) => data.sort((a, b) => a.date.getTime() - b.date.getTime());
        const allTransactions = sortData(transactions);

        const result = await chat({
            history,
            transactions: JSON.stringify(allTransactions),
        });
        return { success: true, data: result.answer };
    } catch (error) {
        console.error('Error in chat flow:', error);
        return { success: false, error: 'AI assistant is having trouble. Please try again later.' };
    }
}
