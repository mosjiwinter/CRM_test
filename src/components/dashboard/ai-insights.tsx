'use client';

import { useState, useTransition } from 'react';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wand2 } from 'lucide-react';
import type { Transaction } from '@/lib/types';
import { getAiInsights } from '@/app/actions';
import { Skeleton } from '@/components/ui/skeleton';

type AIInsightsProps = {
  transactions: Transaction[];
};

export function AIInsights({ transactions }: AIInsightsProps) {
  const [isPending, startTransition] = useTransition();
  const [insights, setInsights] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleGenerateInsights = () => {
    startTransition(async () => {
      setError('');
      setInsights('');
      const result = await getAiInsights(transactions);
      if (result.startsWith('We had trouble') || result.startsWith('Not enough data')) {
        setError(result);
      } else {
        setInsights(result);
      }
    });
  };

  return (
    <Card className="flex h-full flex-col p-6 text-center">
      <div className="flex-1">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10">
          <Wand2 className="size-6 text-primary" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">AI Insights</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Let AI analyze your financial data for trends and suggestions.
        </p>
      </div>
      <div className="mt-6 space-y-2">
        <Button onClick={handleGenerateInsights} disabled={isPending} className="w-full">
          {isPending ? 'Analyzing...' : 'Generate Insights'}
        </Button>
        {isPending && (
          <div className="space-y-2 pt-2 text-left">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        )}
        {error && <p className="text-sm text-destructive">{error}</p>}
        {insights && <p className="text-sm text-muted-foreground whitespace-pre-wrap text-left">{insights}</p>}
      </div>
    </Card>
  );
}
