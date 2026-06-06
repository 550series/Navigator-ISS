import type {
  CabinStatus,
  EnergySystem,
  LifeSupport,
  Propulsion,
  Resource,
  Personnel,
  Equipment,
  NavigationData,
  AstronomicalData,
  Communication,
  CommLink,
  Mission,
  Alert,
} from "./types";

/** 舱室初始数据 */
export const initialCabins: CabinStatus[] = [
  { id: "c1", name: "指挥舱", temperature: 22.4, pressure: 101.3, radiation: 0.12, integrity: 98.7, status: "normal" },
  { id: "c2", name: "生活舱-A", temperature: 23.1, pressure: 101.1, radiation: 0.08, integrity: 97.2, status: "normal" },
  { id: "c3", name: "生活舱-B", temperature: 22.8, pressure: 100.9, radiation: 0.09, integrity: 96.5, status: "normal" },
  { id: "c4", name: "引擎舱", temperature: 38.6, pressure: 102.5, radiation: 2.34, integrity: 94.1, status: "warning" },
  { id: "c5", name: "货舱-A", temperature: 18.2, pressure: 100.8, radiation: 0.15, integrity: 99.1, status: "normal" },
  { id: "c6", name: "货舱-B", temperature: 17.9, pressure: 100.7, radiation: 0.18, integrity: 98.3, status: "normal" },
  { id: "c7", name: "医疗舱", temperature: 24.0, pressure: 101.5, radiation: 0.05, integrity: 99.8, status: "normal" },
  { id: "c8", name: "实验室", temperature: 21.5, pressure: 101.2, radiation: 0.22, integrity: 97.8, status: "normal" },
];

/** 能源系统初始数据 */
export const initialEnergy: EnergySystem = {
  reactorOutput: 847,
  reactorOutputMax: 1200,
  storageLevel: 78.3,
  storageCapacity: 100,
  consumption: 623,
  distribution: [
    { name: "生命维持", value: 35 },
    { name: "推进系统", value: 28 },
    { name: "通信系统", value: 12 },
    { name: "科研设备", value: 15 },
    { name: "其他", value: 10 },
  ],
  trend: Array.from({ length: 24 }, (_, i) => ({
    time: `${String(i).padStart(2, "0")}:00`,
    output: 800 + Math.random() * 100,
    consumption: 580 + Math.random() * 80,
  })),
};

/** 生命维持系统初始数据 */
export const initialLifeSupport: LifeSupport = {
  oxygenLevel: 20.9,
  co2Level: 0.04,
  humidity: 45,
  temperature: 22.5,
  waterRecycling: 97.3,
  filterStatus: "normal",
  airQuality: 94,
};

/** 推进系统初始数据 */
export const initialPropulsion: Propulsion = {
  mainThrust: 78500,
  mainThrustMax: 120000,
  ionThrusters: [
    { id: "it1", status: "在线", thrust: 2400 },
    { id: "it2", status: "在线", thrust: 2350 },
    { id: "it3", status: "在线", thrust: 2410 },
    { id: "it4", status: "维护中", thrust: 0 },
  ],
  fuelReserve: 67.8,
  fuelCapacity: 100,
  vectorControl: 99.2,
  engineStatus: "online",
};

