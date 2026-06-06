import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Mission } from "@/data/types";
import { initialMissions } from "@/data/mockData";

interface MissionState {
  missions: Mission[];
  /** 用户手动触碰过的任务 ID 集合，updateSimulation 跳过这些 */
  userTouched: string[];
  updateSimulation: () => void;
  /** 切换子任务完成状态 */
  toggleSubtask: (missionId: string, subtaskIndex: number) => void;
  /** 调整任务状态（执行中/计划中/已完成） */
  setMissionStatus: (missionId: string, status: Mission["status"]) => void;
  /** 重置到初始数据 */
  resetMissions: () => void;
}

/** 任务管理 Store */
export const useMissionStore = create<MissionState>()(
  persist(
    (set) => ({
      missions: initialMissions,
      userTouched: [],

      updateSimulation: () =>
        set((state) => {
          const touched = new Set(state.userTouched);
          return {
            missions: state.missions.map((m) => {
              if (m.status !== "in_progress" || touched.has(m.id)) return m;
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
                status: newProgress >= 100 ? ("completed" as const) : ("in_progress" as const),
              };
            }),
          };
        }),

      toggleSubtask: (missionId, subtaskIndex) =>
        set((state) => ({
          userTouched: state.userTouched.includes(missionId)
            ? state.userTouched
            : [...state.userTouched, missionId],
          missions: state.missions.map((m) => {
            if (m.id !== missionId) return m;
            const subtasks = m.subtasks.map((s, i) =>
              i === subtaskIndex ? { ...s, completed: !s.completed } : s
            );
            const completedCount = subtasks.filter((s) => s.completed).length;
            const progress = Math.round((completedCount / subtasks.length) * 100);
            const status: Mission["status"] =
              progress === 100 ? "completed" : progress === 0 ? "planned" : "in_progress";
            return { ...m, subtasks, progress, status };
          }),
        })),

      setMissionStatus: (missionId, status) =>
        set((state) => ({
          userTouched: state.userTouched.includes(missionId)
            ? state.userTouched
            : [...state.userTouched, missionId],
          missions: state.missions.map((m) =>
            m.id === missionId ? { ...m, status, progress: status === "planned" ? 0 : m.progress } : m
          ),
        })),

      resetMissions: () => set({ missions: initialMissions, userTouched: [] }),
    }),
    {
      name: "navigator-iss-missions",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
