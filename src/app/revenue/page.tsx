'use client';

import { useState, useTransition, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, Wand2, Loader2, ScanLine } from 'lucide-react';
import { getColumns } from '@/components/transactions/columns';
import { DataTable } from '@/components/transactions/data-table';
import { TransactionDialog } from '@/components/transactions/transaction-dialog';
import type { Transaction } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { createTransactionFromTextAction, createTransactionFromImageAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { useAppContext } from '@/lib/app-context';

export default function RevenuePage() {
  const { transactions, projects, addOrUpdateTransaction, deleteTransaction } = useAppContext();
  const revenueTransactions = transactions.filter((t) => t.type === 'revenue');
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState<Transaction | undefined>(undefined);

  const [isPending, startTransition] = useTransition();
  const [aiInput, setAiInput] = useState('');
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openDialog = (transaction?: Transaction) => {
    setTransactionToEdit(transaction);
    setIsDialogOpen(true);
  };
  
  const handleDialogSave = async (transactionData: Omit<Transaction, 'type'>) => {
    await addOrUpdateTransaction(transactionData, 'revenue');
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
        openDialog(partialTransaction as Transaction);
      } else {
         toast({
            variant: "destructive",
            title: "AI Error",
            description: result.error || "Could not generate transaction.",
        });
      }
    });
  };
  
  const handleScanClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageDataUri = e.target?.result as string;
      if (!imageDataUri) return;

      startTransition(async () => {
        const result = await createTransactionFromImageAction(imageDataUri);
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
            openDialog(partialTransaction as Transaction);
        } else {
            toast({
                variant: "destructive",
                title: "AI Error",
                description: result.error || "Could not generate transaction from image.",
            });
        }
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };
    reader.readAsDataURL(file);
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
        <div className="flex-none flex items-center gap-2">
            <Button onClick={handleScanClick} variant="outline" disabled={isPending} className="w-full md:w-auto">
                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ScanLine className="mr-2 h-4 w-4" />}
                Scan Invoice
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
              disabled={isPending}
            />
            <Button onClick={() => openDialog()} className="w-full md:w-auto">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Revenue
            </Button>
        </div>
      </div>
      <Card>
        <CardContent className="pt-6">
          <DataTable columns={columns} data={revenueTransactions} filterKey="description" filterPlaceholder="Filter by description..." />
        </CardContent>
      </Card>
      <TransactionDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        type="revenue"
        addOrUpdateTransaction={handleDialogSave}
        transactionToEdit={transactionToEdit}
        projects={projects}
      />
    </main>
  );
}
