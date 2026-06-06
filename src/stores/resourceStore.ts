import { create } from "zustand";
import type { Resource, Personnel, Equipment } from "@/data/types";
import { initialResources, initialPersonnel, initialEquipment } from "@/data/mockData";
import { addFluctuation, clamp } from "@/utils/formatters";

interface ResourceState {
  resources: Resource[];
  personnel: Personnel[];
  equipment: Equipment[];
  updateSimulation: () => void;
}

/** 资源管理 Store */
export const useResourceStore = create<ResourceState>((set) => ({
  resources: initialResources,
  personnel: initialPersonnel,
  equipment: initialEquipment,

  updateSimulation: () =>
    set((state) => ({
      resources: state.resources.map((r) => ({
        ...r,
        quantity: clamp(addFluctuation(r.quantity, r.consumptionRate * 0.01), 0, r.capacity),
        alertLevel: r.quantity / r.capacity < 0.2 ? "critical" : r.quantity / r.capacity < 0.4 ? "low" : "normal",
      })),
    })),
}));
