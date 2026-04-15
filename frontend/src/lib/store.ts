import { create } from 'zustand';
import { supabase } from './supabase';
import type { LLMProvider } from './providers/types';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'user';
}

interface AuthState {
  user: User | null;
  loading: boolean;
  initialized: boolean;
  setUser: (user: User | null) => void;
  signOut: () => Promise<void>;
  initAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  initialized: false,
  setUser: (user) => set({ user, loading: false }),
  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null });
    // Redirect to signin page
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/signin';
    }
  },
  initAuth: async () => {
    try {
      // Get current session
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        // Fetch user profile from public.users
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          set({
            user: {
              id: profile.id,
              email: profile.email,
              full_name: profile.full_name,
              role: profile.role,
            },
            loading: false,
            initialized: true,
          });
        } else {
          set({ user: null, loading: false, initialized: true });
        }
      } else {
        set({ user: null, loading: false, initialized: true });
      }

      // Listen for auth changes
      supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const { data: profile } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profile) {
            set({
              user: {
                id: profile.id,
                email: profile.email,
                full_name: profile.full_name,
                role: profile.role,
              },
              loading: false,
            });
          }
        } else if (event === 'SIGNED_OUT') {
          set({ user: null, loading: false });
        }
      });
    } catch (error) {
      console.error('Auth init error:', error);
      set({ user: null, loading: false, initialized: true });
    }
  },
}));

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  model?: string;
  provider?: LLMProvider;
}

interface AppState {
  messages: ChatMessage[];
  addMessage: (message: ChatMessage) => void;
  clearMessages: () => void;
  isSidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  messages: [
    { id: '1', role: 'assistant', content: 'Hello! I am NEXUS. How can I help you today?', timestamp: 1709654400000 }
  ],
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  clearMessages: () => set({ messages: [] }),
  isSidebarOpen: true,
  setSidebarOpen: (open) => set({ isSidebarOpen: open }),
}));
