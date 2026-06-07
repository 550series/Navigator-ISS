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

/** 资源预测 */
export interface ResourceForecast {
  resourceId: string;
  resourceName: string;
  currentLevel: number;
  projectedLevel: number;
  daysUntilDepletion: number;
  recommendedAction: "none" | "monitor" | "reduce" | "resupply";
  confidence: number;
}

/** 补给计划 */
export interface SupplyPlan {
  id: string;
  name: string;
  status: "planned" | "in_transit" | "arrived" | "cancelled";
  launchDate: string;
  arrivalDate: string;
  items: SupplyItem[];
  totalMass: number;
  priority: "low" | "medium" | "high" | "critical";
}

/** 补给物资 */
export interface SupplyItem {
  resourceId: string;
  resourceName: string;
  quantity: number;
  unit: string;
}

/** 资源分配 */
export interface ResourceAllocation {
  id: string;
  systemName: string;
  resourceId: string;
  resourceName: string;
  allocated: number;
  used: number;
  efficiency: number;
}

/** 资源回收 */
export interface ResourceRecycling {
  id: string;
  type: "water" | "air" | "waste" | "energy";
  inputAmount: number;
  outputAmount: number;
  efficiency: number;
  status: "active" | "maintenance" | "offline";
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

/** 航线规划 */
export interface RoutePlan {
  id: string;
  name: string;
  origin: string;
  destination: string;
  distance: number;
  estimatedTime: number;
  fuelRequired: number;
  riskLevel: "low" | "medium" | "high" | "critical";
  waypoints: RouteWaypoint[];
  status: "draft" | "approved" | "active" | "completed";
  createdAt: string;
}

/** 航线航点 */
export interface RouteWaypoint {
  id: string;
  name: string;
  coordinates: { x: number; y: number; z: number };
  arrivalTime: string;
  distanceFromPrev: number;
  fuelConsumption: number;
  hazards: string[];
}

/** 燃料计算 */
export interface FuelCalculation {
  currentFuel: number;
  fuelCapacity: number;
  consumptionRate: number;
  projectedConsumption: number;
  reserveFuel: number;
  efficiency: number;
  gravityAssists: GravityAssist[];
}

/** 引力辅助 */
export interface GravityAssist {
  id: string;
  planetName: string;
  approachDate: string;
  deltaV: number;
  fuelSaved: number;
  riskFactor: number;
}

/** 轨道参数 */
export interface OrbitalParameters {
  semiMajorAxis: number;
  eccentricity: number;
  inclination: number;
  argumentOfPeriapsis: number;
  longitudeOfAscendingNode: number;
  trueAnomaly: number;
  period: number;
  apoapsis: number;
  periapsis: number;
}

/** 航线风险评估 */
export interface RouteRiskAssessment {
  id: string;
  routeId: string;
  overallRisk: "low" | "medium" | "high" | "critical";
  hazards: RouteHazard[];
  mitigationStrategies: string[];
  assessmentDate: string;
}

/** 航线风险点 */
export interface RouteHazard {
  id: string;
  type: "asteroid_field" | "radiation_zone" | "gravity_well" | "debris_field" | "solar_activity";
  name: string;
  location: number;
  severity: "low" | "medium" | "high";
  description: string;
  avoidance建议: string;
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

/** 告警详情（扩展） */
export interface AlertDetail extends Alert {
  category: "system" | "environment" | "equipment" | "personnel";
  handler?: string;
  resolvedAt?: string;
  resolution?: string;
  relatedEquipment?: string[];
}

/** 维修记录 */
export interface MaintenanceRecord {
  id: string;
  equipmentId: string;
  equipmentName: string;
  type: "preventive" | "corrective" | "emergency";
  status: "scheduled" | "in_progress" | "completed" | "overdue";
  priority: "low" | "medium" | "high" | "critical";
  assignee: string;
  scheduledDate: string;
  completedDate?: string;
  description: string;
  partsUsed: { partId: string; partName: string; quantity: number }[];
  notes: string[];
}

/** 备件库存 */
export interface SparePart {
  id: string;
  name: string;
  category: string;
  quantity: number;
  minStock: number;
  location: string;
  lastRestocked: string;
}

/** 太空实验 */
export interface Experiment {
  id: string;
  name: string;
  principal: string;
  status: "planned" | "active" | "paused" | "completed" | "aborted";
  category: "biology" | "physics" | "materials" | "earth_observation";
  startDate: string;
  endDate?: string;
  objectives: string[];
  resources: { type: string; allocated: number; used: number }[];
  dataPoints: ExperimentDataPoint[];
  notes: string[];
}

/** 实验数据点 */
export interface ExperimentDataPoint {
  timestamp: string;
  parameters: Record<string, number>;
  observations: string;
}

/** 应急预案 */
export interface EmergencyPlan {
  id: string;
  name: string;
  type: "fire" | "decompression" | "radiation" | "medical" | "system_failure";
  severity: "low" | "medium" | "high" | "critical";
  steps: EmergencyStep[];
  resources: string[];
  lastDrill?: string;
  nextDrill?: string;
}

/** 应急步骤 */
export interface EmergencyStep {
  order: number;
  action: string;
  responsible: string;
  timeLimit: number;
  completed?: boolean;
}

/** 演练记录 */
export interface DrillRecord {
  id: string;
  planId: string;
  planName: string;
  date: string;
  duration: number;
  participants: string[];
  score: number;
  issues: string[];
  improvements: string[];
}

/** 操作日志 */
export interface OperationLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  target: string;
  details: string;
  result: "success" | "failure" | "pending";
}

/** 系统事件 */
export interface SystemEvent {
  id: string;
  type: "solar_storm" | "meteor_impact" | "equipment_failure" | "supply_arrival" | "crew_rotation" | "medical_emergency" | "communication_loss" | "propulsion_anomaly";
  severity: "low" | "medium" | "high" | "critical";
  timestamp: string;
  description: string;
  impact: {
    systems: string[];
    duration: number;
    recoveryActions: string[];
  };
  resolved: boolean;
}
