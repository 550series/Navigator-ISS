import { create } from "zustand";
import type { Mission } from "@/data/types";
import { initialMissions } from "@/data/mockData";

interface MissionState {
  missions: Mission[];
  updateSimulation: () => void;
}

/** 任务管理 Store */
export const useMissionStore = create<MissionState>((set) => ({
  missions: initialMissions,

  updateSimulation: () =>
    set((state) => ({
      missions: state.missions.map((m) => {
        if (m.status !== "in_progress") return m;
        const newProgress = Math.min(100, m.progress + Math.random() * 0.5);
        const updatedSubtasks = m.subtasks.map((s, i) => {
          if (s.completed) return s;
          const taskThreshold = ((i + 1) / m.subtasks.length) * 100;
          return newProgress >= taskThreshold ? { ...s, completed: true } : s;
        });
        return {
          ...m,
          progress: newProgress,
          subtasks: updatedSubtasks,
          status: newProgress >= 100 ? "completed" as const : "in_progress" as const,
        };
      }),
    })),
}));
