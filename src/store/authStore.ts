import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { User } from '../types';

interface AuthState {
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ error: Error | null }>;
  register: (name: string, email: string, password: string) => Promise<{ error: Error | null }>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<{ error: Error | null }>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  currentUser: null,
  isAuthenticated: false,
  isLoading: true,

  initialize: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
      
      const user: User = {
        id: session.user.id,
        name: profile?.name || session.user.user_metadata?.name || '',
        email: session.user.email || '',
        password: '',
        role: profile?.role || 'Member',
        avatar: profile?.avatar || 'U',
        createdAt: profile?.created_at || session.user.created_at,
      };
      set({ currentUser: user, isAuthenticated: true, isLoading: false });
    } else {
      set({ currentUser: null, isAuthenticated: false, isLoading: false });
    }

    supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        // If email confirmation is required but not done, sign out
        if (!session.user.email_confirmed_at) {
          await supabase.auth.signOut();
          set({ currentUser: null, isAuthenticated: false, isLoading: false });
          return;
        }

        if (event === 'SIGNED_IN') {
          await new Promise(resolve => setTimeout(resolve, 500)); 
        }
        
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
        
        const user: User = {
          id: session.user.id,
          name: profile?.name || session.user.user_metadata?.name || '',
          email: session.user.email || '',
          password: '',
          role: profile?.role || 'Member',
          avatar: profile?.avatar || 'U',
          createdAt: profile?.created_at || session.user.created_at,
        };
        set({ currentUser: user, isAuthenticated: true, isLoading: false });
      } else {
        set({ currentUser: null, isAuthenticated: false, isLoading: false });
      }
    });
  },

  login: async (email, password) => {
    set({ currentUser: null, isAuthenticated: false });
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) return { error };

    if (data.user && !data.user.email_confirmed_at) {
      await supabase.auth.signOut();
      return { error: new Error('Email not confirmed') };
    }

    // Double check if profile exists (meaning user is not deleted at app-level)
    const { data: profile, error: profileCheckError } = await supabase.from('profiles').select('id').eq('id', data.user.id).single();
    if (profileCheckError && profileCheckError.code === 'PGRST116') {
      await supabase.auth.signOut();
      return { error: new Error('User record not found or deleted') };
    }
    
    return { error: null };
  },

  register: async (name, email, password) => {
    set({ currentUser: null, isAuthenticated: false }); // Clear state before register
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        }
      }
    });
    return { error };
  },

  logout: async () => {
    set({ currentUser: null, isAuthenticated: false }); // Clear state immediately
    await supabase.auth.signOut();
  },

  updateProfile: async (data) => {
    const currentUser = get().currentUser;
    if (!currentUser) return { error: new Error('Oturum açmadınız') };
    
    const { error } = await supabase.from('profiles').update({
      name: data.name,
      avatar: data.avatar,
    }).eq('id', currentUser.id);

    if (!error) {
      set({ currentUser: { ...currentUser, ...data } });
    }
    return { error };
  },
}));
