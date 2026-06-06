/** 空间站舱室状态 */
export interface CabinStatus {
  id: string;
  name: string;
  temperature: number;
  pressure: number;
  radiation: number;
  integrity: number;
  status: "normal" | "warning" | "critical";
}

/** 能源系统数据 */
export interface EnergySystem {
  reactorOutput: number;
  reactorOutputMax: number;
  storageLevel: number;
  storageCapacity: number;
  consumption: number;
  distribution: { name: string; value: number }[];
  trend: { time: string; output: number; consumption: number }[];
}

/** 生命维持系统数据 */
export interface LifeSupport {
  oxygenLevel: number;
  co2Level: number;
  humidity: number;
  temperature: number;
  waterRecycling: number;
  filterStatus: "normal" | "warning" | "critical";
  airQuality: number;
}

/** 推进系统数据 */
export interface Propulsion {
  mainThrust: number;
  mainThrustMax: number;
  ionThrusters: { id: string; status: string; thrust: number }[];
  fuelReserve: number;
  fuelCapacity: number;
  vectorControl: number;
  engineStatus: "online" | "standby" | "offline";
}

/** 物资资源 */
export interface Resource {
  id: string;
  category: string;
  name: string;
  quantity: number;
  capacity: number;
  consumptionRate: number;
  unit: string;
  alertLevel: "normal" | "low" | "critical";
}

/** 人员信息 */
export interface Personnel {
  id: string;
  name: string;
  role: string;
  department: string;
  healthStatus: "healthy" | "minor" | "injured";
  shift: "A" | "B" | "C";
  location: string;
}

/** 设备信息 */
export interface Equipment {
  id: string;
  name: string;
  location: string;
  status: "operational" | "degraded" | "offline";
  nextMaintenance: string;
  runtime: number;
}

/** 导航数据 */
export interface NavigationData {
  currentDistance: number;
  totalDistance: number;
  speed: number;
  targetOrbit: string;
  deviation: number;
  heading: number;
  waypoints: { name: string; distance: number; completed: boolean }[];
}

/** 天文数据 */
export interface AstronomicalData {
  stellarPosition: { ra: number; dec: number };
  nearestPlanet: { name: string; distance: number; angle: number };
  radiationBelt: { intensity: number; distance: number };
  gravityField: { magnitude: number; direction: number };
}

/** 通信记录 */
export interface Communication {
  id: string;
  source: string;
  target: string;
  type: "official" | "emergency" | "routine" | "personal";
  signalStrength: number;
  latency: number;
  status: "connected" | "degraded" | "offline";
  timestamp: string;
  content: string;
}

/** 通信链路状态 */
export interface CommLink {
  id: string;
  name: string;
  target: string;
  signalStrength: number;
  latency: number;
  status: "connected" | "degraded" | "offline";
  type: "earth" | "satellite" | "ship";
}

/** 任务信息 */
export interface Mission {
  id: string;
  title: string;
  description: string;
  priority: "critical" | "high" | "medium" | "low";
  status: "in_progress" | "planned" | "completed" | "aborted";
  progress: number;
  assignee: string;
  deadline: string;
  subtasks: { name: string; completed: boolean }[];
}

/** 系统告警 */
export interface Alert {
  id: string;
  level: "info" | "warning" | "critical";
  source: string;
  message: string;
  timestamp: string;
  acknowledged: boolean;
}
