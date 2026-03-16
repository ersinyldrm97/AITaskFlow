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
    set({ isLoading: true });
    const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    if (!error && data) {
      const formatted = data.map(d => ({
        id: d.id,
        name: d.name,
        email: 'gizli@taskflow.com', // Email is separated in auth context in Supabase by default
        role: d.role || 'Üye',
        department: 'Genel',
        avatar: d.avatar || 'U',
        joinedAt: d.created_at,
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
