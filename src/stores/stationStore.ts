import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CabinStatus, EnergySystem, LifeSupport, Propulsion, Alert } from "@/data/types";
import { initialCabins, initialEnergy, initialLifeSupport, initialPropulsion, initialAlerts } from "@/data/mockData";
import { addFluctuation, clamp } from "@/utils/formatters";
import { useResourceStore } from "@/stores/resourceStore";

interface StationState {
  cabins: CabinStatus[];
  energy: EnergySystem;
  lifeSupport: LifeSupport;
  propulsion: Propulsion;
  alerts: Alert[];
  /** 推进系统目标推力（0-1），用户可手动调节 */
  thrustTarget: number;
  updateSimulation: () => void;
  acknowledgeAlert: (id: string) => void;
  setThrustTarget: (target: number) => void;
  /** 注入告警（由事件触发） */
  pushAlert: (alert: Alert) => void;
}

/** 空间站状态 Store */
export const useStationStore = create<StationState>()(
  persist(
    (set) => ({
      cabins: initialCabins,
      energy: initialEnergy,
      lifeSupport: initialLifeSupport,
      propulsion: initialPropulsion,
      alerts: initialAlerts,
      thrustTarget: 0.65,

      updateSimulation: () => {
        const crewSize = useResourceStore.getState().personnel.length;
        set((state) => {
          // 能源：产出与消耗解耦，储能根据差值真实变化
          const output = clamp(addFluctuation(state.energy.reactorOutput, 15), 600, 1200);
          const consumption = clamp(addFluctuation(state.energy.consumption, 10), 400, 900);
          const storageDelta = (output - consumption) * 0.0002;
          const storage = clamp(state.energy.storageLevel + storageDelta + (Math.random() - 0.5) * 0.1, 0, 100);

          // 生命维持：O₂ 随人数衰减，CO₂ 上升，空气质量联动
          const oxygen = clamp(addFluctuation(state.lifeSupport.oxygenLevel, 0.05) - 0.008 * crewSize, 18, 23);
          const co2 = clamp(state.lifeSupport.co2Level + 0.0004 * crewSize + (Math.random() - 0.5) * 0.001, 0, 0.1);
          const airQuality = clamp(oxygen * 4 + (1 - co2 * 10) * 10, 60, 100);

          // 推进：燃料消耗 = (当前推力 / 最大推力) * 基础率
          const thrustRatio = state.propulsion.mainThrust / state.propulsion.mainThrustMax;
          const fuelDelta = -thrustRatio * 0.004;
          const fuelReserve = clamp(state.propulsion.fuelReserve + fuelDelta + (Math.random() - 0.5) * 0.05, 0, 100);

          // 推力向用户设定值缓动
          const mainThrust = clamp(
            state.propulsion.mainThrust + (state.thrustTarget * state.propulsion.mainThrustMax - state.propulsion.mainThrust) * 0.15,
            50000,
            state.propulsion.mainThrustMax
          );

          return {
            cabins: state.cabins.map((cabin) => ({
              ...cabin,
              temperature: clamp(addFluctuation(cabin.temperature, 0.3), 15, 45),
              pressure: clamp(addFluctuation(cabin.pressure, 0.2), 95, 110),
              radiation: clamp(addFluctuation(cabin.radiation, 0.02), 0, 5),
              integrity: clamp(addFluctuation(cabin.integrity, 0.05), 80, 100),
            })),
            energy: {
              ...state.energy,
              reactorOutput: output,
              storageLevel: storage,
              consumption,
            },
            lifeSupport: {
              ...state.lifeSupport,
              oxygenLevel: oxygen,
              co2Level: co2,
              airQuality,
              humidity: clamp(addFluctuation(state.lifeSupport.humidity, 1), 30, 60),
              temperature: clamp(addFluctuation(state.lifeSupport.temperature, 0.2), 18, 28),
              waterRecycling: clamp(addFluctuation(state.lifeSupport.waterRecycling, 0.3), 90, 100),
            },
            propulsion: {
              ...state.propulsion,
              mainThrust,
              fuelReserve,
              vectorControl: clamp(addFluctuation(state.propulsion.vectorControl, 0.1), 95, 100),
            },
          };
        });
      },

      acknowledgeAlert: (id) =>
        set((state) => ({
          alerts: state.alerts.map((a) => (a.id === id ? { ...a, acknowledged: true } : a)),
        })),

      setThrustTarget: (target) => set({ thrustTarget: clamp(target, 0, 1) }),

      pushAlert: (alert) =>
        set((state) => ({ alerts: [alert, ...state.alerts].slice(0, 50) })),
    }),
    {
      name: "navigator-iss-station",
      storage: createJSONStorage(() => localStorage),
      // 只持久化用户可控状态，仿真中间值不存
      partialize: (state) => ({ alerts: state.alerts, thrustTarget: state.thrustTarget }),
    }
  )
);
