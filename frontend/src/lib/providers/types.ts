export type LLMProvider = 'openai' | 'anthropic' | 'openrouter' | 'google';

export interface LLMModel {
    id: string;
    name: string;
    provider: LLMProvider;
    contextWindow: number;
    description?: string;
}

export interface ProviderConfig {
    provider: LLMProvider;
    apiKey: string;
    baseURL?: string;
    enabled: boolean;
}

export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: number;
    model?: string;
    provider?: LLMProvider;
}

export const AVAILABLE_MODELS: Record<LLMProvider, LLMModel[]> = {
    openai: [
        { id: 'gpt-4o', name: 'GPT-4o', provider: 'openai', contextWindow: 128000, description: 'Most capable model' },
        { id: 'gpt-4o-mini', name: 'GPT-4o Mini', provider: 'openai', contextWindow: 128000, description: 'Fast and efficient' },
        { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', provider: 'openai', contextWindow: 128000, description: 'Previous generation' },
    ],
    anthropic: [
        { id: 'claude-3-5-sonnet-20240229', name: 'Claude 3.5 Sonnet', provider: 'anthropic', contextWindow: 200000, description: 'Most intelligent model' },
        { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus', provider: 'anthropic', contextWindow: 200000, description: 'Powerful performance' },
        { id: 'claude-3-haiku-20240307', name: 'Claude 3 Haiku', provider: 'anthropic', contextWindow: 200000, description: 'Fast and compact' },
    ],
    openrouter: [
        { id: 'openai/gpt-4o', name: 'GPT-4o (via OpenRouter)', provider: 'openrouter', contextWindow: 128000 },
        { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet (via OpenRouter)', provider: 'openrouter', contextWindow: 200000 },
        { id: 'google/gemini-pro-1.5', name: 'Gemini 1.5 Pro (via OpenRouter)', provider: 'openrouter', contextWindow: 1000000 },
        { id: 'meta-llama/llama-3.1-70b-instruct', name: 'Llama 3.1 70B', provider: 'openrouter', contextWindow: 128000 },
    ],
    google: [
        { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', provider: 'google', contextWindow: 1000000, description: 'Largest context window' },
        { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', provider: 'google', contextWindow: 1000000, description: 'Fast multimodal' },
    ],
};

export const PROVIDER_INFO: Record<LLMProvider, { name: string; icon: string; description: string; signupUrl: string }> = {
    openai: {
        name: 'OpenAI',
        icon: '🤖',
        description: 'GPT-4o and other models from OpenAI',
        signupUrl: 'https://platform.openai.com/api-keys',
    },
    anthropic: {
        name: 'Anthropic',
        icon: '🔮',
        description: 'Claude 3.5 Sonnet and other models',
        signupUrl: 'https://console.anthropic.com/settings/keys',
    },
    openrouter: {
        name: 'OpenRouter',
        icon: '🌐',
        description: 'Access multiple LLMs through one API',
        signupUrl: 'https://openrouter.ai/keys',
    },
    google: {
        name: 'Google AI',
        icon: '✨',
        description: 'Gemini models with huge context windows',
        signupUrl: 'https://aistudio.google.com/app/apikey',
    },
};
