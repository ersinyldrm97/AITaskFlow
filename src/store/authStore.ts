import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { User, Workspace } from '../types';

interface AuthState {
  currentUser: User | null;
  currentWorkspace: Workspace | null;
  workspaces: Workspace[];
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ error: Error | null }>;
  register: (name: string, email: string, password: string) => Promise<{ error: Error | null }>;
  signInWithSocial: (provider: 'google' | 'github') => Promise<{ error: Error | null }>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<{ error: Error | null }>;
  initialize: () => Promise<void>;
  createWorkspace: (name: string) => Promise<{ workspace: Workspace | null, error: Error | null }>;
  setWorkspace: (workspace: Workspace) => void;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  currentUser: null,
  currentWorkspace: null,
  workspaces: [],
  isAuthenticated: false,
  isLoading: true,

  initialize: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
        
        // Workspace'leri getir
        const { data: memberData } = await supabase
          .from('workspace_members')
          .select('workspace_id, workspaces(*)')
          .eq('user_id', session.user.id);

        const workspaces = memberData?.map(m => m.workspaces as any as Workspace) || [];
        const activeWorkspaceId = profile?.workspace_id || workspaces[0]?.id;
        const currentWorkspace = workspaces.find(w => w.id === activeWorkspaceId) || null;

        const user: User = {
          id: session.user.id,
          name: profile?.name || session.user.user_metadata?.name || '',
          email: session.user.email || '',
          password: '',
          role: profile?.role || 'Member',
          plan: profile?.plan || 'free',
          subscriptionStatus: profile?.subscription_status,
          avatar: profile?.avatar || 'U',
          createdAt: profile?.created_at || session.user.created_at,
          workspaceId: activeWorkspaceId,
        };
        set({ currentUser: user, workspaces, currentWorkspace, isAuthenticated: true, isLoading: false });
      } else {
        set({ currentUser: null, workspaces: [], currentWorkspace: null, isAuthenticated: false, isLoading: false });
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
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
          plan: profile?.plan || 'free',
          subscriptionStatus: profile?.subscription_status,
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
        emailRedirectTo: window.location.origin + '/dashboard',
        data: {
          name,
        }
      }
    });
    return { error };
  },

  signInWithSocial: async (provider) => {
    set({ currentUser: null, isAuthenticated: false });
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: window.location.origin + '/dashboard'
      }
    });
    return { error };
  },

  logout: async () => {
    set({ currentUser: null, workspaces: [], currentWorkspace: null, isAuthenticated: false });
    await supabase.auth.signOut();
  },

  updateProfile: async (data) => {
    const currentUser = get().currentUser;
    if (!currentUser) return { error: new Error('Oturum açmadınız') };
    
    // Yalnızca profilde mevcut olan alanları güncelle
    const { error } = await supabase.from('profiles').update(data).eq('id', currentUser.id);

    if (!error) {
      set({ currentUser: { ...currentUser, ...data } });
    }
    return { error };
  },

  createWorkspace: async (name) => {
    const user = get().currentUser;
    if (!user) return { workspace: null, error: new Error('User not auth') };

    const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    
    // Create workspace
    const { data: ws, error: wsError } = await supabase
      .from('workspaces')
      .insert([{ name, slug, owner_id: user.id }])
      .select()
      .single();

    if (wsError) return { workspace: null, error: wsError };

    // Add user as admin member
    const { error: memError } = await supabase
      .from('workspace_members')
      .insert([{ workspace_id: ws.id, user_id: user.id, role: 'admin' }]);

    if (memError) return { workspace: null, error: memError };

    // Update user's profile with the new workspace ID
    const { error: profError } = await supabase
      .from('profiles')
      .update({ workspace_id: ws.id })
      .eq('id', user.id);

    if (profError) console.error('Error updating profile workspace:', profError);

    const newWs: Workspace = {
      id: ws.id,
      name: ws.name,
      slug: ws.slug,
      ownerId: ws.owner_id,
      createdAt: ws.created_at
    };

    set(state => ({ 
      workspaces: [...state.workspaces, newWs],
      currentWorkspace: state.currentWorkspace || newWs,
      currentUser: state.currentUser ? { ...state.currentUser, workspaceId: ws.id } : null
    }));

    return { workspace: newWs, error: null };
  },

  setWorkspace: (workspace) => {
    set({ currentWorkspace: workspace });
    // Profil güncellemesi de yapılabilir
    const user = get().currentUser;
    if (user) {
      supabase.from('profiles').update({ workspace_id: workspace.id }).eq('id', user.id);
      set({ currentUser: { ...user, workspaceId: workspace.id }});
    }
  },
}));
