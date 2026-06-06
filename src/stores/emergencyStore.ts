import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { EmergencyPlan, DrillRecord } from "@/data/types";

interface EmergencyState {
  plans: EmergencyPlan[];
  drills: DrillRecord[];
  activePlanId: string | null;
  activatePlan: (id: string) => void;
  deactivatePlan: () => void;
  completeStep: (planId: string, stepOrder: number) => void;
  addDrill: (drill: Omit<DrillRecord, "id">) => void;
  getStats: () => {
    totalPlans: number;
    activePlan: boolean;
    totalDrills: number;
    avgScore: number;
    upcomingDrills: number;
  };
}

const initialPlans: EmergencyPlan[] = [
  {
    id: "plan-001",
    name: "舱室失压应急处置",
    type: "decompression",
    severity: "critical",
    steps: [
      { order: 1, action: "立即关闭失压舱室气闸门", responsible: "值班指挥", timeLimit: 1 },
      { order: 2, action: "确认人员撤离并清点人数", responsible: "安全官", timeLimit: 3 },
      { order: 3, action: "启动应急氧气供应", responsible: "生命维持工程师", timeLimit: 2 },
      { order: 4, action: "检测相邻舱室密封性", responsible: "结构工程师", timeLimit: 5 },
      { order: 5, action: "评估损伤并制定修复方案", responsible: "总工程师", timeLimit: 15 },
    ],
    resources: ["应急氧气罐", "密封修补工具", "舱外活动装备"],
    lastDrill: "2026-05-20",
    nextDrill: "2026-08-20",
  },
  {
    id: "plan-002",
    name: "火灾应急处置",
    type: "fire",
    severity: "high",
    steps: [
      { order: 1, action: "激活火灾报警系统", responsible: "发现者", timeLimit: 0.5 },
      { order: 2, action: "切断起火区域电源", responsible: "电气工程师", timeLimit: 1 },
      { order: 3, action: "启动灭火系统", responsible: "值班指挥", timeLimit: 2 },
      { order: 4, action: "疏散非必要人员", responsible: "安全官", timeLimit: 5 },
      { order: 5, action: "排查火源并彻底扑灭", responsible: "消防组", timeLimit: 10 },
    ],
    resources: ["灭火器", "防火服", "应急呼吸器"],
    lastDrill: "2026-04-15",
    nextDrill: "2026-07-15",
  },
  {
    id: "plan-003",
    name: "辐射泄漏应急处置",
    type: "radiation",
    severity: "critical",
    steps: [
      { order: 1, action: "触发辐射警报并通报全站", responsible: "辐射防护官", timeLimit: 1 },
      { order: 2, action: "关闭受影响区域通风系统", responsible: "生命维持工程师", timeLimit: 2 },
      { order: 3, action: "分发防辐射药物", responsible: "医疗官", timeLimit: 5 },
      { order: 4, action: "穿戴防护装备排查泄漏源", responsible: "辐射防护组", timeLimit: 10 },
      { order: 5, action: "实施泄漏封堵", responsible: "维修组", timeLimit: 30 },
    ],
    resources: ["辐射防护服", "碘化钾片", "辐射检测仪"],
    lastDrill: "2026-03-10",
    nextDrill: "2026-06-10",
  },
  {
    id: "plan-004",
    name: "医疗紧急处置",
    type: "medical",
    severity: "high",
    steps: [
      { order: 1, action: "评估伤员状况", responsible: "医疗官", timeLimit: 1 },
      { order: 2, action: "实施紧急救治", responsible: "医疗组", timeLimit: 5 },
      { order: 3, action: "准备医疗舱", responsible: "护理人员", timeLimit: 3 },
      { order: 4, action: "联系地面医疗中心会诊", responsible: "通信员", timeLimit: 10 },
      { order: 5, action: "持续监护并记录", responsible: "医疗官", timeLimit: 0 },
    ],
    resources: ["急救药品", "手术器械", "生命监护仪"],
    lastDrill: "2026-05-01",
    nextDrill: "2026-08-01",
  },
  {
    id: "plan-005",
    name: "主系统故障应急处置",
    type: "system_failure",
    severity: "high",
    steps: [
      { order: 1, action: "确认故障系统并评估影响范围", responsible: "系统工程师", timeLimit: 2 },
      { order: 2, action: "切换至备份系统", responsible: "值班指挥", timeLimit: 3 },
      { order: 3, action: "通知地面控制中心", responsible: "通信员", timeLimit: 5 },
      { order: 4, action: "组织抢修", responsible: "维修组", timeLimit: 30 },
      { order: 5, action: "系统恢复测试", responsible: "质量工程师", timeLimit: 15 },
    ],
    resources: ["备件工具箱", "系统诊断仪"],
    lastDrill: "2026-04-25",
    nextDrill: "2026-07-25",
  },
];

const initialDrills: DrillRecord[] = [
  {
    id: "drill-001",
    planId: "plan-001",
    planName: "舱室失压应急处置",
    date: "2026-05-20",
    duration: 25,
    participants: ["张伟", "刘洋", "王磊", "赵明"],
    score: 92,
    issues: ["气闸门关闭延迟10秒", "人员清点耗时超出标准"],
    improvements: ["增加气闸门定期演练频率", "优化人员定位追踪系统"],
  },
  {
    id: "drill-002",
    planId: "plan-002",
    planName: "火灾应急处置",
    date: "2026-04-15",
    duration: 18,
    participants: ["刘洋", "陈博士", "李研究员"],
    score: 88,
    issues: ["灭火器取用路径不熟悉"],
    improvements: ["在关键位置增设灭火器标识"],
  },
];

export const useEmergencyStore = create<EmergencyState>()(
  persist(
    (set, get) => ({
      plans: initialPlans,
      drills: initialDrills,
      activePlanId: null,

      activatePlan: (id) => {
        set((state) => ({
          activePlanId: id,
          plans: state.plans.map((p) =>
            p.id === id
              ? { ...p, steps: p.steps.map((s) => ({ ...s, completed: false })) }
              : p
          ),
        }));
      },

      deactivatePlan: () => set({ activePlanId: null }),

      completeStep: (planId, stepOrder) => {
        set((state) => ({
          plans: state.plans.map((p) =>
            p.id === planId
              ? {
                  ...p,
                  steps: p.steps.map((s) =>
                    s.order === stepOrder ? { ...s, completed: true } : s
                  ),
                }
              : p
          ),
        }));
      },

      addDrill: (drill) => {
        const newDrill: DrillRecord = {
          ...drill,
          id: `drill-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        };
        set((state) => ({
          drills: [newDrill, ...state.drills],
        }));
      },

      getStats: () => {
        const { plans, drills, activePlanId } = get();
        const now = new Date();
        return {
          totalPlans: plans.length,
          activePlan: activePlanId !== null,
          totalDrills: drills.length,
          avgScore: drills.length > 0 ? Math.round(drills.reduce((s, d) => s + d.score, 0) / drills.length) : 0,
          upcomingDrills: plans.filter((p) => p.nextDrill && new Date(p.nextDrill) > now).length,
        };
      },
    }),
    {
      name: "navigator-iss-emergency",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        plans: state.plans,
        drills: state.drills,
        activePlanId: state.activePlanId,
      }),
    }
  )
);
