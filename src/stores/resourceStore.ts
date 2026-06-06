import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Resource, Personnel, Equipment } from "@/data/types";
import { initialResources, initialPersonnel, initialEquipment } from "@/data/mockData";
import { clamp } from "@/utils/formatters";

interface ResourceState {
  resources: Resource[];
  personnel: Personnel[];
  equipment: Equipment[];
  /** 24h 资源消耗采样（最近 24 个 tick，2 分钟采集一次），用于趋势图 */
  history: { tick: number; r1: number; r3: number; r5: number; r11: number }[];
  tickCount: number;
  updateSimulation: () => void;
  /** 调整船员健康状态（事件影响） */
  setPersonnelHealth: (id: string, health: Personnel["healthStatus"]) => void;
  /** 物资补给：增加指定物资的数量 */
  resupplyResource: (id: string, amount: number) => void;
  /** 设备维护：将设备恢复为运行状态 */
  repairEquipment: (id: string) => void;
  /** 设备启停：切换设备在线/离线状态 */
  toggleEquipment: (id: string) => void;
  /** 重置所有数据到初始状态 */
  resetAll: () => void;
}

/** 资源管理 Store */
export const useResourceStore = create<ResourceState>()(
  persist(
    (set) => ({
      resources: initialResources,
      personnel: initialPersonnel,
      equipment: initialEquipment,
      history: [],
      tickCount: 0,

      updateSimulation: () =>
        set((state) => {
          const newTick = state.tickCount + 1;
          const resources = state.resources.map((r) => {
            const consumed = r.consumptionRate > 0 ? r.consumptionRate * 0.005 : 0;
            const noise = (Math.random() - 0.5) * consumed * 0.2;
            const quantity = clamp(r.quantity - consumed + noise, 0, r.capacity);
            const ratio = quantity / r.capacity;
            const alertLevel: Resource["alertLevel"] =
              ratio < 0.2 ? "critical" : ratio < 0.4 ? "low" : "normal";
            return { ...r, quantity, alertLevel };
          });

          const newHistory = newTick % 20 === 0
            ? [
                ...state.history.slice(-23),
                {
                  tick: newTick,
                  r1: resources[0]?.quantity ?? 0,
                  r3: resources[2]?.quantity ?? 0,
                  r5: resources[4]?.quantity ?? 0,
                  r11: resources[10]?.quantity ?? 0,
                },
              ]
            : state.history;

          return { resources, history: newHistory, tickCount: newTick };
        }),

      setPersonnelHealth: (id, health) =>
        set((state) => ({
          personnel: state.personnel.map((p) => (p.id === id ? { ...p, healthStatus: health } : p)),
        })),

      resupplyResource: (id, amount) =>
        set((state) => ({
          resources: state.resources.map((r) =>
            r.id === id
              ? { ...r, quantity: clamp(r.quantity + amount, 0, r.capacity) }
              : r
          ),
        })),

      repairEquipment: (id) =>
        set((state) => ({
          equipment: state.equipment.map((e) =>
            e.id === id
              ? { ...e, status: "operational" as const, runtime: 0 }
              : e
          ),
        })),

      toggleEquipment: (id) =>
        set((state) => ({
          equipment: state.equipment.map((e) =>
            e.id === id
              ? { ...e, status: e.status === "operational" ? ("offline" as const) : ("operational" as const) }
              : e
          ),
        })),

      resetAll: () => set({
        resources: initialResources,
        personnel: initialPersonnel,
        equipment: initialEquipment,
        history: [],
        tickCount: 0,
      }),
    }),
    {
      name: "navigator-iss-resources",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
