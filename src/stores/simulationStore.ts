import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

/** 仿真速度倍率 */
export type SimulationSpeed = 1 | 2 | 5;

interface SimulationState {
  /** 是否运行中 */
  running: boolean;
  /** 速度倍率 */
  speed: SimulationSpeed;
  /** 仿真经过的 tick 数 */
  tickCount: number;
  /** 仿真经过的虚拟天数（每 tick ≈ 3 秒真实时间 = 1/200 天仿真时间） */
  elapsedDays: number;
  /** 暂停仿真 */
  pause: () => void;
  /** 恢复仿真 */
  resume: () => void;
  /** 切换暂停/恢复 */
  toggle: () => void;
  /** 设置速度 */
  setSpeed: (speed: SimulationSpeed) => void;
  /** 推进一个 tick（由 useSimulation 调用） */
  tick: () => void;
  /** 重置仿真计数 */
  resetTick: () => void;
}

/** 仿真控制 Store */
export const useSimulationStore = create<SimulationState>()(
  persist(
    (set) => ({
      running: true,
      speed: 1,
      tickCount: 0,
      elapsedDays: 0,

      pause: () => set({ running: false }),
      resume: () => set({ running: true }),
      toggle: () => set((s) => ({ running: !s.running })),
      setSpeed: (speed) => set({ speed }),
      tick: () =>
        set((s) => ({
          tickCount: s.tickCount + 1,
          elapsedDays: s.elapsedDays + 1 / 200,
        })),
      resetTick: () => set({ tickCount: 0, elapsedDays: 0 }),
    }),
    {
      name: "navigator-iss-sim",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ speed: state.speed }),
    }
  )
);
