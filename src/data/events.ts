import type { Personnel } from "./types";

/** 事件影响效果描述（不直接操作 store，由 eventStore 翻译后下发） */
export interface EventEffect {
  /** 注入告警 */
  alert?: { level: "info" | "warning" | "critical"; source: string; message: string };
  /** 损坏的舱室 ID 列表（扣 integrity） */
  cabinDamage?: string[];
  /** 通信信号衰减（0-1） */
  commPenalty?: number;
  /** 反应堆输出临时调整（绝对值，MW） */
  reactorOverride?: number;
  /** 推力调整（-1~1，叠加到 thrustTarget） */
  thrustDelta?: number;
  /** 船员健康状态变化 */
  personnelHealthChange?: { id: string; health: Personnel["healthStatus"] }[];
  /** 物资补给（正数增加）或泄漏（负数减少） */
  resourceChange?: { id: string; delta: number }[];
  /** 航线偏差调整 */
  deviationDelta?: number;
  /** 设备降级（设备 ID 列表） */
  equipmentDegrade?: string[];
}

export type EventType =
  | "solar_flare"
  | "micrometeorite"
  | "comm_jam"
  | "drill"
  | "reactor_overload"
  | "supply_arrival"
  | "oxygen_leak"
  | "gravity_anomaly"
  | "crew_injury"
  | "system_malfunction"
  | "solar_storm"
  | "hull_breach"
  | "medical_emergency"
  | "power_fluctuation"
  | "navigation_error";

export interface EventDef {
  type: EventType;
  name: string;
  description: string;
  severity: "info" | "warning" | "critical";
  /** 冷却时间（ms） */
  cooldown: number;
  /** 是否可被自动触发 */
  autoTrigger: boolean;
  /** 自动触发概率（0-1，每个仿真 tick） */
  autoProbability: number;
  /** effect 改为接收当前状态参数，支持动态效果 */
  effect: (ctx: EventContext) => EventEffect;
}

/** 事件执行上下文，提供当前系统状态供 effect 使用 */
export interface EventContext {
  personnel: Personnel[];
  equipment: { id: string; name: string; status: string }[];
}

