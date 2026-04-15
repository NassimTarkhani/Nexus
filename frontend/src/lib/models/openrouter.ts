// OpenRouter Free Models — tool-capable, verified April 2026
// All marked with tool_calling: true support function/tool use natively.
export const OPENROUTER_FREE_MODELS = [
    {
        id: "openai/gpt-oss-120b:free",
        name: "GPT OSS 120B",
        provider: "OpenAI",
        description: "OpenAI open-weights 120B model — currently available on free OpenRouter routing",
        contextLength: 131072,
        free: true,
        toolCalling: true,
    },
    {
        id: "google/gemini-2.0-flash-exp:free",
        name: "Gemini 2.0 Flash",
        provider: "Google",
        description: "Google's fastest multimodal model — excellent tool calling & function use",
        contextLength: 1048576,
        free: true,
        toolCalling: true,
    },
    {
        id: "meta-llama/llama-3.3-70b-instruct:free",
        name: "Llama 3.3 70B",
        provider: "Meta",
        description: "Meta's 70B instruct model — strong tool calling and agentic tasks",
        contextLength: 131072,
        free: true,
        toolCalling: true,
    },
    {
        id: "mistralai/mistral-small-3.2-24b-instruct:free",
        name: "Mistral Small 3.2 24B",
        provider: "Mistral",
        description: "Fast 24B model with native function calling support",
        contextLength: 131072,
        free: true,
        toolCalling: true,
    },
    {
        id: "qwen/qwen3-235b-a22b:free",
        name: "Qwen3 235B A22B",
        provider: "Alibaba",
        description: "Qwen3 MoE — hybrid thinking, strong at tool use and coding",
        contextLength: 131072,
        free: true,
        toolCalling: true,
    },
    {
        id: "qwen/qwen3-30b-a3b:free",
        name: "Qwen3 30B A3B",
        provider: "Alibaba",
        description: "Compact Qwen3 MoE — fast tool calling with good reasoning",
        contextLength: 131072,
        free: true,
        toolCalling: true,
    },
    {
        id: "deepseek/deepseek-r1-0528:free",
        name: "DeepSeek R1 0528",
        provider: "DeepSeek",
        description: "DeepSeek's reasoning model — strong multi-step agentic use",
        contextLength: 163840,
        free: true,
        toolCalling: true,
    },
    {
        id: "deepseek/deepseek-chat-v3-0324:free",
        name: "DeepSeek V3",
        provider: "DeepSeek",
        description: "DeepSeek V3 — fast chat with tool-calling capability",
        contextLength: 163840,
        free: true,
        toolCalling: true,
    },
    {
        id: "microsoft/phi-4-reasoning-plus:free",
        name: "Phi-4 Reasoning+",
        provider: "Microsoft",
        description: "Microsoft Phi-4 with enhanced reasoning — solid at tool use",
        contextLength: 32768,
        free: true,
        toolCalling: true,
    },
    {
        id: "google/gemma-3-27b-it:free",
        name: "Gemma 3 27B",
        provider: "Google",
        description: "Google's Gemma 3 27B — multimodal, 140+ languages",
        contextLength: 128000,
        free: true,
        toolCalling: false,
    },
    {
        id: "nousresearch/hermes-3-llama-3.1-405b:free",
        name: "Hermes 3 405B",
        provider: "Nous Research",
        description: "Hermes 3 on Llama 3.1 405B — advanced agentic & tool capabilities",
        contextLength: 131072,
        free: true,
        toolCalling: true,
    },
] as const;

export type OpenRouterModel = typeof OPENROUTER_FREE_MODELS[number];

export interface ChatModel {
    provider: "openrouter";
    model: string;
}

export const DEFAULT_MODEL: ChatModel = {
    provider: "openrouter",
    model: "openai/gpt-oss-120b:free",
};
