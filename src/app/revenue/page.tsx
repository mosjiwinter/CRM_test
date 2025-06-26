'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, Wand2, Loader2 } from 'lucide-react';
import { getColumns } from '@/components/transactions/columns';
import { DataTable } from '@/components/transactions/data-table';
import { TransactionDialog } from '@/components/transactions/transaction-dialog';
import { initialTransactions } from '@/lib/data';
import type { Transaction } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { createTransactionFromTextAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';

export default function RevenuePage() {
  const [transactions, setTransactions] = useState<Transaction[]>(
    initialTransactions.filter((t) => t.type === 'revenue')
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState<Transaction | undefined>(undefined);

  const [isPending, startTransition] = useTransition();
  const [aiInput, setAiInput] = useState('');
  const { toast } = useToast();

  const openDialog = (transaction?: Transaction) => {
    setTransactionToEdit(transaction);
    setIsDialogOpen(true);
  };
  
  const addOrUpdateTransaction = (transactionData: Omit<Transaction, 'type'>) => {
    setTransactions(current => {
      const existing = current.find(t => t.id === transactionData.id);
      if (existing) {
        return current.map(t => t.id === transactionData.id ? { ...t, ...transactionData, type: 'revenue' } : t);
      }
      return [...current, { ...transactionData, type: 'revenue'}];
    });
  };

  const deleteTransaction = (id: string) => {
    setTransactions(current => current.filter(t => t.id !== id));
  };

  const handleAICreate = () => {
    if (!aiInput.trim()) return;

    startTransition(async () => {
      const result = await createTransactionFromTextAction(aiInput);
      if (result.success && result.data) {
        if (result.data.type !== 'revenue') {
             toast({
                variant: "destructive",
                title: "Incorrect Transaction Type",
                description: "The AI detected an expense. Please add it on the Expenses page.",
            });
            return;
        }
        const partialTransaction = {
            ...result.data,
            id: '',
            date: new Date(result.data.date),
        };
        setAiInput('');
        openDialog(partialTransaction);
      } else {
         toast({
            variant: "destructive",
            title: "AI Error",
            description: result.error || "Could not generate transaction.",
        });
      }
    });
  };

  const columns = getColumns(openDialog, deleteTransaction);

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="flex flex-1 items-center gap-2">
            <Input
                placeholder="e.g., Received $1,200 for web dev last Friday"
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAICreate()}
                disabled={isPending}
            />
            <Button onClick={handleAICreate} disabled={isPending || !aiInput.trim()} className="w-[160px]">
                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                <span>Create with AI</span>
            </Button>
        </div>
        <div className="flex-none">
            <Button onClick={() => openDialog()} className="w-full md:w-auto">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Revenue
            </Button>
        </div>
      </div>
      <Card>
        <CardContent className="pt-6">
          <DataTable columns={columns} data={transactions} filterKey="description" filterPlaceholder="Filter by description..." />
        </CardContent>
      </Card>
      <TransactionDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        type="revenue"
        addOrUpdateTransaction={addOrUpdateTransaction}
        transactionToEdit={transactionToEdit}
      />
    </main>
  );
}
