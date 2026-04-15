import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { LLMProvider, ProviderConfig, LLMModel } from './types';

const ONLY_PROVIDER: LLMProvider = 'openrouter';

interface ProviderState {
    providers: Record<LLMProvider, ProviderConfig>;
    selectedProvider: LLMProvider | null;
    selectedModel: string | null;

    setProviderConfig: (provider: LLMProvider, config: Partial<ProviderConfig>) => void;
    getProviderConfig: (provider: LLMProvider) => ProviderConfig | null;
    deleteProvider: (provider: LLMProvider) => void;
    setSelectedProvider: (provider: LLMProvider | null) => void;
    setSelectedModel: (model: string | null) => void;
    getEnabledProviders: () => ProviderConfig[];
}

export const useProviderStore = create<ProviderState>()(
    persist(
        (set, get) => ({
            providers: {} as Record<LLMProvider, ProviderConfig>,
            selectedProvider: ONLY_PROVIDER,
            selectedModel: null,

            setProviderConfig: (provider, config) =>
                provider !== ONLY_PROVIDER
                    ? undefined
                    :
                set((state) => ({
                    providers: {
                        ...state.providers,
                        [provider]: {
                            provider,
                            apiKey: config.apiKey ?? state.providers[provider]?.apiKey ?? '',
                            baseURL: config.baseURL ?? state.providers[provider]?.baseURL,
                            enabled: config.enabled ?? state.providers[provider]?.enabled ?? true,
                        },
                    },
                })),

            getProviderConfig: (provider) => {
                if (provider !== ONLY_PROVIDER) return null;
                const config = get().providers[provider];
                return config ?? null;
            },

            deleteProvider: (provider) =>
                set((state) => {
                    const newProviders = { ...state.providers };
                    delete newProviders[provider];
                    return { providers: newProviders };
                }),

            setSelectedProvider: () => set({ selectedProvider: ONLY_PROVIDER }),

            setSelectedModel: (model) => set({ selectedModel: model }),

            getEnabledProviders: () => {
                const providers = get().providers;
                return Object.values(providers).filter((p) => p.enabled && p.provider === ONLY_PROVIDER);
            },
        }),
        {
            name: 'nexus-providers',
            // NEVER persist API keys to localStorage — they live in the database only.
            // Only save UI-level prefs (which provider/model was selected).
            partialize: (state) => ({
                selectedProvider: state.selectedProvider,
                selectedModel: state.selectedModel,
            }),
        }
    )
);
