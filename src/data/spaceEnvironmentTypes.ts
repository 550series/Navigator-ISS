export interface Planet {
  id: string;
  name: string;
  nameEn: string;
  distance: number; // AU from Sun
  currentDistance: number; // AU from ISS
  diameter: number; // km
  orbitalPeriod: number; // Earth days
  position: { x: number; y: number }; // relative coordinates
  color: string;
  description: string;
}

export interface SpaceWeather {
  solarWindSpeed: number; // km/s
  solarWindDensity: number; // particles/cm³
  cosmicRayLevel: number; // 0-100 scale
  magnetosphereStrength: number; // 0-100
  radiationLevel: number; // mSv/h
  solarFlareRisk: "low" | "moderate" | "high" | "extreme";
  geomagneticStorm: "none" | "minor" | "moderate" | "severe";
  forecast: WeatherForecast[];
}

export interface WeatherForecast {
  time: string;
  solarWindSpeed: number;
  radiationLevel: number;
  risk: "low" | "moderate" | "high";
}

export interface StationAttitude {
  roll: number; // degrees
  pitch: number; // degrees
  yaw: number; // degrees
  angularVelocity: { x: number; y: number; z: number }; // deg/s
  orientation: "sun_pointing" | "earth_pointing" | "inertial" | "manual";
  stability: number; // 0-100
}

export interface CelestialEvent {
  id: string;
  type: "meteor_shower" | "eclipse" | "conjunction" | "transit" | "comet";
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  visibility: "excellent" | "good" | "poor";
  observationNotes?: string;
}

export interface ObservationLog {
  id: string;
  timestamp: string;
  observer: string;
  target: string;
  type: "visual" | "instrument" | "photography";
  description: string;
  findings: string;
  images?: string[];
}

export interface SpaceEnvironmentState {
  planets: Planet[];
  weather: SpaceWeather;
  attitude: StationAttitude;
  celestialEvents: CelestialEvent[];
  observationLogs: ObservationLog[];
  updateEnvironment: () => void;
  addObservationLog: (log: Omit<ObservationLog, "id" | "timestamp">) => void;
  getThreatLevel: () => "low" | "moderate" | "high" | "critical";
}