/** 物资资源初始数据 */
export const initialResources: Resource[] = [
  { id: "r1", category: "食物", name: "标准口粮", quantity: 12450, capacity: 20000, consumptionRate: 85, unit: "份", alertLevel: "normal" },
  { id: "r2", category: "食物", name: "应急食品", quantity: 3200, capacity: 5000, consumptionRate: 0, unit: "份", alertLevel: "normal" },
  { id: "r3", category: "水", name: "饮用水", quantity: 8900, capacity: 15000, consumptionRate: 120, unit: "升", alertLevel: "normal" },
  { id: "r4", category: "水", name: "工业用水", quantity: 4500, capacity: 10000, consumptionRate: 45, unit: "升", alertLevel: "normal" },
  { id: "r5", category: "医疗", name: "急救药品", quantity: 890, capacity: 1500, consumptionRate: 3, unit: "套", alertLevel: "normal" },
  { id: "r6", category: "医疗", name: "手术器械", quantity: 45, capacity: 60, consumptionRate: 0, unit: "套", alertLevel: "normal" },
  { id: "r7", category: "备件", name: "电子元件", quantity: 2340, capacity: 5000, consumptionRate: 8, unit: "件", alertLevel: "low" },
  { id: "r8", category: "备件", name: "机械零件", quantity: 1560, capacity: 4000, consumptionRate: 5, unit: "件", alertLevel: "normal" },
  { id: "r9", category: "能源", name: "备用电池", quantity: 340, capacity: 500, consumptionRate: 2, unit: "组", alertLevel: "normal" },
  { id: "r10", category: "能源", name: "核燃料棒", quantity: 12, capacity: 20, consumptionRate: 0.01, unit: "根", alertLevel: "normal" },
  { id: "r11", category: "气体", name: "氧气储备", quantity: 6700, capacity: 12000, consumptionRate: 95, unit: "升", alertLevel: "normal" },
  { id: "r12", category: "气体", name: "氮气储备", quantity: 8900, capacity: 15000, consumptionRate: 30, unit: "升", alertLevel: "normal" },
];

/** 人员初始数据 */
export const initialPersonnel: Personnel[] = [
  { id: "p1", name: "刘培强", role: "领航员", department: "指挥中心", healthStatus: "healthy", shift: "A", location: "指挥舱" },
  { id: "p2", name: "王磊", role: "空间站站长", department: "指挥中心", healthStatus: "healthy", shift: "A", location: "指挥舱" },
  { id: "p3", name: "李智", role: "工程师", department: "动力系统", healthStatus: "healthy", shift: "B", location: "引擎舱" },
  { id: "p4", name: "陈雪", role: "医疗官", department: "医疗中心", healthStatus: "healthy", shift: "A", location: "医疗舱" },
  { id: "p5", name: "张明", role: "通信官", department: "通信中心", healthStatus: "minor", shift: "B", location: "指挥舱" },
  { id: "p6", name: "赵刚", role: "机械师", department: "维护部门", healthStatus: "healthy", shift: "C", location: "货舱-A" },
  { id: "p7", name: "孙丽", role: "科研员", department: "科研部门", healthStatus: "healthy", shift: "A", location: "实验室" },
  { id: "p8", name: "周伟", role: "导航员", department: "指挥中心", healthStatus: "healthy", shift: "B", location: "指挥舱" },
  { id: "p9", name: "吴芳", role: "生命维持技师", department: "生命维持", healthStatus: "healthy", shift: "C", location: "生活舱-A" },
  { id: "p10", name: "郑浩", role: "安全官", department: "安全部门", healthStatus: "injured", shift: "A", location: "医疗舱" },
];

/** 设备初始数据 */
export const initialEquipment: Equipment[] = [
  { id: "e1", name: "主聚变反应堆", location: "引擎舱", status: "operational", nextMaintenance: "2075-03-15", runtime: 45230 },
  { id: "e2", name: "离子推进器-01", location: "引擎舱", status: "operational", nextMaintenance: "2075-02-28", runtime: 32100 },
  { id: "e3", name: "离子推进器-04", location: "引擎舱", status: "offline", nextMaintenance: "2075-01-20", runtime: 28900 },
  { id: "e4", name: "水循环处理器", location: "生活舱-A", status: "operational", nextMaintenance: "2075-04-01", runtime: 38500 },
  { id: "e5", name: "空气过滤系统", location: "生活舱-B", status: "degraded", nextMaintenance: "2075-01-25", runtime: 41200 },
  { id: "e6", name: "主通信阵列", location: "指挥舱", status: "operational", nextMaintenance: "2075-05-10", runtime: 29800 },
  { id: "e7", name: "备用通信阵列", location: "指挥舱", status: "operational", nextMaintenance: "2075-06-15", runtime: 15600 },
  { id: "e8", name: "导航计算机", location: "指挥舱", status: "operational", nextMaintenance: "2075-03-20", runtime: 52100 },
];

