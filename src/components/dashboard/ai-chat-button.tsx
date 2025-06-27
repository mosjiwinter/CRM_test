'use client';

import { useState, useTransition, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from '@/components/ui/sheet';
import { Bot, User, SendHorizonal, Loader2, Volume2 } from 'lucide-react';
import { getAiChatResponse, getTtsAction } from '@/app/actions';
import { useAppContext } from '@/lib/app-context';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';

type Message = {
  id: string;
  role: 'user' | 'model';
  content: string;
};

const formSchema = z.object({
  prompt: z.string().min(1, 'Message cannot be empty.'),
});

export function AiChatButton() {
  const { transactions } = useAppContext();
  const [isPending, startTransition] = useTransition();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const [audioState, setAudioState] = useState<Record<string, { loading: boolean }>>({});
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { prompt: '' },
  });

  useEffect(() => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTo({ top: viewport.scrollHeight, behavior: 'smooth' });
        }
    }
  }, [messages]);

  const onOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open && messages.length === 0) {
      setMessages([
        { id: `model-${Date.now()}`, role: 'model', content: "Hello! I'm your financial assistant. Ask me anything about your revenue, expenses, or look for trends." }
      ]);
    }
  };
  
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const userInput = values.prompt;
    if (!userInput.trim()) return;

    const userMessageId = `user-${Date.now()}`;
    const newMessages: Message[] = [...messages, { id: userMessageId, role: 'user', content: userInput }];
    setMessages(newMessages);
    form.reset();

    startTransition(async () => {
      const historyForApi = newMessages.map(({role, content}) => ({role, content}));
      const result = await getAiChatResponse(historyForApi, transactions);
      const modelMessageId = `model-${Date.now()}`;
      if (result.success && result.data) {
        setMessages(prev => [...prev, { id: modelMessageId, role: 'model', content: result.data as string }]);
      } else {
        setMessages(prev => [...prev, { id: modelMessageId, role: 'model', content: result.error || "I had trouble responding. Please try again." }]);
      }
    });
  };

  const handlePlayAudio = async (messageId: string, text: string) => {
    if (audioRef.current) {
        audioRef.current.pause();
    }
    
    setAudioState(prev => ({ ...prev, [messageId]: { loading: true } }));
    
    const result = await getTtsAction(text);

    if (result.success && result.data) {
        if (!audioRef.current) {
            audioRef.current = new Audio();
        }
        audioRef.current.src = result.data;
        audioRef.current.play().catch(e => {
            console.error("Audio play failed", e);
            toast({ variant: "destructive", title: "Audio Error", description: "Could not play audio." });
            setAudioState(prev => ({ ...prev, [messageId]: { loading: false } }));
        });
        
        audioRef.current.onended = () => {
             setAudioState(prev => ({ ...prev, [messageId]: { loading: false } }));
        };
        audioRef.current.onplaying = () => {
             setAudioState(prev => ({ ...prev, [messageId]: { loading: false } }));
        };
        audioRef.current.onerror = () => {
             toast({ variant: "destructive", title: "Audio Error", description: "Could not play audio." });
             setAudioState(prev => ({ ...prev, [messageId]: { loading: false } }));
        };
    } else {
        toast({
            variant: "destructive",
            title: "Audio Error",
            description: result.error || "Could not generate audio.",
        });
        setAudioState(prev => ({ ...prev, [messageId]: { loading: false } }));
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
          size="icon"
        >
          <Bot className="h-6 w-6" />
          <span className="sr-only">Open AI Assistant</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>AI Assistant</SheetTitle>
          <SheetDescription>
            Chat with an AI to get insights about your finances.
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="flex-grow my-4 pr-4 -mr-4" ref={scrollAreaRef}>
          <div className="space-y-6 pr-4">
            {messages.map((message) => (
              <div key={message.id} className={cn('flex items-end gap-3', message.role === 'user' && 'justify-end')}>
                {message.role === 'model' && (
                  <>
                    <Avatar className="h-8 w-8 border shrink-0">
                      <AvatarFallback><Bot size={20} className="text-primary" /></AvatarFallback>
                    </Avatar>
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        'rounded-lg px-4 py-2 text-sm', 
                        'bg-muted'
                      )}>
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 shrink-0 text-muted-foreground hover:text-foreground"
                        onClick={() => handlePlayAudio(message.id, message.content)}
                        disabled={audioState[message.id]?.loading || isPending}
                      >
                        {audioState[message.id]?.loading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Volume2 className="h-4 w-4" />
                        )}
                        <span className="sr-only">Play audio</span>
                      </Button>
                    </div>
                  </>
                )}
                 {message.role === 'user' && (
                  <>
                    <div className={cn(
                      'rounded-lg px-4 py-2 text-sm max-w-[80%]', 
                      'bg-primary text-primary-foreground'
                    )}>
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>
                    <Avatar className="h-8 w-8 border shrink-0">
                      <AvatarFallback><User size={20} /></AvatarFallback>
                    </Avatar>
                  </>
                )}
              </div>
            ))}
             {isPending && (
                <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8 border">
                        <AvatarFallback><Bot size={20} className="text-primary" /></AvatarFallback>
                    </Avatar>
                    <div className="rounded-lg px-4 py-2 text-sm bg-muted flex items-center">
                        <Loader2 className="h-5 w-5 animate-spin" />
                    </div>
                </div>
            )}
          </div>
        </ScrollArea>
        <div className="mt-auto bg-background pt-4">
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center gap-2">
                <FormField
                  control={form.control}
                  name="prompt"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input 
                            placeholder="e.g., What was my biggest expense?" 
                            {...field} 
                            disabled={isPending}
                            autoComplete="off"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button type="submit" size="icon" disabled={isPending}>
                  <SendHorizonal className="h-5 w-5" />
                  <span className="sr-only">Send</span>
                </Button>
            </form>
            </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
