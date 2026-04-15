import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { LLMProvider } from './providers/types';

export interface Agent {
    id: string;
    name: string;
    description: string;
    systemPrompt: string;
    provider: LLMProvider;
    model: string;
    tools: string[];
    temperature: number;
    createdAt: number;
    updatedAt: number;
}

interface AgentState {
    agents: Agent[];
    selectedAgent: string | null;

    createAgent: (agent: Omit<Agent, 'id' | 'createdAt' | 'updatedAt'>) => Agent;
    updateAgent: (id: string, updates: Partial<Agent>) => void;
    deleteAgent: (id: string) => void;
    getAgent: (id: string) => Agent | undefined;
    setSelectedAgent: (id: string | null) => void;
}

export const useAgentStore = create<AgentState>()(
    persist(
        (set, get) => ({
            agents: [
                {
                    id: 'default-researcher',
                    name: 'Research Assistant',
                    description: 'Specialized in deep research and data synthesis',
                    systemPrompt: 'You are an expert research assistant. Your role is to help users conduct thorough research, synthesize information from multiple sources, and provide well-structured summaries with citations. Always verify facts and provide balanced perspectives.',
                    provider: 'openrouter',
                    model: 'meta-llama/llama-3.3-70b-instruct:free',
                    tools: ['web-search', 'data-viz'],
                    temperature: 0.7,
                    createdAt: Date.now(),
                    updatedAt: Date.now(),
                },
                {
                    id: 'default-coder',
                    name: 'Code Expert',
                    description: 'Expert in multiple programming languages and best practices',
                    systemPrompt: 'You are a senior software engineer with expertise in multiple programming languages, software architecture, and best practices. Help users write clean, efficient, and maintainable code. Provide explanations for your suggestions and consider edge cases.',
                    provider: 'openrouter',
                    model: 'google/gemma-3-27b-it:free',
                    tools: ['js-executor'],
                    temperature: 0.3,
                    createdAt: Date.now(),
                    updatedAt: Date.now(),
                },
            ],
            selectedAgent: null,

            createAgent: (agentData) => {
                const newAgent: Agent = {
                    ...agentData,
                    id: `agent-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    createdAt: Date.now(),
                    updatedAt: Date.now(),
                };
                set((state) => ({ agents: [...state.agents, newAgent] }));
                return newAgent;
            },

            updateAgent: (id, updates) =>
                set((state) => ({
                    agents: state.agents.map((agent) =>
                        agent.id === id
                            ? { ...agent, ...updates, updatedAt: Date.now() }
                            : agent
                    ),
                })),

            deleteAgent: (id) =>
                set((state) => ({
                    agents: state.agents.filter((agent) => agent.id !== id),
                    selectedAgent: state.selectedAgent === id ? null : state.selectedAgent,
                })),

            getAgent: (id) => get().agents.find((agent) => agent.id === id),

            setSelectedAgent: (id) => set({ selectedAgent: id }),
        }),
        {
            name: 'nexus-agents',
        }
    )
);