/** 事件定义表 */
export const EVENTS: Record<EventType, EventDef> = {
  solar_flare: {
    type: "solar_flare",
    name: "太阳耀斑爆发",
    description: "探测到 M 级太阳耀斑，全站辐射水平上升，通信可能受扰。",
    severity: "warning",
    cooldown: 60_000,
    autoTrigger: true,
    autoProbability: 0.003,
    effect: () => ({
      alert: {
        level: "warning",
        source: "天文观测",
        message: "M 级太阳耀斑爆发，全站进入辐射防护状态。",
      },
      commPenalty: 0.3,
    }),
  },
  micrometeorite: {
    type: "micrometeorite",
    name: "微陨石撞击",
    description: "高速微陨石撞击货舱区域，部分舱室结构完整性下降。",
    severity: "critical",
    cooldown: 90_000,
    autoTrigger: true,
    autoProbability: 0.002,
    effect: () => ({
      alert: {
        level: "critical",
        source: "结构监测",
        message: "微陨石撞击货舱-A 与货舱-B，舱壁完整性下降。",
      },
      cabinDamage: ["c5", "c6"],
    }),
  },
  comm_jam: {
    type: "comm_jam",
    name: "通信干扰",
    description: "检测到外部干扰源，所有地面通信链路信号下降。",
    severity: "warning",
    cooldown: 45_000,
    autoTrigger: true,
    autoProbability: 0.004,
    effect: () => ({
      alert: {
        level: "warning",
        source: "通信中心",
        message: "外部干扰源侦测，所有地面链路信号 -30%。",
      },
      commPenalty: 0.5,
    }),
  },
  drill: {
    type: "drill",
    name: "应急演练",
    description: "执行全站应急响应演练，注入测试告警并验证人员状态。",
    severity: "info",
    cooldown: 30_000,
    autoTrigger: false,
    autoProbability: 0,
    effect: () => ({
      alert: {
        level: "info",
        source: "演练系统",
        message: "应急演练已启动，请各岗位确认响应。",
      },
    }),
  },
  reactor_overload: {
    type: "reactor_overload",
    name: "反应堆过载",
    description: "主反应堆输出异常飙高，需立即降功率。",
    severity: "critical",
    cooldown: 120_000,
    autoTrigger: true,
    autoProbability: 0.001,
    effect: () => ({
      alert: {
        level: "critical",
        source: "动力系统",
        message: "主反应堆过载警告，请立即降功率！",
      },
      reactorOverride: 1180,
      thrustDelta: -0.3,
    }),
  },
  supply_arrival: {
    type: "supply_arrival",
    name: "补给到达",
    description: "来自地球的补给舱成功对接，物资储备得到补充。",
    severity: "info",
    cooldown: 180_000,
    autoTrigger: true,
    autoProbability: 0.002,
    effect: () => ({
      alert: {
        level: "info",
        source: "物流系统",
        message: "补给舱已对接，物资正在分配中。",
      },
      resourceChange: [
        { id: "r1", delta: 2000 },
        { id: "r3", delta: 1500 },
        { id: "r5", delta: 200 },
        { id: "r11", delta: 1000 },
      ],
    }),
  },
  oxygen_leak: {
    type: "oxygen_leak",
    name: "氧气泄漏",
    description: "检测到生活舱区域氧气泄漏，O₂ 储备下降。",
    severity: "critical",
    cooldown: 100_000,
    autoTrigger: true,
    autoProbability: 0.002,
    effect: () => ({
      alert: {
        level: "critical",
        source: "生命维持",
        message: "生活舱-A 氧气管路泄漏，紧急修复中！",
      },
      resourceChange: [{ id: "r11", delta: -800 }],
      cabinDamage: ["c2"],
    }),
  },
  gravity_anomaly: {
    type: "gravity_anomaly",
    name: "引力异常",
    description: "检测到未知引力波动，航线偏差增大。",
    severity: "warning",
    cooldown: 80_000,
    autoTrigger: true,
    autoProbability: 0.003,
    effect: () => ({
      alert: {
        level: "warning",
        source: "导航系统",
        message: "引力异常波动，航线偏差增大，建议执行修正。",
      },
      deviationDelta: 0.003,
    }),
  },
  crew_injury: {
    type: "crew_injury",
    name: "船员受伤",
    description: "一名船员在执行任务时受伤，需要医疗处理。",
    severity: "warning",
    cooldown: 70_000,
    autoTrigger: true,
    autoProbability: 0.002,
    effect: (ctx) => {
      const healthy = ctx.personnel.filter((p) => p.healthStatus === "healthy");
      if (healthy.length === 0) return { alert: { level: "info", source: "医疗中心", message: "全员已有伤情，无新增受伤。" } };
      const target = healthy[Math.floor(Math.random() * healthy.length)];
      return {
        alert: {
          level: "warning",
          source: "医疗中心",
          message: `${target.name}在执行任务时受伤，已送医处理。`,
        },
        personnelHealthChange: [{ id: target.id, health: "minor" }],
      };
    },
  },
  system_malfunction: {
    type: "system_malfunction",
    name: "设备故障",
    description: "一台设备出现故障，运行状态降级。",
    severity: "warning",
    cooldown: 60_000,
    autoTrigger: true,
    autoProbability: 0.003,
    effect: (ctx) => {
      const operational = ctx.equipment.filter((e) => e.status === "operational");
      if (operational.length === 0) return { alert: { level: "info", source: "维护部门", message: "无运行中设备可故障。" } };
      const target = operational[Math.floor(Math.random() * operational.length)];
      return {
        alert: {
          level: "warning",
          source: "维护部门",
          message: `${target.name}出现故障，状态降级。`,
        },
        equipmentDegrade: [target.id],
      };
    },
  },
  solar_storm: {
    type: "solar_storm",
    name: "太阳风暴",
    description: "强太阳风暴袭击，辐射水平急剧上升，通信严重受扰。",
    severity: "critical",
    cooldown: 150_000,
    autoTrigger: true,
    autoProbability: 0.001,
    effect: () => ({
      alert: {
        level: "critical",
        source: "天文观测",
        message: "强太阳风暴来袭！全站进入紧急辐射防护状态，通信可能中断。",
      },
      commPenalty: 0.8,
      cabinDamage: ["c1", "c2", "c3"],
    }),
  },
  hull_breach: {
    type: "hull_breach",
    name: "船体破裂",
    description: "检测到船体微裂缝，舱室气压下降。",
    severity: "critical",
    cooldown: 200_000,
    autoTrigger: true,
    autoProbability: 0.0008,
    effect: () => ({
      alert: {
        level: "critical",
        source: "结构监测",
        message: "检测到船体微裂缝！生活舱-B 气压下降，紧急封闭中。",
      },
      cabinDamage: ["c3"],
      resourceChange: [{ id: "r11", delta: -500 }],
    }),
  },
  medical_emergency: {
    type: "medical_emergency",
    name: "医疗紧急事件",
    description: "多名船员出现辐射症状，需要紧急医疗处理。",
    severity: "warning",
    cooldown: 120_000,
    autoTrigger: true,
    autoProbability: 0.0015,
    effect: (ctx) => {
      const healthy = ctx.personnel.filter((p) => p.healthStatus === "healthy");
      if (healthy.length === 0) return { alert: { level: "info", source: "医疗中心", message: "全员已有伤情，无新增病例。" } };
      const count = Math.min(2, healthy.length);
      const targets = healthy.sort(() => Math.random() - 0.5).slice(0, count);
      return {
        alert: {
          level: "warning",
          source: "医疗中心",
          message: `${targets.map((t) => t.name).join("、")}出现辐射症状，已隔离治疗。`,
        },
        personnelHealthChange: targets.map((t) => ({ id: t.id, health: "minor" as const })),
      };
    },
  },
  power_fluctuation: {
    type: "power_fluctuation",
    name: "电力波动",
    description: "电力系统出现不稳定波动，影响全站设备运行。",
    severity: "warning",
    cooldown: 90_000,
    autoTrigger: true,
    autoProbability: 0.002,
    effect: () => ({
      alert: {
        level: "warning",
        source: "动力系统",
        message: "电力系统不稳定，输出功率波动较大，建议降低非必要系统功耗。",
      },
      reactorOverride: 650,
    }),
  },
  navigation_error: {
    type: "navigation_error",
    name: "导航偏差",
    description: "导航传感器数据异常，航线出现偏差。",
    severity: "warning",
    cooldown: 100_000,
    autoTrigger: true,
    autoProbability: 0.002,
    effect: () => ({
      alert: {
        level: "warning",
        source: "导航系统",
        message: "导航传感器数据异常，航线偏差增大，需要手动校正。",
      },
      deviationDelta: 0.005,
      thrustDelta: -0.1,
    }),
  },
};

export const EVENT_LIST: EventDef[] = Object.values(EVENTS);
