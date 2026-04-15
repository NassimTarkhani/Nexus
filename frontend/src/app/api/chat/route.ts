import { NextRequest, NextResponse } from 'next/server';
import { createOpenAI } from '@ai-sdk/openai';
import { generateText, tool, zodSchema } from 'ai';
import { z } from 'zod';
import { supabase } from '@/src/lib/supabase';

export const maxDuration = 60;

const FREE_MODEL_FALLBACK = 'openai/gpt-oss-120b:free';
const KNOWN_UNAVAILABLE_FREE_MODELS = new Set([
    'google/gemini-2.0-flash-exp:free',
    'mistralai/mistral-small-3.2-24b-instruct:free',
    'qwen/qwen3-235b-a22b:free',
    'qwen/qwen3-30b-a3b:free',
    'deepseek/deepseek-r1-0528:free',
    'deepseek/deepseek-chat-v3-0324:free',
    'microsoft/phi-4-reasoning-plus:free',
    'moonshotai/kimi-dev-72b:free',
    'meta-llama/llama-4-maverick:free',
]);

function resolveModel(requestedModel: string): string {
    return KNOWN_UNAVAILABLE_FREE_MODELS.has(requestedModel)
        ? FREE_MODEL_FALLBACK
        : requestedModel;
}

function isRetryableOpenRouterKeyError(message: string): boolean {
    const normalized = message.toLowerCase();
    return normalized.includes('user not found')
        || normalized.includes('unauthorized')
        || normalized.includes('incorrect api key')
        || normalized.includes('invalid api key')
        || normalized.includes('api key usd spend limit exceeded')
        || normalized.includes('credit limit')
        || normalized.includes('401');
}

async function generateWithOpenRouter(options: {
    apiKey: string;
    model: string;
    messages: ChatMessage[] | ({ role: 'system'; content: string } | ChatMessage)[];
    temperature: number;
    tools: ReturnType<typeof buildTools>;
}) {
    const openrouter = createOpenAI({
        apiKey: options.apiKey,
        baseURL: 'https://openrouter.ai/api/v1',
    });

    return generateText({
        model: openrouter.chat(options.model),
        messages: options.messages,
        temperature: options.temperature,
        ...(options.tools ? { tools: options.tools, maxSteps: 5 } : {}),
    });
}

// ── Tool definitions ───────────────────────────────────────────────────────

function buildTools(req: NextRequest, toolMode: 'auto' | 'manual' | 'none') {
    if (toolMode === 'none') return undefined;

    return {
        webSearch: tool({
            description:
                'Search the web for real-time information. Use this for current events, facts, and anything outside your training data.',
            inputSchema: zodSchema(z.object({
                query: z.string().describe('The search query'),
                maxResults: z.number().default(5),
            })),
            execute: async ({ query, maxResults }) => {
                const limit = maxResults ?? 5;
                const baseUrl = req.headers.get('origin') || 'http://localhost:3000';
                const res = await fetch(
                    `${baseUrl}/api/search?q=${encodeURIComponent(query)}&limit=${limit}`
                );
                if (!res.ok) return { error: `Search failed: ${res.status}` };
                return await res.json();
            },
        }),

        runJavaScript: tool({
            description: 'Execute JavaScript code and return output. Useful for calculations and data manipulation.',
            inputSchema: zodSchema(z.object({
                code: z.string().describe('JavaScript code to execute'),
            })),
            execute: async ({ code }) => {
                const baseUrl = req.headers.get('origin') || 'http://localhost:3000';
                const res = await fetch(`${baseUrl}/api/js-exec`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ code }),
                });
                if (!res.ok) return { error: `Execution failed: ${res.status}` };
                return await res.json();
            },
        }),

        generateImage: tool({
            description: 'Generate an image from a text description using DALL-E 3 or Gemini Imagen.',
            inputSchema: zodSchema(z.object({
                prompt: z.string().describe('Detailed description of the image to generate'),
                size: z.enum(['1024x1024', '1792x1024', '1024x1792']).default('1024x1024'),
            })),
            execute: async ({ prompt, size }) => {
                const imgSize = size ?? '1024x1024';
                const baseUrl = req.headers.get('origin') || 'http://localhost:3000';
                const geminiKey = process.env.GEMINI_API_KEY;
                const openaiKey = process.env.OPENAI_API_KEY;
                const headers: Record<string, string> = { 'Content-Type': 'application/json' };
                if (geminiKey) headers['x-gemini-api-key'] = geminiKey;
                if (openaiKey) headers['x-openai-api-key'] = openaiKey;
                const provider = geminiKey ? 'gemini' : 'openai';
                const res = await fetch(`${baseUrl}/api/image-gen`, {
                    method: 'POST', headers,
                    body: JSON.stringify({ prompt, provider, size: imgSize }),
                });
                if (!res.ok) return { error: 'Image generation failed' };
                const data = await res.json();
                return { url: data.url, prompt };
            },
        }),

        getCurrentDateTime: tool({
            description: 'Get the current date and time.',
            inputSchema: zodSchema(z.object({})),
            execute: async () => ({ datetime: new Date().toISOString() }),
        }),

        browsePage: tool({
            description:
                'Open a URL in a headless browser using Playwright and return the page content. ' +
                'Use this to fetch live web pages, read articles, or get content from any website.',
            inputSchema: zodSchema(z.object({
                url: z.string().describe('The full URL to open, e.g. https://example.com'),
            })),
            execute: async ({ url }) => {
                const baseUrl = req.headers.get('origin') || 'http://localhost:3000';
                try {
                    // Navigate to the URL
                    const navRes = await fetch(`${baseUrl}/api/mcp`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            method: 'tools/call',
                            params: { name: 'browser_navigate', arguments: { url } },
                        }),
                    });
                    if (!navRes.ok) return { error: `Navigation failed: ${navRes.status}`, url };

                    // Get accessibility snapshot (structured text content)
                    const snapRes = await fetch(`${baseUrl}/api/mcp`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            method: 'tools/call',
                            params: { name: 'browser_snapshot', arguments: {} },
                        }),
                    });
                    if (!snapRes.ok) return { error: `Snapshot failed: ${snapRes.status}`, url };

                    const data = await snapRes.json() as { result?: { content?: Array<{ text?: string }> } };
                    const text = data.result?.content?.map((c) => c.text ?? '').join('\n') ?? '';
                    return { url, content: text.slice(0, 8000) };
                } catch (err: unknown) {
                    return { error: err instanceof Error ? err.message : 'Browser error', url };
                }
            },
        }),
    };
}

