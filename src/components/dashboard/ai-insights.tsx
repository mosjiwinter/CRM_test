'use client';

import { useState, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="text-primary" />
          <span>AI Insights</span>
        </CardTitle>
        <CardDescription>
          Let AI analyze your financial data for trends and suggestions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button onClick={handleGenerateInsights} disabled={isPending} className="w-full">
            {isPending ? 'Analyzing...' : 'Generate Insights'}
          </Button>
          {isPending && (
            <div className="space-y-2 pt-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
            </div>
          )}
          {error && <p className="text-sm text-destructive">{error}</p>}
          {insights && <p className="text-sm text-muted-foreground whitespace-pre-wrap">{insights}</p>}
        </div>
      </CardContent>
    </Card>
  );
}
