'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { getColumns } from '@/components/transactions/columns';
import { DataTable } from '@/components/transactions/data-table';
import { TransactionDialog } from '@/components/transactions/transaction-dialog';
import { initialTransactions } from '@/lib/data';
import type { Transaction } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';

export default function RevenuePage() {
  const [transactions, setTransactions] = useState<Transaction[]>(
    initialTransactions.filter((t) => t.type === 'revenue')
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState<Transaction | undefined>(undefined);

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

  const columns = getColumns(openDialog, deleteTransaction);

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-end">
        <Button onClick={() => openDialog()}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Revenue
        </Button>
      </div>
      <Card>
        <CardContent className="pt-6">
          <DataTable columns={columns} data={transactions} />
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
