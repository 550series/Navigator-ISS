import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { AlertDetail } from "@/data/types";

interface AlertState {
  alerts: AlertDetail[];
  filter: {
    level: string[];
    category: string[];
    status: string[];
  };
  addAlert: (alert: Omit<AlertDetail, "id" | "timestamp" | "acknowledged">) => void;
  acknowledgeAlert: (id: string, handler?: string) => void;
  resolveAlert: (id: string, resolution: string) => void;
  setFilter: (filter: Partial<AlertState["filter"]>) => void;
  clearResolved: () => void;
  getFilteredAlerts: () => AlertDetail[];
  getStats: () => {
    total: number;
    unacknowledged: number;
    critical: number;
    warning: number;
    info: number;
    resolved: number;
  };
}

const initialAlerts: AlertDetail[] = [
  {
    id: "alert-001",
    level: "warning",
    source: "能源系统",
    message: "反应堆输出功率波动异常，建议检查燃料棒状态",
    timestamp: "2026-06-06 08:15",
    acknowledged: false,
    category: "system",
    relatedEquipment: ["reactor-001"],
  },
  {
    id: "alert-002",
    level: "critical",
    source: "生命维持",
    message: "B区氧气过滤器效率下降至78%，需要更换",
    timestamp: "2026-06-06 07:30",
    acknowledged: false,
    category: "equipment",
    relatedEquipment: ["filter-002"],
  },
  {
    id: "alert-003",
    level: "info",
    source: "通信系统",
    message: "地球通信链路延迟增加至2.3秒，太阳活动影响",
    timestamp: "2026-06-06 06:45",
    acknowledged: true,
    category: "system",
    handler: "张伟",
  },
  {
    id: "alert-004",
    level: "warning",
    source: "舱室监控",
    message: "实验室温度升高至28.5°C，超出正常范围",
    timestamp: "2026-06-06 09:00",
    acknowledged: false,
    category: "environment",
  },
  {
    id: "alert-005",
    level: "critical",
    source: "推进系统",
    message: "离子推进器#3出现点火延迟，需要立即检查",
    timestamp: "2026-06-06 05:20",
    acknowledged: true,
    category: "equipment",
    handler: "刘洋",
    relatedEquipment: ["ion-003"],
  },
];

export const useAlertStore = create<AlertState>()(
  persist(
    (set, get) => ({
      alerts: initialAlerts,
      filter: {
        level: [],
        category: [],
        status: [],
      },

      addAlert: (alert) => {
        const now = new Date();
        const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
        const newAlert: AlertDetail = {
          ...alert,
          id: `alert-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          timestamp,
          acknowledged: false,
        };
        set((state) => ({
          alerts: [newAlert, ...state.alerts].slice(0, 100),
        }));
      },

      acknowledgeAlert: (id, handler) => {
        set((state) => ({
          alerts: state.alerts.map((a) =>
            a.id === id
              ? { ...a, acknowledged: true, handler: handler || "系统管理员" }
              : a
          ),
        }));
      },

      resolveAlert: (id, resolution) => {
        const now = new Date();
        const resolvedAt = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
        set((state) => ({
          alerts: state.alerts.map((a) =>
            a.id === id
              ? { ...a, resolvedAt, resolution }
              : a
          ),
        }));
      },

      setFilter: (filter) => {
        set((state) => ({
          filter: { ...state.filter, ...filter },
        }));
      },

      clearResolved: () => {
        set((state) => ({
          alerts: state.alerts.filter((a) => !a.resolvedAt),
        }));
      },

      getFilteredAlerts: () => {
        const { alerts, filter } = get();
        return alerts.filter((alert) => {
          if (filter.level.length > 0 && !filter.level.includes(alert.level)) return false;
          if (filter.category.length > 0 && !filter.category.includes(alert.category)) return false;
          if (filter.status.length > 0) {
            if (filter.status.includes("unacknowledged") && alert.acknowledged) return false;
            if (filter.status.includes("acknowledged") && !alert.acknowledged) return false;
            if (filter.status.includes("resolved") && !alert.resolvedAt) return false;
            if (filter.status.includes("unresolved") && alert.resolvedAt) return false;
          }
          return true;
        });
      },

      getStats: () => {
        const { alerts } = get();
        return {
          total: alerts.length,
          unacknowledged: alerts.filter((a) => !a.acknowledged).length,
          critical: alerts.filter((a) => a.level === "critical").length,
          warning: alerts.filter((a) => a.level === "warning").length,
          info: alerts.filter((a) => a.level === "info").length,
          resolved: alerts.filter((a) => a.resolvedAt).length,
        };
      },
    }),
    {
      name: "navigator-iss-alerts",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        alerts: state.alerts,
        filter: state.filter,
      }),
    }
  )
);
