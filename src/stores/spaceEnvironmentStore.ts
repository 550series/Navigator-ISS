import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  Planet,
  SpaceWeather,
  StationAttitude,
  CelestialEvent,
  ObservationLog,
} from "@/data/spaceEnvironmentTypes";
import { clamp } from "@/utils/formatters";

interface SpaceEnvironmentState {
  planets: Planet[];
  weather: SpaceWeather;
  attitude: StationAttitude;
  celestialEvents: CelestialEvent[];
  observationLogs: ObservationLog[];
  updateEnvironment: () => void;
  addObservationLog: (log: Omit<ObservationLog, "id" | "timestamp">) => void;
  getThreatLevel: () => "low" | "moderate" | "high" | "critical";
}

const initialPlanets: Planet[] = [
  {
    id: "mercury",
    name: "水星",
    nameEn: "Mercury",
    distance: 0.39,
    currentDistance: 1.2,
    diameter: 4879,
    orbitalPeriod: 88,
    position: { x: 15, y: 50 },
    color: "#b5b5b5",
    description: "太阳系最小的行星，表面温度变化剧烈",
  },
  {
    id: "venus",
    name: "金星",
    nameEn: "Venus",
    distance: 0.72,
    currentDistance: 0.8,
    diameter: 12104,
    orbitalPeriod: 225,
    position: { x: 25, y: 35 },
    color: "#e8cda0",
    description: "太阳系最热的行星，浓厚的大气层",
  },
  {
    id: "earth",
    name: "地球",
    nameEn: "Earth",
    distance: 1.0,
    currentDistance: 0.5,
    diameter: 12742,
    orbitalPeriod: 365,
    position: { x: 35, y: 50 },
    color: "#4a90d9",
    description: "人类的家园，蓝色星球",
  },
  {
    id: "mars",
    name: "火星",
    nameEn: "Mars",
    distance: 1.52,
    currentDistance: 1.8,
    diameter: 6779,
    orbitalPeriod: 687,
    position: { x: 50, y: 60 },
    color: "#c1440e",
    description: "红色星球，人类未来的殖民目标",
  },
  {
    id: "jupiter",
    name: "木星",
    nameEn: "Jupiter",
    distance: 5.2,
    currentDistance: 4.5,
    diameter: 139820,
    orbitalPeriod: 4333,
    position: { x: 65, y: 40 },
    color: "#c88b3a",
    description: "太阳系最大的行星，拥有大红斑",
  },
  {
    id: "saturn",
    name: "土星",
    nameEn: "Saturn",
    distance: 9.54,
    currentDistance: 8.2,
    diameter: 116460,
    orbitalPeriod: 10759,
    position: { x: 78, y: 55 },
    color: "#e0c078",
    description: "美丽的环系统，太阳系第二大行星",
  },
];

const initialWeather: SpaceWeather = {
  solarWindSpeed: 400,
  solarWindDensity: 5,
  cosmicRayLevel: 35,
  magnetosphereStrength: 75,
  radiationLevel: 0.5,
  solarFlareRisk: "low",
  geomagneticStorm: "none",
  forecast: [],
};

const initialAttitude: StationAttitude = {
  roll: 0,
  pitch: 0,
  yaw: 0,
  angularVelocity: { x: 0, y: 0, z: 0 },
  orientation: "earth_pointing",
  stability: 98,
};

const initialCelestialEvents: CelestialEvent[] = [
  {
    id: "event-001",
    type: "meteor_shower",
    name: "宝瓶座η流星雨",
    description: "年度最佳流星雨之一，预计峰值每小时50颗",
    startTime: "2026-06-10 22:00",
    endTime: "2026-06-11 06:00",
    visibility: "excellent",
  },
  {
    id: "event-002",
    type: "conjunction",
    name: "金星-木星合",
    description: "金星和木星在天空中近距离交汇",
    startTime: "2026-06-15 19:00",
    endTime: "2026-06-15 23:00",
    visibility: "good",
  },
  {
    id: "event-003",
    type: "comet",
    name: "C/2026 F1 彗星",
    description: "新发现的彗星，预计肉眼可见",
    startTime: "2026-06-20",
    endTime: "2026-06-25",
    visibility: "good",
  },
];

