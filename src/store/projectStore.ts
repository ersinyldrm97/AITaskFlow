import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Project } from '../types';

interface ProjectState {
  projects: Project[];
  isLoading: boolean;
  hasLoaded: boolean;
  fetchProjects: () => Promise<void>;
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'color'>) => Promise<void>;
  updateProject: (id: string, data: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  getProject: (id: string) => Project | undefined;
}

const projectColors = ['#6366f1', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4'];

export const useProjectStore = create<ProjectState>()((set, get) => ({
  projects: [],
  isLoading: false,
  hasLoaded: false,

  fetchProjects: async () => {
    if (get().isLoading) return;
    set({ isLoading: true });
    try {
      const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
      if (!error && data) {
        const formatted = data.map(d => ({
          id: d.id,
          name: d.name || 'İsimsiz Proje',
          description: d.description || '',
          status: d.status || 'active',
          startDate: d.start_date || new Date().toISOString(),
          endDate: d.end_date || new Date().toISOString(),
          teamId: d.team_id || null, // Defensive default
          color: d.color || '#6366f1',
          createdAt: d.created_at,
          userId: d.user_id || null, // Defensive default
        }));
        set({ projects: formatted, isLoading: false, hasLoaded: true });
      } else {
        set({ isLoading: false, hasLoaded: true });
      }
    } catch (e) {
      set({ isLoading: false, hasLoaded: true });
    }
  },

  addProject: async (project) => {
    const color = projectColors[Math.floor(Math.random() * projectColors.length)];
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;

    const { data, error } = await supabase.from('projects').insert([{
      name: project.name,
      description: project.description,
      status: project.status,
      start_date: project.startDate,
      end_date: project.endDate,
      color: color,
      user_id: userData.user.id,
    }]).select().single();

    if (!error && data) {
      const newProject: Project = {
        id: data.id,
        name: data.name,
        description: data.description,
        status: data.status,
        startDate: data.start_date,
        endDate: data.end_date,
        teamId: data.team_id,
        color: data.color,
        createdAt: data.created_at,
      };
      set((state) => ({ projects: [newProject, ...state.projects] }));
    }
  },

  updateProject: async (id, data) => {
    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.startDate !== undefined) updateData.start_date = data.startDate;
    if (data.endDate !== undefined) updateData.end_date = data.endDate;

    const { error } = await supabase.from('projects').update(updateData).eq('id', id);
    if (!error) {
      set((state) => ({
        projects: state.projects.map((p) => (p.id === id ? { ...p, ...data } : p)),
      }));
    }
  },

  deleteProject: async (id) => {
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (!error) {
      set((state) => ({ projects: state.projects.filter((p) => p.id !== id) }));
    }
  },

  getProject: (id) => get().projects.find((p) => p.id === id),
}));