/** 导航初始数据 */
export const initialNavigation: NavigationData = {
  currentDistance: 4.22,
  totalDistance: 4.37,
  speed: 0.0042,
  targetOrbit: "半人马座α星C轨道",
  deviation: 0.0023,
  heading: 127.5,
  waypoints: [
    { name: "地球轨道脱离", distance: 0, completed: true },
    { name: "月球引力弹弓", distance: 0.38, completed: true },
    { name: "木星引力加速", distance: 1.2, completed: true },
    { name: "土星轨道修正", distance: 2.1, completed: true },
    { name: "柯伊伯带穿越", distance: 3.8, completed: true },
    { name: "奥尔特云边界", distance: 4.0, completed: false },
    { name: "半人马座α星入轨", distance: 4.37, completed: false },
  ],
};

/** 天文数据 */
export const initialAstronomical: AstronomicalData = {
  stellarPosition: { ra: 219.9, dec: -60.8 },
  nearestPlanet: { name: "半人马座α星Bb", distance: 0.15, angle: 34.7 },
  radiationBelt: { intensity: 0.34, distance: 0.82 },
  gravityField: { magnitude: 1.12, direction: 127.5 },
};

/** 通信链路初始数据 */
export const initialCommLinks: CommLink[] = [
  { id: "cl1", name: "地球-北京中心", target: "地球联合政府", signalStrength: 87, latency: 4.22, status: "connected", type: "earth" },
  { id: "cl2", name: "地球-休斯顿", target: "NASA控制中心", signalStrength: 72, latency: 4.25, status: "connected", type: "earth" },
  { id: "cl3", name: "地球-莫斯科", target: "联邦航天局", signalStrength: 65, latency: 4.30, status: "degraded", type: "earth" },
  { id: "cl4", name: "中继卫星-07", target: "深空中继站", signalStrength: 91, latency: 1.2, status: "connected", type: "satellite" },
  { id: "cl5", name: "地球发动机-华北区", target: "行星发动机控制", signalStrength: 54, latency: 3.8, status: "degraded", type: "ship" },
  { id: "cl6", name: "地下城-北京", target: "地下城管理中心", signalStrength: 43, latency: 4.5, status: "offline", type: "earth" },
];

/** 通信记录初始数据 */
export const initialCommunications: Communication[] = [
  { id: "cm1", source: "领航员空间站", target: "地球联合政府", type: "official", signalStrength: 87, latency: 4.22, status: "connected", timestamp: "2075-01-15 08:30:00", content: "空间站第2847日例行报告：所有系统运行正常，推进系统输出稳定。" },
  { id: "cm2", source: "地球联合政府", target: "领航员空间站", type: "official", signalStrength: 85, latency: 4.22, status: "connected", timestamp: "2075-01-15 06:15:00", content: "确认收到报告。行星发动机组运行状态更新：华北3号发动机维护完毕，已恢复运行。" },
  { id: "cm3", source: "领航员空间站", target: "深空中继站", type: "routine", signalStrength: 91, latency: 1.2, status: "connected", timestamp: "2075-01-15 04:00:00", content: "中继卫星数据同步完成，导航数据已更新。" },
  { id: "cm4", source: "引擎舱", target: "指挥中心", type: "emergency", signalStrength: 100, latency: 0, status: "connected", timestamp: "2075-01-14 22:45:00", content: "离子推进器-04检测到异常振动，已自动关闭并启动备用系统。请求维护团队评估。" },
  { id: "cm5", source: "地下城-北京", target: "领航员空间站", type: "routine", signalStrength: 43, latency: 4.5, status: "offline", timestamp: "2075-01-14 18:30:00", content: "地下城物资调配请求：B区需要额外的医疗物资补给。" },
  { id: "cm6", source: "NASA控制中心", target: "领航员空间站", type: "official", signalStrength: 72, latency: 4.25, status: "connected", timestamp: "2075-01-14 12:00:00", content: "轨道修正方案已验证，建议在T+48小时执行微调。" },
];

