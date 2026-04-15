import type { LLMProvider, ChatMessage } from './types';
import { useProviderStore } from './store';

export interface StreamOptions {
    onChunk?: (chunk: string) => void;
    onComplete?: (fullText: string) => void;
    onError?: (error: Error) => void;
    signal?: AbortSignal;
}

class LLMClient {
    async streamCompletion(
        messages: ChatMessage[],
        provider: LLMProvider,
        model: string,
        options: StreamOptions = {}
    ): Promise<void> {
        const providerConfig = useProviderStore.getState().getProviderConfig(provider);

        if (!providerConfig || !providerConfig.apiKey) {
            throw new Error(`${provider} API key not configured`);
        }

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: messages.map(m => ({ role: m.role, content: m.content })),
                    provider,
                    model,
                    apiKey: providerConfig.apiKey,
                    baseURL: providerConfig.baseURL,
                    stream: true,
                }),
                signal: options.signal,
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to get response');
            }

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            let fullText = '';

            if (!reader) {
                throw new Error('No response body');
            }

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split('\n').filter(line => line.trim());

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6);
                        if (data === '[DONE]') continue;

                        try {
                            const parsed = JSON.parse(data);
                            const content = parsed.content || '';
                            if (content) {
                                fullText += content;
                                options.onChunk?.(content);
                            }
                        } catch (e) {
                            console.error('Failed to parse SSE data:', e);
                        }
                    }
                }
            }

            options.onComplete?.(fullText);
        } catch (error) {
            if (error instanceof Error) {
                options.onError?.(error);
            } else {
                options.onError?.(new Error('Unknown error occurred'));
            }
            throw error;
        }
    }

    async getSingleCompletion(
        messages: ChatMessage[],
        provider: LLMProvider,
        model: string
    ): Promise<string> {
        return new Promise((resolve, reject) => {
            let fullText = '';
            this.streamCompletion(messages, provider, model, {
                onChunk: (chunk) => { fullText += chunk; },
                onComplete: () => resolve(fullText),
                onError: reject,
            });
        });
    }
}

export const llmClient = new LLMClient();
