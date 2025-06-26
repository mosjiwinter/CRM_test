import {z} from 'genkit';

export const CreateTransactionOutputSchema = z.object({
  description: z.string().describe("A concise description of the transaction."),
  category: z.string().describe("A relevant category for the transaction (e.g., 'Client Work', 'Software', 'Office Supplies')."),
  amount: z.number().describe("The transaction amount as a positive number."),
  type: z.enum(['revenue', 'expense']).describe("The type of transaction."),
  date: z.string().describe("The date of the transaction in 'YYYY-MM-DD' format."),
});
export type CreateTransactionOutput = z.infer<typeof CreateTransactionOutputSchema>;
