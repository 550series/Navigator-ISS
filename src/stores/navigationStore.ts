import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { NavigationData, AstronomicalData, RoutePlan, FuelCalculation, OrbitalParameters, RouteRiskAssessment } from "@/data/types";
import { initialNavigation, initialAstronomical } from "@/data/mockData";
import { addFluctuation, clamp } from "@/utils/formatters";
import { useStationStore } from "@/stores/stationStore";

interface NavigationState {
  navigation: NavigationData;
  astronomical: AstronomicalData;
  routePlans: RoutePlan[];
  fuelCalculation: FuelCalculation;
  orbitalParameters: OrbitalParameters;
  riskAssessments: RouteRiskAssessment[];
  updateSimulation: () => void;
  correctCourse: () => void;
  addRoutePlan: (plan: Omit<RoutePlan, "id">) => void;
  updateRoutePlan: (id: string, updates: Partial<RoutePlan>) => void;
  calculateFuel: (routeId: string) => FuelCalculation;
  assessRisk: (routeId: string) => RouteRiskAssessment;
  resetAll: () => void;
}

const initialRoutePlans: RoutePlan[] = [
  {
    id: "route-001",
    name: "主航线 - 地球至半人马座α",
    origin: "地球轨道",
    destination: "半人马座α星系",
    distance: 4.37,
    estimatedTime: 2555,
    fuelRequired: 85,
    riskLevel: "medium",
    waypoints: [
      { id: "wp-1", name: "月球轨道", coordinates: { x: 0, y: 0, z: 0 }, arrivalTime: "2026-01-15", distanceFromPrev: 0, fuelConsumption: 0, hazards: [] },
      { id: "wp-2", name: "火星轨道", coordinates: { x: 0.5, y: 0.2, z: 0 }, arrivalTime: "2026-06-20", distanceFromPrev: 0.5, fuelConsumption: 8, hazards: ["小行星带"] },
      { id: "wp-3", name: "木星引力辅助", coordinates: { x: 2, y: 1, z: 0.1 }, arrivalTime: "2027-03-10", distanceFromPrev: 2.5, fuelConsumption: 15, hazards: ["辐射带"] },
      { id: "wp-4", name: "柯伊伯带", coordinates: { x: 3, y: 2, z: 0.2 }, arrivalTime: "2028-01-01", distanceFromPrev: 1.5, fuelConsumption: 12, hazards: ["冰质天体"] },
      { id: "wp-5", name: "奥尔特云", coordinates: { x: 4, y: 3, z: 0.3 }, arrivalTime: "2029-06-15", distanceFromPrev: 1.37, fuelConsumption: 10, hazards: ["彗星群"] },
    ],
    status: "active",
    createdAt: "2026-01-01",
  },
  {
    id: "route-002",
    name: "备用航线 - 经天狼星",
    origin: "地球轨道",
    destination: "半人马座α星系",
    distance: 5.2,
    estimatedTime: 3200,
    fuelRequired: 92,
    riskLevel: "low",
    waypoints: [
      { id: "wp-6", name: "天狼星引力辅助", coordinates: { x: 1, y: 1.5, z: 0.1 }, arrivalTime: "2027-09-01", distanceFromPrev: 2.6, fuelConsumption: 20, hazards: ["双星系统引力"] },
      { id: "wp-7", name: "南河三", coordinates: { x: 3, y: 2.5, z: 0.2 }, arrivalTime: "2029-03-15", distanceFromPrev: 2.6, fuelConsumption: 18, hazards: [] },
    ],
    status: "draft",
    createdAt: "2026-02-15",
  },
];

const initialFuelCalculation: FuelCalculation = {
  currentFuel: 78,
  fuelCapacity: 100,
  consumptionRate: 0.004,
  projectedConsumption: 85,
  reserveFuel: 15,
  efficiency: 0.92,
  gravityAssists: [
    { id: "ga-1", planetName: "木星", approachDate: "2027-03-10", deltaV: 2.5, fuelSaved: 12, riskFactor: 0.3 },
    { id: "ga-2", planetName: "土星", approachDate: "2028-06-20", deltaV: 1.8, fuelSaved: 8, riskFactor: 0.2 },
  ],
};

const initialOrbitalParameters: OrbitalParameters = {
  semiMajorAxis: 2.18,
  eccentricity: 0.12,
  inclination: 5.2,
  argumentOfPeriapsis: 45.3,
  longitudeOfAscendingNode: 120.7,
  trueAnomaly: 67.8,
  period: 1825,
  apoapsis: 2.45,
  periapsis: 1.91,
};

const initialRiskAssessments: RouteRiskAssessment[] = [
  {
    id: "risk-001",
    routeId: "route-001",
    overallRisk: "medium",
    hazards: [
      { id: "h-1", type: "asteroid_field", name: "小行星带", location: 0.3, severity: "medium", description: "火星与木星之间的小行星密集区", avoidance建议: "调整航线避开主要小行星群" },
      { id: "h-2", type: "radiation_zone", name: "木星辐射带", location: 0.6, severity: "high", description: "木星强磁场产生的高能辐射", avoidance建议: "快速通过或使用辐射屏蔽" },
      { id: "h-3", type: "debris_field", name: "柯伊伯带", location: 0.8, severity: "low", description: "冰质天体和彗星残骸", avoidance建议: "保持安全距离通过" },
    ],
    mitigationStrategies: [
      "提前进行航线微调避开主要威胁",
      "加强辐射屏蔽系统",
      "准备应急维修物资",
      "保持与地球的通信联系",
    ],
    assessmentDate: "2026-01-10",
  },
];

