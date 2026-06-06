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
}

export type EventType =
  | "solar_flare"
  | "micrometeorite"
  | "comm_jam"
  | "drill"
  | "reactor_overload";

export interface EventDef {
  type: EventType;
  name: string;
  description: string;
  severity: "info" | "warning" | "critical";
  /** 冷却时间（ms） */
  cooldown: number;
  effect: () => EventEffect;
}

/** 事件定义表 */
export const EVENTS: Record<EventType, EventDef> = {
  solar_flare: {
    type: "solar_flare",
    name: "太阳耀斑爆发",
    description: "探测到 M 级太阳耀斑，全站辐射水平上升，通信可能受扰。",
    severity: "warning",
    cooldown: 60_000,
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
};

export const EVENT_LIST: EventDef[] = Object.values(EVENTS);
