import { create } from "zustand";
import type { Communication, CommLink } from "@/data/types";
import { initialCommunications, initialCommLinks } from "@/data/mockData";
import { addFluctuation, clamp } from "@/utils/formatters";

interface CommState {
  commLinks: CommLink[];
  communications: Communication[];
  updateSimulation: () => void;
}

/** 通信系统 Store */
export const useCommStore = create<CommState>((set) => ({
  commLinks: initialCommLinks,
  communications: initialCommunications,

  updateSimulation: () =>
    set((state) => ({
      commLinks: state.commLinks.map((link) => ({
        ...link,
        signalStrength: clamp(addFluctuation(link.signalStrength, 3), 20, 100),
        latency: clamp(addFluctuation(link.latency, 0.1), 0.5, 10),
        status: link.signalStrength > 70 ? "connected" : link.signalStrength > 50 ? "degraded" : "offline",
      })),
    })),
}));
