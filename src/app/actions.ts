'use server';

import { generateInsight } from '@/ai/flows/generate-insight';
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