/** 任务初始数据 */
export const initialMissions: Mission[] = [
  {
    id: "m1", title: "航线微调执行", description: "根据地球联合政府指令，执行预定航线微调操作", priority: "critical",
    status: "in_progress", progress: 67, assignee: "周伟", deadline: "2075-01-16",
    subtasks: [{ name: "轨道参数计算", completed: true }, { name: "推力矢量调整", completed: true }, { name: "执行推进", completed: false }, { name: "轨道验证", completed: false }],
  },
  {
    id: "m2", title: "离子推进器-04维修", description: "对异常振动的离子推进器进行全面检测与维修", priority: "high",
    status: "in_progress", progress: 35, assignee: "李智", deadline: "2075-01-18",
    subtasks: [{ name: "故障诊断", completed: true }, { name: "部件更换", completed: false }, { name: "系统测试", completed: false }, { name: "恢复运行", completed: false }],
  },
  {
    id: "m3", title: "空气过滤系统维护", description: "生活舱-B空气过滤系统性能下降，需要更换滤芯", priority: "medium",
    status: "planned", progress: 0, assignee: "吴芳", deadline: "2075-01-20",
    subtasks: [{ name: "滤芯准备", completed: false }, { name: "系统停机", completed: false }, { name: "滤芯更换", completed: false }, { name: "性能测试", completed: false }],
  },
  {
    id: "m4", title: "通信系统升级", description: "部署新版本通信协议，提升深空通信稳定性", priority: "medium",
    status: "planned", progress: 0, assignee: "张明", deadline: "2075-01-22",
    subtasks: [{ name: "协议测试", completed: false }, { name: "备份当前系统", completed: false }, { name: "部署升级", completed: false }, { name: "通信验证", completed: false }],
  },
  {
    id: "m5", title: "第2848日例行巡检", description: "全站设备与系统例行巡检", priority: "low",
    status: "planned", progress: 0, assignee: "赵刚", deadline: "2075-01-16",
    subtasks: [{ name: "舱室巡检", completed: false }, { name: "设备状态记录", completed: false }, { name: "异常报告", completed: false }],
  },
  {
    id: "m6", title: "应急演练-舱段隔离", description: "模拟舱段失压场景的应急隔离演练", priority: "high",
    status: "completed", progress: 100, assignee: "郑浩", deadline: "2075-01-14",
    subtasks: [{ name: "演练方案制定", completed: true }, { name: "人员就位", completed: true }, { name: "演练执行", completed: true }, { name: "总结评估", completed: true }],
  },
];

/** 告警初始数据 */
export const initialAlerts: Alert[] = [
  { id: "a1", level: "critical", source: "引擎舱", message: "离子推进器-04异常振动，已自动停机", timestamp: "2075-01-14 22:45", acknowledged: true },
  { id: "a2", level: "warning", source: "生活舱-B", message: "空气过滤系统效率下降至82%", timestamp: "2075-01-15 03:20", acknowledged: true },
  { id: "a3", level: "warning", source: "通信中心", message: "与地下城-北京通信链路中断", timestamp: "2075-01-14 19:10", acknowledged: false },
  { id: "a4", level: "info", source: "导航系统", message: "航线微调参数已更新，等待执行确认", timestamp: "2075-01-15 07:00", acknowledged: false },
  { id: "a5", level: "info", source: "资源管理", message: "电子元件库存低于安全阈值", timestamp: "2075-01-15 01:30", acknowledged: true },
];
