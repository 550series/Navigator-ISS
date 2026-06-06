import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Experiment, ExperimentDataPoint } from "@/data/types";

interface ExperimentState {
  experiments: Experiment[];
  addExperiment: (experiment: Omit<Experiment, "id" | "dataPoints">) => void;
  updateExperiment: (id: string, updates: Partial<Experiment>) => void;
  addDataPoint: (experimentId: string, dataPoint: ExperimentDataPoint) => void;
  updateStatus: (id: string, status: Experiment["status"]) => void;
  getStats: () => {
    total: number;
    active: number;
    planned: number;
    completed: number;
    aborted: number;
  };
}

const initialExperiments: Experiment[] = [
  {
    id: "exp-001",
    name: "微重力植物生长实验",
    principal: "陈博士",
    status: "active",
    category: "biology",
    startDate: "2026-05-15",
    objectives: [
      "研究微重力环境对植物根系生长的影响",
      "测试新型水培系统在太空环境中的效率",
      "收集植物在长期太空飞行中的基因表达数据",
    ],
    resources: [
      { type: "电力", allocated: 50, used: 35 },
      { type: "水资源", allocated: 20, used: 12 },
      { type: "实验空间", allocated: 1, used: 1 },
    ],
    dataPoints: [
      {
        timestamp: "2026-05-20 10:00",
        parameters: { height: 12.5, leafCount: 8, rootLength: 15.2 },
        observations: "植物生长状态良好，根系呈现向水性生长",
      },
      {
        timestamp: "2026-05-27 10:00",
        parameters: { height: 18.3, leafCount: 12, rootLength: 22.1 },
        observations: "生长速度比地面对照组快约15%",
      },
    ],
    notes: ["初始种子发芽率100%", "水培系统运行稳定"],
  },
  {
    id: "exp-002",
    name: "宇宙射线探测器校准",
    principal: "李研究员",
    status: "active",
    category: "physics",
    startDate: "2026-06-01",
    objectives: [
      "校准新型宇宙射线探测器的灵敏度",
      "记录高能粒子事件的频率和能量分布",
    ],
    resources: [
      { type: "电力", allocated: 30, used: 28 },
      { type: "数据存储", allocated: 100, used: 45 },
    ],
    dataPoints: [
      {
        timestamp: "2026-06-02 14:30",
        parameters: { particleCount: 1250, avgEnergy: 45.2 },
        observations: "探测器工作正常，记录到一次高能事件",
      },
    ],
    notes: ["探测器灵敏度符合预期"],
  },
  {
    id: "exp-003",
    name: "新型合金材料疲劳测试",
    principal: "王工程师",
    status: "planned",
    category: "materials",
    startDate: "2026-06-15",
    objectives: [
      "测试钛铝合金在微重力环境下的疲劳特性",
      "比较与地面测试结果的差异",
    ],
    resources: [
      { type: "电力", allocated: 20, used: 0 },
      { type: "实验空间", allocated: 0.5, used: 0 },
    ],
    dataPoints: [],
    notes: ["等待材料样品从地球运送"],
  },
  {
    id: "exp-004",
    name: "地球大气层观测",
    principal: "张教授",
    status: "completed",
    category: "earth_observation",
    startDate: "2026-04-01",
    endDate: "2026-05-30",
    objectives: [
      "记录不同季节的大气层光学特性",
      "监测臭氧层变化趋势",
    ],
    resources: [
      { type: "电力", allocated: 15, used: 14 },
      { type: "数据存储", allocated: 200, used: 185 },
    ],
    dataPoints: [
      {
        timestamp: "2026-04-15 08:00",
        parameters: { ozoneLevel: 285, visibility: 95 },
        observations: "大气层清晰度良好",
      },
      {
        timestamp: "2026-05-15 08:00",
        parameters: { ozoneLevel: 290, visibility: 92 },
        observations: "臭氧层略有增厚",
      },
    ],
    notes: ["数据已传输回地球", "实验目标全部完成"],
  },
];

export const useExperimentStore = create<ExperimentState>()(
  persist(
    (set, get) => ({
      experiments: initialExperiments,

      addExperiment: (experiment) => {
        const newExperiment: Experiment = {
          ...experiment,
          id: `exp-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          dataPoints: [],
        };
        set((state) => ({
          experiments: [newExperiment, ...state.experiments],
        }));
      },

      updateExperiment: (id, updates) => {
        set((state) => ({
          experiments: state.experiments.map((e) =>
            e.id === id ? { ...e, ...updates } : e
          ),
        }));
      },

      addDataPoint: (experimentId, dataPoint) => {
        set((state) => ({
          experiments: state.experiments.map((e) =>
            e.id === experimentId
              ? { ...e, dataPoints: [...e.dataPoints, dataPoint] }
              : e
          ),
        }));
      },

      updateStatus: (id, status) => {
        const now = new Date();
        const endDate = status === "completed" || status === "aborted"
          ? `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`
          : undefined;
        set((state) => ({
          experiments: state.experiments.map((e) =>
            e.id === id ? { ...e, status, endDate } : e
          ),
        }));
      },

      getStats: () => {
        const { experiments } = get();
        return {
          total: experiments.length,
          active: experiments.filter((e) => e.status === "active").length,
          planned: experiments.filter((e) => e.status === "planned").length,
          completed: experiments.filter((e) => e.status === "completed").length,
          aborted: experiments.filter((e) => e.status === "aborted").length,
        };
      },
    }),
    {
      name: "navigator-iss-experiments",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        experiments: state.experiments,
      }),
    }
  )
);