export const useNavigationStore = create<NavigationState>()(
  persist(
    (set, get) => ({
      navigation: initialNavigation,
      astronomical: initialAstronomical,
      routePlans: initialRoutePlans,
      fuelCalculation: initialFuelCalculation,
      orbitalParameters: initialOrbitalParameters,
      riskAssessments: initialRiskAssessments,

      updateSimulation: () =>
        set((state) => {
          const propulsion = useStationStore.getState().propulsion;
          const thrustRatio = propulsion.mainThrust / propulsion.mainThrustMax;
          const baseSpeed = 0.00005;
          const speedMultiplier = 0.5 + thrustRatio * 0.8;

          const currentDistance = clamp(
            state.navigation.currentDistance + baseSpeed * speedMultiplier,
            0,
            state.navigation.totalDistance
          );
          const waypoints = state.navigation.waypoints.map((wp) => ({
            ...wp,
            completed: wp.completed || currentDistance >= wp.distance,
          }));

          const fuelConsumption = thrustRatio * 0.004;
          const newFuel = clamp(state.fuelCalculation.currentFuel - fuelConsumption, 0, 100);

          return {
            navigation: {
              ...state.navigation,
              currentDistance,
              waypoints,
              speed: clamp(addFluctuation(state.navigation.speed, 0.0001), 0.003, 0.006),
              deviation: clamp(addFluctuation(state.navigation.deviation, 0.0005), 0, 0.01),
              heading: clamp(addFluctuation(state.navigation.heading, 0.1), 120, 135),
            },
            fuelCalculation: {
              ...state.fuelCalculation,
              currentFuel: newFuel,
            },
            orbitalParameters: {
              ...state.orbitalParameters,
              trueAnomaly: (state.orbitalParameters.trueAnomaly + 0.1) % 360,
              semiMajorAxis: clamp(addFluctuation(state.orbitalParameters.semiMajorAxis, 0.001), 2.1, 2.3),
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
          };
        }),

      correctCourse: () =>
        set((state) => ({
          navigation: {
            ...state.navigation,
            deviation: clamp(state.navigation.deviation * 0.3, 0, 0.01),
          },
        })),

      addRoutePlan: (plan) => {
        const newPlan: RoutePlan = {
          ...plan,
          id: `route-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        };
        set((state) => ({
          routePlans: [newPlan, ...state.routePlans],
        }));
      },

      updateRoutePlan: (id, updates) => {
        set((state) => ({
          routePlans: state.routePlans.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        }));
      },

      calculateFuel: (routeId) => {
        const { routePlans, fuelCalculation } = get();
        const route = routePlans.find((r) => r.id === routeId);
        if (!route) return fuelCalculation;

        const totalFuelNeeded = route.waypoints.reduce((sum, wp) => sum + wp.fuelConsumption, 0);
        const gravityAssistSavings = fuelCalculation.gravityAssists.reduce((sum, ga) => sum + ga.fuelSaved, 0);
        const netFuelNeeded = totalFuelNeeded - gravityAssistSavings;

        return {
          ...fuelCalculation,
          projectedConsumption: netFuelNeeded,
          reserveFuel: fuelCalculation.currentFuel - netFuelNeeded,
        };
      },

      assessRisk: (routeId) => {
        const { routePlans } = get();
        const route = routePlans.find((r) => r.id === routeId);
        if (!route) {
          return {
            id: `risk-${Date.now()}`,
            routeId,
            overallRisk: "low",
            hazards: [],
            mitigationStrategies: [],
            assessmentDate: new Date().toISOString().split("T")[0],
          };
        }

        const hazards = route.waypoints
          .flatMap((wp) => wp.hazards)
          .map((hazard, i) => ({
            id: `h-${i}`,
            type: "asteroid_field" as const,
            name: hazard,
            location: i / route.waypoints.length,
            severity: "medium" as const,
            description: `${hazard}区域`,
            avoidance建议: "调整航线避开",
          }));

        const overallRisk = hazards.length > 3 ? "high" : hazards.length > 1 ? "medium" : "low";

        return {
          id: `risk-${Date.now()}`,
          routeId,
          overallRisk,
          hazards,
          mitigationStrategies: ["提前进行航线微调", "加强系统防护", "准备应急物资"],
          assessmentDate: new Date().toISOString().split("T")[0],
        };
      },

      resetAll: () =>
        set({
          navigation: initialNavigation,
          astronomical: initialAstronomical,
          routePlans: initialRoutePlans,
          fuelCalculation: initialFuelCalculation,
          orbitalParameters: initialOrbitalParameters,
          riskAssessments: initialRiskAssessments,
        }),
    }),
    {
      name: "navigator-iss-navigation",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        routePlans: state.routePlans,
        riskAssessments: state.riskAssessments,
      }),
    }
  )
);
