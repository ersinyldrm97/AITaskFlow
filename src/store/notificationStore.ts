import { create } from 'zustand';

export type NotificationType = 'success' | 'error' | 'info';

interface Notification {
  id: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
}

interface NotificationState {
  notifications: Notification[];
  notify: (message: string, type?: NotificationType) => void;
  removeNotification: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  notify: (message, type = 'success') => {
    const id = Math.random().toString(36).substring(7);
    const newNotification: Notification = {
      id,
      message,
      type,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    set((state) => ({
      notifications: [newNotification, ...state.notifications],
    }));
  },
  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },
  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
    }));
  },
  clearAll: () => {
    set({ notifications: [] });
  },
}));
