import { config } from 'dotenv';
config();

import '@/ai/flows/generate-insight.ts';
import '@/ai/flows/create-transaction-flow.ts';
import '@/ai/flows/create-transaction-from-image-flow.ts';
import '@/ai/flows/chat-flow.ts';
import '@/ai/flows/tts-flow.ts';