interface ChatMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

interface ChatRequest {
    messages: ChatMessage[];
    model: string;
    conversationId?: string;
    workflowId?: string;
    mcpToolSchema?: unknown;
    presetId?: string;
    temperature?: number;
    toolMode?: 'auto' | 'manual' | 'none';
}

export async function POST(req: NextRequest) {
    try {
        const body: ChatRequest = await req.json();
        const {
            messages,
            model,
            conversationId,
            workflowId,
            presetId,
            temperature = 0.7,
            toolMode = 'auto',
        } = body;

        if (!messages || !model) {
            return NextResponse.json(
                { error: 'Missing required fields: messages and model' },
                { status: 400 }
            );
        }

        // Client fetches the key fresh from DB before each request and sends it here.
        // Fall back to env var for dev/self-hosted setups without a saved DB key.
        const headerApiKey = req.headers.get('x-openrouter-api-key');
        const envApiKey = process.env.OPENROUTER_API_KEY || null;
        const apiKey = headerApiKey || envApiKey;

        if (!apiKey) {
            return NextResponse.json(
                { error: 'OpenRouter API key not found. Go to Settings and save your key.' },
                { status: 401 }
            );
        }

        // Build system prompt
        let systemPrompt = '';

        // Preset system prompt
        if (presetId) {
            try {
                const { data: preset } = await supabase
                    .from('user_presets')
                    .select('system_prompt')
                    .eq('id', presetId)
                    .single();

                if (preset?.system_prompt) {
                    systemPrompt += preset.system_prompt + '\n\n';
                }
            } catch {
                // user_presets table may not exist yet
            }
        }

        // Workflow context
        if (workflowId) {
            try {
                const { data: workflow } = await supabase
                    .from('user_workflows')
                    .select('name, description')
                    .eq('id', workflowId)
                    .single();

                if (workflow) {
                    systemPrompt += `You are executing the "${workflow.name}" workflow. ${workflow.description || ''}\n\n`;
                }
            } catch {
                // ignore
            }
        }

        // MCP tool context
        if (toolMode !== 'none') {
            systemPrompt +=
                'You have access to tools: webSearch, runJavaScript, generateImage, getCurrentDateTime. ' +
                'Use them proactively when the user asks for current information, computations, or images.\n\n';
        }

        const processedMessages = systemPrompt
            ? [{ role: 'system' as const, content: systemPrompt }, ...messages]
            : messages;

        const resolvedModel = resolveModel(model);

        const tools = buildTools(req, toolMode);
        let result;

        try {
            result = await generateWithOpenRouter({
                apiKey,
                model: resolvedModel,
                messages: processedMessages,
                temperature,
                tools,
            });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'OpenRouter request failed';
            const shouldRetryWithEnv = Boolean(
                headerApiKey && envApiKey && headerApiKey !== envApiKey && isRetryableOpenRouterKeyError(message)
            );

            if (!shouldRetryWithEnv) {
                throw error;
            }

            result = await generateWithOpenRouter({
                apiKey: envApiKey!,
                model: resolvedModel,
                messages: processedMessages,
                temperature,
                tools,
            });
        }

        const payload = [
            `data: ${JSON.stringify({ content: result.text ?? '', done: false })}`,
            'data: [DONE]',
            '',
        ].join('\n\n');

        return new Response(payload, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            },
        });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Internal server error';
        console.error('Chat API error:', message);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
