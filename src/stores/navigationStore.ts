import { create } from "zustand";
import type { NavigationData, AstronomicalData } from "@/data/types";
import { initialNavigation, initialAstronomical } from "@/data/mockData";
import { addFluctuation, clamp } from "@/utils/formatters";

interface NavigationState {
  navigation: NavigationData;
  astronomical: AstronomicalData;
  updateSimulation: () => void;
}

/** 导航数据 Store */
export const useNavigationStore = create<NavigationState>((set) => ({
  navigation: initialNavigation,
  astronomical: initialAstronomical,

  updateSimulation: () =>
    set((state) => ({
      navigation: {
        ...state.navigation,
        currentDistance: clamp(state.navigation.currentDistance + 0.00001, 0, state.navigation.totalDistance),
        speed: clamp(addFluctuation(state.navigation.speed, 0.0001), 0.003, 0.006),
        deviation: clamp(addFluctuation(state.navigation.deviation, 0.0005), 0, 0.01),
        heading: clamp(addFluctuation(state.navigation.heading, 0.1), 120, 135),
      },
      astronomical: {
        stellarPosition: {
          ra: clamp(addFluctuation(state.astronomical.stellarPosition.ra, 0.01), 219, 221),
          dec: clamp(addFluctuation(state.astronomical.stellarPosition.dec, 0.01), -61, -60),
        },
        nearestPlanet: {
          ...state.astronomical.nearestPlanet,
          distance: clamp(addFluctuation(state.astronomical.nearestPlanet.distance, 0.001), 0.1, 0.3),
        },
        radiationBelt: {
          intensity: clamp(addFluctuation(state.astronomical.radiationBelt.intensity, 0.02), 0.1, 0.8),
          distance: clamp(addFluctuation(state.astronomical.radiationBelt.distance, 0.01), 0.5, 1.5),
        },
        gravityField: {
          magnitude: clamp(addFluctuation(state.astronomical.gravityField.magnitude, 0.01), 0.8, 1.5),
          direction: clamp(addFluctuation(state.astronomical.gravityField.direction, 0.5), 120, 135),
        },
      },
    })),
}));
