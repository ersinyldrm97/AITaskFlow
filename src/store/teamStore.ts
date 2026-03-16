import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { TeamMember } from '../types';

interface TeamState {
  members: TeamMember[];
  isLoading: boolean;
  hasLoaded: boolean;
  fetchMembers: () => Promise<void>;
  addMember: (member: Omit<TeamMember, 'id' | 'joinedAt'>) => Promise<void>;
  updateMember: (id: string, data: Partial<TeamMember>) => Promise<void>;
  deleteMember: (id: string) => Promise<void>;
  getMember: (id: string) => TeamMember | undefined;
}

export const useTeamStore = create<TeamState>()((set, get) => ({
  members: [],
  isLoading: false,
  hasLoaded: false,

  fetchMembers: async () => {
    const { currentWorkspace } = (await import('./authStore')).useAuthStore.getState();
    if (!currentWorkspace) return;

    set({ isLoading: true });
    
    // workspace_members üzerinden o workspace'e ait tüm üyeleri ve profillerini çek
    const { data, error } = await supabase
      .from('workspace_members')
      .select(`
        role,
        joined_at,
        profiles (
          id,
          name,
          avatar,
          created_at
        )
      `)
      .eq('workspace_id', currentWorkspace.id);
      
    if (!error && data) {
      const formatted: TeamMember[] = data.map((d: any) => ({
        id: d.profiles.id,
        name: d.profiles.name || 'İsimsiz Üye',
        email: 'gizli@taskflow.com', // E-posta gizliliği için
        role: d.role || 'Üye',
        department: 'Genel',
        workspaceId: currentWorkspace.id,
        avatar: d.profiles.avatar || 'U',
        joinedAt: d.joined_at || d.profiles.created_at,
      }));
      set({ members: formatted, isLoading: false, hasLoaded: true });
    } else {
      set({ isLoading: false, hasLoaded: true });
    }
  },

  addMember: async (member) => {
    alert('Gerçek veritabanı modunda, ekip üyeleri doğrudan uygulamaya kendi cihazlarından kayıt olmalıdır (Auth).');
  },

  updateMember: async (id, data) => {
    const { error } = await supabase.from('profiles').update({
      role: data.role,
      name: data.name
    }).eq('id', id);
    if (!error) {
      set((state) => ({
        members: state.members.map((m) => (m.id === id ? { ...m, ...data } : m)),
      }));
    }
  },

  deleteMember: async (id) => {
    alert('Bunu yapabilmek için Supabase tarafında admin yetkilerine ihtiyacınız var.');
  },

  getMember: (id) => get().members.find((m) => m.id === id),
}));
