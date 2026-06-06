import { create } from "zustand";

export type NotificationType = "success" | "error" | "warning" | "info";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
  timestamp: number;
}

interface NotificationState {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, "id" | "timestamp">) => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

export const useNotificationStore = create<NotificationState>()((set) => ({
  notifications: [],

  addNotification: (notification) => {
    const id = `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const newNotification: Notification = {
      ...notification,
      id,
      timestamp: Date.now(),
      duration: notification.duration ?? 3000,
    };

    set((state) => ({
      notifications: [newNotification, ...state.notifications].slice(0, 5),
    }));

    if (newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }));
      }, newNotification.duration);
    }
  },

  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },

  clearAll: () => set({ notifications: [] }),
}));

export function useNotification() {
  const { addNotification } = useNotificationStore();

  const notify = {
    success: (title: string, message?: string) =>
      addNotification({ type: "success", title, message }),
    error: (title: string, message?: string) =>
      addNotification({ type: "error", title, message, duration: 5000 }),
    warning: (title: string, message?: string) =>
      addNotification({ type: "warning", title, message }),
    info: (title: string, message?: string) =>
      addNotification({ type: "info", title, message }),
  };

  return notify;
}
