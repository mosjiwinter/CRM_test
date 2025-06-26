'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from '@/components/ui/sheet';
import { Wand2, Bot } from 'lucide-react';
import { getAiInsights } from '@/app/actions';
import { Skeleton } from '@/components/ui/skeleton';
import { useAppContext } from '@/lib/app-context';
import { Textarea } from '@/components/ui/textarea';

export function AiChatButton() {
  const { transactions } = useAppContext();
  const [isPending, startTransition] = useTransition();
  const [insights, setInsights] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);

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
  
  const onOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
        setInsights('');
        setError('');
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
          size="icon"
        >
          <Wand2 className="h-6 w-6" />
          <span className="sr-only">Open AI Assistant</span>
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>AI Assistant</SheetTitle>
          <SheetDescription>
            Let AI analyze your financial data for trends and suggestions. Click the button below to start.
          </SheetDescription>
        </SheetHeader>
        <div className="py-6 space-y-4 flex flex-col h-[calc(100%-4rem)]">
          <Button onClick={handleGenerateInsights} disabled={isPending} className="w-full flex-none">
            {isPending ? 'Analyzing...' : 'Generate Insights'}
          </Button>
          <div className="space-y-2 text-left flex-grow">
            {isPending && (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            )}
            {error && <p className="text-sm text-destructive">{error}</p>}
            {insights && (
              <div className="flex flex-col gap-2 h-full">
                 <div className="flex items-center gap-2 flex-none">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <Bot className="size-5 text-primary" />
                    </div>
                    <h3 className="font-semibold">AI Assistant</h3>
                 </div>
                <Textarea
                  readOnly
                  value={insights}
                  className="flex-grow resize-none border-0 bg-secondary/50 p-3 text-sm h-full"
                  placeholder="AI response will appear here..."
                />
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
