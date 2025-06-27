'use server';

import { generateInsight } from '@/ai/flows/generate-insight';
import { createTransactionFromText } from '@/ai/flows/create-transaction-flow';
import { createTransactionFromImage } from '@/ai/flows/create-transaction-from-image-flow';
import { chat } from '@/ai/flows/chat-flow';
import type { Transaction } from '@/lib/types';
import { db } from '@/lib/firebase';
import { collection, writeBatch, doc, addDoc } from 'firebase/firestore';
import { sampleCustomers, sampleProjects, sampleTransactions, sampleAppointments } from '@/lib/seed-data';

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

export async function seedDatabase() {
  try {
    // Note: This is a basic seed. In a real-world scenario, you'd want to
    // check if data already exists to avoid duplication.
    // For this app, we'll assume a fresh database for simplicity.

    // 1. Add customers and get their IDs, as we need them for projects.
    const customerRefs = await Promise.all(
      sampleCustomers.map(customer => addDoc(collection(db, 'customers'), { ...customer, createdAt: new Date() }))
    );
    const customerIds = customerRefs.map(ref => ref.id);

    // 2. Create a new batch for the rest of the data.
    const batch = writeBatch(db);

    // 3. Add projects, assigning customer IDs.
    sampleProjects.forEach((project, index) => {
      const projectDocRef = doc(collection(db, 'projects'));
      // Assign a customer to each project, cycling through the customer IDs if needed.
      const customerId = customerIds[index % customerIds.length];
      batch.set(projectDocRef, { ...project, customerId });
    });

    // 4. Add transactions.
    sampleTransactions.forEach(transaction => {
      const transactionDocRef = doc(collection(db, 'transactions'));
      batch.set(transactionDocRef, transaction);
    });

    // 5. Add appointments.
    sampleAppointments.forEach(appointment => {
      const appointmentDocRef = doc(collection(db, 'appointments'));
      batch.set(appointmentDocRef, appointment);
    });

    // 6. Commit the batch.
    await batch.commit();

    return { success: true, message: 'Sample data has been added successfully!' };
  } catch (error) {
    console.error('Error seeding database:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return { success: false, error: `Failed to seed database. ${errorMessage}` };
  }
}
