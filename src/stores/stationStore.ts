import { create } from "zustand";
import type { CabinStatus, EnergySystem, LifeSupport, Propulsion, Alert } from "@/data/types";
import { initialCabins, initialEnergy, initialLifeSupport, initialPropulsion, initialAlerts } from "@/data/mockData";
import { addFluctuation, clamp } from "@/utils/formatters";

interface StationState {
  cabins: CabinStatus[];
  energy: EnergySystem;
  lifeSupport: LifeSupport;
  propulsion: Propulsion;
  alerts: Alert[];
  updateSimulation: () => void;
  acknowledgeAlert: (id: string) => void;
}

/** 空间站状态 Store */
export const useStationStore = create<StationState>((set) => ({
  cabins: initialCabins,
  energy: initialEnergy,
  lifeSupport: initialLifeSupport,
  propulsion: initialPropulsion,
  alerts: initialAlerts,

  updateSimulation: () =>
    set((state) => ({
      cabins: state.cabins.map((cabin) => ({
        ...cabin,
        temperature: clamp(addFluctuation(cabin.temperature, 0.3), 15, 45),
        pressure: clamp(addFluctuation(cabin.pressure, 0.2), 95, 110),
        radiation: clamp(addFluctuation(cabin.radiation, 0.02), 0, 5),
        integrity: clamp(addFluctuation(cabin.integrity, 0.05), 80, 100),
      })),
      energy: {
        ...state.energy,
        reactorOutput: clamp(addFluctuation(state.energy.reactorOutput, 15), 600, 1200),
        storageLevel: clamp(addFluctuation(state.energy.storageLevel, 0.5), 50, 100),
        consumption: clamp(addFluctuation(state.energy.consumption, 10), 400, 900),
      },
      lifeSupport: {
        ...state.lifeSupport,
        oxygenLevel: clamp(addFluctuation(state.lifeSupport.oxygenLevel, 0.1), 18, 23),
        co2Level: clamp(addFluctuation(state.lifeSupport.co2Level, 0.005), 0, 0.1),
        humidity: clamp(addFluctuation(state.lifeSupport.humidity, 1), 30, 60),
        temperature: clamp(addFluctuation(state.lifeSupport.temperature, 0.2), 18, 28),
        waterRecycling: clamp(addFluctuation(state.lifeSupport.waterRecycling, 0.3), 90, 100),
        airQuality: clamp(addFluctuation(state.lifeSupport.airQuality, 1), 80, 100),
      },
      propulsion: {
        ...state.propulsion,
        mainThrust: clamp(addFluctuation(state.propulsion.mainThrust, 500), 50000, 120000),
        fuelReserve: clamp(addFluctuation(state.propulsion.fuelReserve, 0.02), 50, 100),
        vectorControl: clamp(addFluctuation(state.propulsion.vectorControl, 0.1), 95, 100),
      },
    })),

  acknowledgeAlert: (id) =>
    set((state) => ({
      alerts: state.alerts.map((a) => (a.id === id ? { ...a, acknowledged: true } : a)),
    })),
}));
