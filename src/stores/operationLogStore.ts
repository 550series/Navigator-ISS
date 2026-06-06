import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { OperationLog } from "@/data/types";

interface OperationLogState {
  logs: OperationLog[];
  addLog: (log: Omit<OperationLog, "id" | "timestamp">) => void;
  clearLogs: () => void;
  getStats: () => {
    total: number;
    success: number;
    failure: number;
    pending: number;
    todayCount: number;
  };
}

function getTimestamp(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
}

const initialLogs: OperationLog[] = [
  {
    id: "log-001",
    timestamp: "2026-06-06 09:15:00",
    userId: "user-001",
    userName: "张伟",
    action: "确认告警",
    target: "能源系统 - 反应堆输出功率波动",
    details: "确认告警并安排检查",
    result: "success",
  },
  {
    id: "log-002",
    timestamp: "2026-06-06 08:45:00",
    userId: "user-002",
    userName: "刘洋",
    action: "开始维修",
    target: "B区氧气过滤器",
    details: "开始更换过滤器滤芯",
    result: "success",
  },
  {
    id: "log-003",
    timestamp: "2026-06-06 08:00:00",
    userId: "user-003",
    userName: "系统",
    action: "自动巡检",
    target: "全站系统",
    details: "执行每日自动巡检，发现2项异常",
    result: "success",
  },
  {
    id: "log-004",
    timestamp: "2026-06-06 07:30:00",
    userId: "user-004",
    userName: "王磊",
    action: "参数调整",
    target: "推进系统 - 主推力",
    details: "将主推力目标从60%调整至65%",
    result: "success",
  },
  {
    id: "log-005",
    timestamp: "2026-06-06 06:15:00",
    userId: "user-005",
    userName: "陈博士",
    action: "实验数据记录",
    target: "微重力植物生长实验",
    details: "记录第三批植物生长数据",
    result: "success",
  },
  {
    id: "log-006",
    timestamp: "2026-06-05 22:00:00",
    userId: "user-001",
    userName: "张伟",
    action: "系统重置",
    target: "通信系统",
    details: "重置通信链路以恢复连接",
    result: "success",
  },
  {
    id: "log-007",
    timestamp: "2026-06-05 18:30:00",
    userId: "user-006",
    userName: "赵明",
    action: "资源调配",
    target: "物资 - 冷却液",
    details: "从C区调配20L冷却液至A区仓库",
    result: "success",
  },
  {
    id: "log-008",
    timestamp: "2026-06-05 14:00:00",
    userId: "user-002",
    userName: "刘洋",
    action: "应急演练",
    target: "舱室失压应急处置",
    details: "组织4人进行失压应急演练",
    result: "success",
  },
];

export const useOperationLogStore = create<OperationLogState>()(
  persist(
    (set, get) => ({
      logs: initialLogs,

      addLog: (log) => {
        const newLog: OperationLog = {
          ...log,
          id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          timestamp: getTimestamp(),
        };
        set((state) => ({
          logs: [newLog, ...state.logs].slice(0, 200),
        }));
      },

      clearLogs: () => set({ logs: [] }),

      getStats: () => {
        const { logs } = get();
        const today = new Date().toISOString().split("T")[0];
        return {
          total: logs.length,
          success: logs.filter((l) => l.result === "success").length,
          failure: logs.filter((l) => l.result === "failure").length,
          pending: logs.filter((l) => l.result === "pending").length,
          todayCount: logs.filter((l) => l.timestamp.startsWith(today)).length,
        };
      },
    }),
    {
      name: "navigator-iss-operation-log",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ logs: state.logs }),
    }
  )
);
