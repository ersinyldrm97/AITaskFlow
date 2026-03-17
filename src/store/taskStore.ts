import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Task } from '../types';

interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  hasLoaded: boolean;
  fetchTasks: () => Promise<void>;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'workspaceId'>) => Promise<void>;
  updateTask: (id: string, data: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  getTasksByProject: (projectId: string) => Task[];
}

export const useTaskStore = create<TaskState>()((set, get) => ({
  tasks: [],
  isLoading: false,
  hasLoaded: false,

  fetchTasks: async () => {
    const { currentWorkspace } = (await import('./authStore')).useAuthStore.getState();
    if (!currentWorkspace) return;

    if (get().isLoading) return;
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('workspace_id', currentWorkspace.id)
        .order('created_at', { ascending: false });
        
      if (!error && data) {
        const formatted: Task[] = data.map(d => ({
          id: d.id,
          title: d.title || 'Başlıksız Görev',
          description: d.description || '',
          status: d.status || 'todo',
          priority: d.priority || 'medium',
          dueDate: d.due_date || new Date().toISOString().split('T')[0],
          projectId: d.project_id,
          workspaceId: d.workspace_id,
          assigneeId: d.assignee_id,
          createdAt: d.created_at,
        }));
        set({ tasks: formatted, isLoading: false, hasLoaded: true });
      } else {
        set({ isLoading: false, hasLoaded: true });
      }
    } catch (e) {
      set({ isLoading: false, hasLoaded: true });
    }
  },

  addTask: async (task) => {
    const { currentWorkspace } = (await import('./authStore')).useAuthStore.getState();
    if (!currentWorkspace) return;

    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;

    const { data, error } = await supabase.from('tasks').insert([{
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      due_date: task.dueDate,
      project_id: task.projectId,
      assignee_id: task.assigneeId === '' ? null : task.assigneeId,
      user_id: userData.user.id,
      workspace_id: currentWorkspace.id
    }]).select().single();

    if (!error && data) {
      const newTask: Task = {
        id: data.id,
        title: data.title,
        description: data.description,
        status: data.status,
        priority: data.priority,
        dueDate: data.due_date,
        projectId: data.project_id,
        workspaceId: data.workspace_id,
        assigneeId: data.assignee_id,
        createdAt: data.created_at,
      };
      set((state) => ({ tasks: [newTask, ...state.tasks] }));
    }
  },

  updateTask: async (id, data) => {
    const updateData: any = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.priority !== undefined) updateData.priority = data.priority;
    if (data.dueDate !== undefined) updateData.due_date = data.dueDate;
    if (data.assigneeId !== undefined) updateData.assignee_id = data.assigneeId === '' ? null : data.assigneeId;

    const { error } = await supabase.from('tasks').update(updateData).eq('id', id);
    if (!error) {
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...data } : t)),
      }));
    }
  },

  deleteTask: async (id) => {
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (!error) {
      set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) }));
    }
  },

  getTasksByProject: (projectId) => get().tasks.filter((t) => t.projectId === projectId),
}));
