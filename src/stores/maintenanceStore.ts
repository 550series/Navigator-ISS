import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { MaintenanceRecord, SparePart } from "@/data/types";

interface MaintenanceState {
  records: MaintenanceRecord[];
  spareParts: SparePart[];
  addRecord: (record: Omit<MaintenanceRecord, "id">) => void;
  updateRecord: (id: string, updates: Partial<MaintenanceRecord>) => void;
  completeRecord: (id: string, notes: string) => void;
  addSparePart: (part: Omit<SparePart, "id">) => void;
  updateSparePart: (id: string, updates: Partial<SparePart>) => void;
  useSparePart: (id: string, quantity: number) => boolean;
  getStats: () => {
    totalRecords: number;
    scheduled: number;
    inProgress: number;
    completed: number;
    overdue: number;
    lowStockParts: number;
  };
}

const initialRecords: MaintenanceRecord[] = [
  {
    id: "maint-001",
    equipmentId: "reactor-001",
    equipmentName: "主反应堆",
    type: "preventive",
    status: "scheduled",
    priority: "high",
    assignee: "刘洋",
    scheduledDate: "2026-06-10",
    description: "反应堆冷却系统季度检查，更换冷却液",
    partsUsed: [],
    notes: [],
  },
  {
    id: "maint-002",
    equipmentId: "filter-002",
    equipmentName: "B区氧气过滤器",
    type: "corrective",
    status: "in_progress",
    priority: "critical",
    assignee: "张伟",
    scheduledDate: "2026-06-06",
    description: "过滤器效率下降，需要更换滤芯",
    partsUsed: [{ partId: "part-001", partName: "氧气滤芯", quantity: 1 }],
    notes: ["已拆卸旧滤芯", "正在安装新滤芯"],
  },
  {
    id: "maint-003",
    equipmentId: "solar-panel-003",
    equipmentName: "太阳能面板阵列C",
    type: "preventive",
    status: "completed",
    priority: "medium",
    assignee: "王磊",
    scheduledDate: "2026-06-05",
    completedDate: "2026-06-05",
    description: "清洁太阳能面板，检查连接线路",
    partsUsed: [],
    notes: ["已完成清洁", "所有连接正常"],
  },
  {
    id: "maint-004",
    equipmentId: "ion-003",
    equipmentName: "离子推进器#3",
    type: "emergency",
    status: "scheduled",
    priority: "critical",
    assignee: "刘洋",
    scheduledDate: "2026-06-07",
    description: "点火延迟问题，需要检查电极和推进剂供应",
    partsUsed: [],
    notes: [],
  },
];

const initialSpareParts: SparePart[] = [
  {
    id: "part-001",
    name: "氧气滤芯",
    category: "生命维持",
    quantity: 8,
    minStock: 4,
    location: "C区仓库",
    lastRestocked: "2026-05-15",
  },
  {
    id: "part-002",
    name: "冷却液",
    category: "能源系统",
    quantity: 120,
    minStock: 50,
    location: "A区仓库",
    lastRestocked: "2026-05-20",
  },
  {
    id: "part-003",
    name: "离子电极",
    category: "推进系统",
    quantity: 6,
    minStock: 2,
    location: "D区仓库",
    lastRestocked: "2026-04-30",
  },
  {
    id: "part-004",
    name: "密封垫圈",
    category: "舱室维护",
    quantity: 50,
    minStock: 20,
    location: "B区仓库",
    lastRestocked: "2026-05-10",
  },
  {
    id: "part-005",
    name: "电路板",
    category: "电子设备",
    quantity: 3,
    minStock: 5,
    location: "A区仓库",
    lastRestocked: "2026-04-15",
  },
];

export const useMaintenanceStore = create<MaintenanceState>()(
  persist(
    (set, get) => ({
      records: initialRecords,
      spareParts: initialSpareParts,

      addRecord: (record) => {
        const newRecord: MaintenanceRecord = {
          ...record,
          id: `maint-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        };
        set((state) => ({
          records: [newRecord, ...state.records],
        }));
      },

      updateRecord: (id, updates) => {
        set((state) => ({
          records: state.records.map((r) =>
            r.id === id ? { ...r, ...updates } : r
          ),
        }));
      },

      completeRecord: (id, notes) => {
        const now = new Date();
        const completedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
        set((state) => ({
          records: state.records.map((r) =>
            r.id === id
              ? { ...r, status: "completed" as const, completedDate, notes: [...r.notes, notes] }
              : r
          ),
        }));
      },

      addSparePart: (part) => {
        const newPart: SparePart = {
          ...part,
          id: `part-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        };
        set((state) => ({
          spareParts: [newPart, ...state.spareParts],
        }));
      },

      updateSparePart: (id, updates) => {
        set((state) => ({
          spareParts: state.spareParts.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        }));
      },

      useSparePart: (id, quantity) => {
        const part = get().spareParts.find((p) => p.id === id);
        if (!part || part.quantity < quantity) return false;
        set((state) => ({
          spareParts: state.spareParts.map((p) =>
            p.id === id ? { ...p, quantity: p.quantity - quantity } : p
          ),
        }));
        return true;
      },

      getStats: () => {
        const { records, spareParts } = get();
        return {
          totalRecords: records.length,
          scheduled: records.filter((r) => r.status === "scheduled").length,
          inProgress: records.filter((r) => r.status === "in_progress").length,
          completed: records.filter((r) => r.status === "completed").length,
          overdue: records.filter((r) => r.status === "overdue").length,
          lowStockParts: spareParts.filter((p) => p.quantity <= p.minStock).length,
        };
      },
    }),
    {
      name: "navigator-iss-maintenance",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        records: state.records,
        spareParts: state.spareParts,
      }),
    }
  )
);
