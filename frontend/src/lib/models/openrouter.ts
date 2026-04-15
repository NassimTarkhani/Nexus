// OpenRouter Free Models Configuration — verified active as of March 2026 (live API)
export const OPENROUTER_FREE_MODELS = [
    {
        id: "meta-llama/llama-3.3-70b-instruct:free",
        name: "Llama 3.3 70B Instruct",
        provider: "Meta",
        description: "Meta's reliable 70B instruction model — great all-rounder",
        contextLength: 131072,
        free: true,
    },
    {
        id: "openai/gpt-oss-20b:free",
        name: "GPT OSS 20B",
        provider: "OpenAI",
        description: "OpenAI's open-source 20B MoE — fast with reasoning support",
        contextLength: 131072,
        free: true,
    },
    {
        id: "openai/gpt-oss-120b:free",
        name: "GPT OSS 120B",
        provider: "OpenAI",
        description: "OpenAI's open-source 120B MoE — powerful with reasoning",
        contextLength: 131072,
        free: true,
    },
    {
        id: "nousresearch/hermes-3-llama-3.1-405b:free",
        name: "Hermes 3 405B Instruct",
        provider: "Nous Research",
        description: "Hermes 3 on Llama 3.1 405B — advanced agentic capabilities",
        contextLength: 131072,
        free: true,
    },
    {
        id: "qwen/qwen3-coder:free",
        name: "Qwen3 Coder 480B",
        provider: "Alibaba",
        description: "Qwen3 Coder 480B MoE — optimised for coding and tool use",
        contextLength: 262000,
        free: true,
    },
    {
        id: "stepfun/step-3.5-flash:free",
        name: "Step 3.5 Flash",
        provider: "StepFun",
        description: "StepFun's 196B MoE reasoning model — fast and efficient",
        contextLength: 256000,
        free: true,
    },
    {
        id: "nvidia/nemotron-3-nano-30b-a3b:free",
        name: "Nemotron 3 Nano 30B",
        provider: "NVIDIA",
        description: "NVIDIA's 30B MoE model — agentic AI, 256K context",
        contextLength: 256000,
        free: true,
    },
    {
        id: "z-ai/glm-4.5-air:free",
        name: "GLM 4.5 Air",
        provider: "Z.ai",
        description: "GLM 4.5 Air MoE — hybrid thinking/non-thinking modes",
        contextLength: 131072,
        free: true,
    },
    {
        id: "cognitivecomputations/dolphin-mistral-24b-venice-edition:free",
        name: "Dolphin Mistral 24B",
        provider: "Venice / CognitiveComputations",
        description: "Uncensored Mistral-based 24B model — steerability focus",
        contextLength: 32768,
        free: true,
    },
    {
        id: "google/gemma-3-27b-it:free",
        name: "Gemma 3 27B",
        provider: "Google",
        description: "Google's Gemma 3 27B — multimodal, 140+ languages",
        contextLength: 128000,
        free: true,
    },
] as const;

export type OpenRouterModel = typeof OPENROUTER_FREE_MODELS[number];

export interface ChatModel {
    provider: "openrouter";
    model: string;
}

export const DEFAULT_MODEL: ChatModel = {
    provider: "openrouter",
    model: "meta-llama/llama-3.3-70b-instruct:free",
};
