import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Resource, Personnel, Equipment, ResourceForecast, SupplyPlan, ResourceAllocation, ResourceRecycling } from "@/data/types";
import { initialResources, initialPersonnel, initialEquipment } from "@/data/mockData";
import { clamp } from "@/utils/formatters";

interface ResourceState {
  resources: Resource[];
  personnel: Personnel[];
  equipment: Equipment[];
  history: { tick: number; r1: number; r3: number; r5: number; r11: number }[];
  tickCount: number;
  supplyPlans: SupplyPlan[];
  allocations: ResourceAllocation[];
  recyclingSystems: ResourceRecycling[];
  updateSimulation: () => void;
  setPersonnelHealth: (id: string, health: Personnel["healthStatus"]) => void;
  resupplyResource: (id: string, amount: number) => void;
  repairEquipment: (id: string) => void;
  toggleEquipment: (id: string) => void;
  addSupplyPlan: (plan: Omit<SupplyPlan, "id">) => void;
  updateSupplyPlan: (id: string, updates: Partial<SupplyPlan>) => void;
  getForecasts: () => ResourceForecast[];
  getAllocations: () => ResourceAllocation[];
  getRecyclingEfficiency: () => number;
  resetAll: () => void;
}

const initialSupplyPlans: SupplyPlan[] = [
  {
    id: "supply-001",
    name: "定期补给 - Q3 2026",
    status: "in_transit",
    launchDate: "2026-06-01",
    arrivalDate: "2026-06-15",
    items: [
      { resourceId: "r1", resourceName: "食物", quantity: 5000, unit: "kg" },
      { resourceId: "r3", resourceName: "水", quantity: 3000, unit: "L" },
      { resourceId: "r5", resourceName: "医疗物资", quantity: 500, unit: "kg" },
    ],
    totalMass: 8500,
    priority: "high",
  },
  {
    id: "supply-002",
    name: "紧急补给 - 氧气",
    status: "planned",
    launchDate: "2026-06-20",
    arrivalDate: "2026-06-25",
    items: [
      { resourceId: "r11", resourceName: "氧气", quantity: 2000, unit: "kg" },
    ],
    totalMass: 2000,
    priority: "critical",
  },
];

const initialAllocations: ResourceAllocation[] = [
  { id: "alloc-1", systemName: "生命维持系统", resourceId: "r11", resourceName: "氧气", allocated: 100, used: 78, efficiency: 95 },
  { id: "alloc-2", systemName: "推进系统", resourceId: "r7", resourceName: "燃料", allocated: 100, used: 65, efficiency: 88 },
  { id: "alloc-3", systemName: "电力系统", resourceId: "r9", resourceName: "电池", allocated: 100, used: 45, efficiency: 92 },
  { id: "alloc-4", systemName: "水循环系统", resourceId: "r3", resourceName: "水", allocated: 100, used: 82, efficiency: 97 },
];

const initialRecyclingSystems: ResourceRecycling[] = [
  { id: "rec-1", type: "water", inputAmount: 100, outputAmount: 95, efficiency: 95, status: "active" },
  { id: "rec-2", type: "air", inputAmount: 100, outputAmount: 98, efficiency: 98, status: "active" },
  { id: "rec-3", type: "waste", inputAmount: 100, outputAmount: 30, efficiency: 30, status: "active" },
  { id: "rec-4", type: "energy", inputAmount: 100, outputAmount: 85, efficiency: 85, status: "active" },
];

export const useResourceStore = create<ResourceState>()(
  persist(
    (set, get) => ({
      resources: initialResources,
      personnel: initialPersonnel,
      equipment: initialEquipment,
      history: [],
      tickCount: 0,
      supplyPlans: initialSupplyPlans,
      allocations: initialAllocations,
      recyclingSystems: initialRecyclingSystems,

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

      addSupplyPlan: (plan) => {
        const newPlan: SupplyPlan = {
          ...plan,
          id: `supply-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        };
        set((state) => ({
          supplyPlans: [newPlan, ...state.supplyPlans],
        }));
      },

      updateSupplyPlan: (id, updates) =>
        set((state) => ({
          supplyPlans: state.supplyPlans.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        })),

      getForecasts: () => {
        const { resources } = get();
        return resources
          .filter((r) => r.consumptionRate > 0)
          .map((r) => {
            const daysUntilDepletion = r.quantity / (r.consumptionRate * 0.005 * 12 * 24);
            const projectedLevel = Math.max(0, r.quantity - r.consumptionRate * 30);
            const recommendedAction =
              daysUntilDepletion < 7 ? "resupply" :
              daysUntilDepletion < 14 ? "reduce" :
              daysUntilDepletion < 30 ? "monitor" : "none";
            return {
              resourceId: r.id,
              resourceName: r.name,
              currentLevel: r.quantity,
              projectedLevel,
              daysUntilDepletion: Math.round(daysUntilDepletion),
              recommendedAction,
              confidence: 0.85,
            };
          });
      },

      getAllocations: () => {
        const { allocations } = get();
        return allocations;
      },

      getRecyclingEfficiency: () => {
        const { recyclingSystems } = get();
        const activeSystems = recyclingSystems.filter((s) => s.status === "active");
        if (activeSystems.length === 0) return 0;
        return activeSystems.reduce((sum, s) => sum + s.efficiency, 0) / activeSystems.length;
      },

      resetAll: () => set({
        resources: initialResources,
        personnel: initialPersonnel,
        equipment: initialEquipment,
        history: [],
        tickCount: 0,
        supplyPlans: initialSupplyPlans,
        allocations: initialAllocations,
        recyclingSystems: initialRecyclingSystems,
      }),
    }),
    {
      name: "navigator-iss-resources",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        supplyPlans: state.supplyPlans,
        allocations: state.allocations,
        recyclingSystems: state.recyclingSystems,
      }),
    }
  )
);
