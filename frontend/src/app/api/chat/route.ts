import { NextRequest, NextResponse } from 'next/server';
import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { supabase } from '@/src/lib/supabase';

export const runtime = 'edge';

interface ChatMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

interface ChatRequest {
    messages: ChatMessage[];
    model: string;
    conversationId?: string;
    workflowId?: string;
    mcpToolSchema?: any;
    presetId?: string;
    temperature?: number;
}

export async function POST(req: NextRequest) {
    try {
        const body: ChatRequest = await req.json();
        const {
            messages,
            model,
            conversationId,
            workflowId,
            mcpToolSchema,
            presetId,
            temperature = 0.7,
        } = body;

        if (!messages || !model) {
            return NextResponse.json(
                { error: 'Missing required fields: messages and model' },
                { status: 400 }
            );
        }

        // Client fetches the key fresh from DB before each request and sends it here.
        // Fall back to env var for dev/self-hosted setups without a saved DB key.
        const apiKey =
            req.headers.get('x-openrouter-api-key') ||
            process.env.OPENROUTER_API_KEY ||
            null;

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
        if (mcpToolSchema) {
            systemPrompt += `You have access to the following MCP tool: ${JSON.stringify(mcpToolSchema)}\n\n`;
        }

        const processedMessages = systemPrompt
            ? [{ role: 'system' as const, content: systemPrompt }, ...messages]
            : messages;

        const openrouter = createOpenAI({
            apiKey,
            baseURL: 'https://openrouter.ai/api/v1',
        });

        const result = await streamText({
            model: openrouter.chat(model),
            messages: processedMessages,
            temperature,
        });

        const encoder = new TextEncoder();
        let fullResponse = '';

        const stream = new ReadableStream({
            async start(controller) {
                try {
                    for await (const chunk of result.textStream) {
                        fullResponse += chunk;
                        controller.enqueue(
                            encoder.encode(`data: ${JSON.stringify({ content: chunk, done: false })}\n\n`)
                        );
                    }

                    if (conversationId) {
                        try {
                            await supabase.from('messages').insert({
                                conversation_id: conversationId,
                                role: 'assistant',
                                content: fullResponse,
                                model,
                                provider: 'openrouter',
                            });
                        } catch (dbErr) {
                            console.error('Failed to save assistant message:', dbErr);
                        }

                        try {
                            await supabase
                                .from('conversations')
                                .update({ updated_at: new Date().toISOString() })
                                .eq('id', conversationId);
                        } catch (dbErr) {
                            console.error('Failed to update conversation:', dbErr);
                        }
                    }

                    controller.enqueue(encoder.encode('data: [DONE]\n\n'));
                    controller.close();
                } catch (error) {
                    console.error('Stream error:', error);
                    controller.error(error);
                }
            },
        });

        return new Response(stream, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            },
        });
    } catch (error: any) {
        console.error('Chat API error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