const initialLogs: ObservationLog[] = [
  {
    id: "log-001",
    timestamp: "2026-06-05 23:15",
    observer: "张伟",
    target: "木星",
    type: "instrument",
    description: "使用光谱仪观测木星大气层",
    findings: "检测到氨云层浓度变化，大红斑区域涡旋增强",
  },
  {
    id: "log-002",
    timestamp: "2026-06-04 02:30",
    observer: "刘洋",
    target: "猎户座星云",
    type: "photography",
    description: "长时间曝光拍摄猎户座星云",
    findings: "成功捕获M42星云细节，发现新的原恒星候选体",
  },
];

export const useSpaceEnvironmentStore = create<SpaceEnvironmentState>()(
  persist(
    (set, get) => ({
      planets: initialPlanets,
      weather: initialWeather,
      attitude: initialAttitude,
      celestialEvents: initialCelestialEvents,
      observationLogs: initialLogs,

      updateEnvironment: () => {
        set((state) => {
          // Update planet positions (simplified orbital mechanics)
          const planets = state.planets.map((planet) => ({
            ...planet,
            currentDistance: clamp(
              planet.currentDistance + (Math.random() - 0.5) * 0.1,
              planet.distance * 0.8,
              planet.distance * 1.2
            ),
            position: {
              x: (planet.position.x + Math.random() * 2 - 1) % 100,
              y: (planet.position.y + Math.random() * 2 - 1) % 100,
            },
          }));

          // Update space weather
          const weather: SpaceWeather = {
            solarWindSpeed: clamp(state.weather.solarWindSpeed + (Math.random() - 0.5) * 50, 300, 800),
            solarWindDensity: clamp(state.weather.solarWindDensity + (Math.random() - 0.5) * 2, 1, 15),
            cosmicRayLevel: clamp(state.weather.cosmicRayLevel + (Math.random() - 0.5) * 10, 10, 90),
            magnetosphereStrength: clamp(state.weather.magnetosphereStrength + (Math.random() - 0.5) * 5, 50, 100),
            radiationLevel: clamp(state.weather.radiationLevel + (Math.random() - 0.5) * 0.2, 0.1, 2),
            solarFlareRisk: Math.random() > 0.95 ? "high" : Math.random() > 0.8 ? "moderate" : "low",
            geomagneticStorm: Math.random() > 0.95 ? "moderate" : "none",
            forecast: [],
          };

          // Update station attitude
          const attitude: StationAttitude = {
            roll: clamp(state.attitude.roll + (Math.random() - 0.5) * 0.5, -5, 5),
            pitch: clamp(state.attitude.pitch + (Math.random() - 0.5) * 0.5, -5, 5),
            yaw: clamp(state.attitude.yaw + (Math.random() - 0.5) * 0.5, -5, 5),
            angularVelocity: {
              x: (Math.random() - 0.5) * 0.2,
              y: (Math.random() - 0.5) * 0.2,
              z: (Math.random() - 0.5) * 0.2,
            },
            orientation: state.attitude.orientation,
            stability: clamp(state.attitude.stability + (Math.random() - 0.5) * 2, 90, 100),
          };

          return { planets, weather, attitude };
        });
      },

      addObservationLog: (log) => {
        const now = new Date();
        const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
        const newLog: ObservationLog = {
          ...log,
          id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          timestamp,
        };
        set((state) => ({
          observationLogs: [newLog, ...state.observationLogs].slice(0, 50),
        }));
      },

      getThreatLevel: () => {
        const { weather } = get();
        if (weather.solarFlareRisk === "extreme" || weather.geomagneticStorm === "severe") return "critical";
        if (weather.solarFlareRisk === "high" || weather.geomagneticStorm === "moderate") return "high";
        if (weather.cosmicRayLevel > 70 || weather.radiationLevel > 1.5) return "moderate";
        return "low";
      },
    }),
    {
      name: "navigator-iss-space-environment",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        observationLogs: state.observationLogs,
      }),
    }
  )
);
