import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  CrewMember,
  CrewSkill,
  PerformanceEvaluation,
  ScheduleEntry,
  PsychologicalProfile,
} from "@/data/crewManagementTypes";

interface CrewManagementState {
  crew: CrewMember[];
  updateCrewMember: (id: string, updates: Partial<CrewMember>) => void;
  addSkill: (crewId: string, skill: Omit<CrewSkill, "id">) => void;
  updateSkill: (crewId: string, skillId: string, updates: Partial<CrewSkill>) => void;
  addEvaluation: (crewId: string, evaluation: Omit<PerformanceEvaluation, "id">) => void;
  addScheduleEntry: (crewId: string, entry: Omit<ScheduleEntry, "id">) => void;
  updatePsychologicalProfile: (crewId: string, updates: Partial<PsychologicalProfile>) => void;
  getCrewStats: () => {
    total: number;
    healthy: number;
    injured: number;
    avgMorale: number;
    avgStress: number;
    avgEfficiency: number;
  };
}

const initialCrew: CrewMember[] = [
  {
    id: "crew-001",
    name: "张伟",
    role: "站长",
    department: "指挥",
    shift: "A",
    healthStatus: "healthy",
    location: "指挥舱",
    skills: [
      { id: "s1", name: "指挥决策", category: "command", level: 92, experience: 850, maxExperience: 1000, certifications: ["高级指挥官"] },
      { id: "s2", name: "系统管理", category: "engineering", level: 85, experience: 720, maxExperience: 1000, certifications: ["系统工程师"] },
    ],
    psychologicalProfile: { morale: 88, stress: 25, mentalHealth: "stable", socialConnections: 90, sleepQuality: 82, notes: [] },
    performance: {
      tasksCompleted: 156, tasksAssigned: 160, efficiency: 95, reliability: 98, leadership: 96, teamwork: 92, innovation: 88, overallScore: 94,
      evaluations: [{ id: "e1", date: "2026-05-01", evaluator: "地面指挥中心", score: 95, strengths: ["领导能力", "危机处理"], areasForImprovement: ["创新思维"], comments: "表现出色" }],
    },
    schedule: [],
  },
  {
    id: "crew-002",
    name: "刘洋",
    role: "首席工程师",
    department: "工程",
    shift: "A",
    healthStatus: "healthy",
    location: "工程舱",
    skills: [
      { id: "s3", name: "机械维修", category: "engineering", level: 95, experience: 900, maxExperience: 1000, certifications: ["高级工程师"] },
      { id: "s4", name: "电气系统", category: "engineering", level: 88, experience: 780, maxExperience: 1000, certifications: ["电气工程师"] },
    ],
    psychologicalProfile: { morale: 82, stress: 35, mentalHealth: "stable", socialConnections: 75, sleepQuality: 78, notes: [] },
    performance: {
      tasksCompleted: 142, tasksAssigned: 145, efficiency: 92, reliability: 96, leadership: 78, teamwork: 85, innovation: 94, overallScore: 90,
      evaluations: [],
    },
    schedule: [],
  },
  {
    id: "crew-003",
    name: "王磊",
    role: "导航员",
    department: "航行",
    shift: "B",
    healthStatus: "healthy",
    location: "导航室",
    skills: [
      { id: "s5", name: "轨道计算", category: "piloting", level: 90, experience: 820, maxExperience: 1000, certifications: ["高级导航员"] },
      { id: "s6", name: "航线规划", category: "piloting", level: 86, experience: 750, maxExperience: 1000, certifications: [] },
    ],
    psychologicalProfile: { morale: 78, stress: 40, mentalHealth: "stressed", socialConnections: 65, sleepQuality: 72, notes: ["近期工作压力较大"] },
    performance: {
      tasksCompleted: 128, tasksAssigned: 135, efficiency: 88, reliability: 92, leadership: 72, teamwork: 80, innovation: 85, overallScore: 86,
      evaluations: [],
    },
    schedule: [],
  },
  {
    id: "crew-004",
    name: "陈博士",
    role: "首席科学官",
    department: "科学",
    shift: "A",
    healthStatus: "healthy",
    location: "实验室",
    skills: [
      { id: "s7", name: "生物实验", category: "science", level: 94, experience: 880, maxExperience: 1000, certifications: ["生物学博士"] },
      { id: "s8", name: "数据分析", category: "science", level: 88, experience: 760, maxExperience: 1000, certifications: [] },
    ],
    psychologicalProfile: { morale: 92, stress: 20, mentalHealth: "stable", socialConnections: 85, sleepQuality: 88, notes: [] },
    performance: {
      tasksCompleted: 135, tasksAssigned: 138, efficiency: 90, reliability: 94, leadership: 82, teamwork: 88, innovation: 96, overallScore: 91,
      evaluations: [],
    },
    schedule: [],
  },
  {
    id: "crew-005",
    name: "李研究员",
    role: "物理学家",
    department: "科学",
    shift: "B",
    healthStatus: "minor",
    location: "医疗舱",
    skills: [
      { id: "s9", name: "物理实验", category: "science", level: 88, experience: 780, maxExperience: 1000, certifications: ["物理学博士"] },
      { id: "s10", name: "仪器操作", category: "engineering", level: 82, experience: 680, maxExperience: 1000, certifications: [] },
    ],
    psychologicalProfile: { morale: 65, stress: 55, mentalHealth: "anxious", socialConnections: 60, sleepQuality: 58, notes: ["轻微辐射暴露后焦虑"] },
    performance: {
      tasksCompleted: 118, tasksAssigned: 125, efficiency: 85, reliability: 88, leadership: 70, teamwork: 75, innovation: 90, overallScore: 84,
      evaluations: [],
    },
    schedule: [],
  },
];

export const useCrewManagementStore = create<CrewManagementState>()(
  persist(
    (set, get) => ({
      crew: initialCrew,

      updateCrewMember: (id, updates) => {
        set((state) => ({
          crew: state.crew.map((c) => (c.id === id ? { ...c, ...updates } : c)),
        }));
      },

      addSkill: (crewId, skill) => {
        const newSkill: CrewSkill = {
          ...skill,
          id: `skill-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        };
        set((state) => ({
          crew: state.crew.map((c) =>
            c.id === crewId ? { ...c, skills: [...c.skills, newSkill] } : c
          ),
        }));
      },

      updateSkill: (crewId, skillId, updates) => {
        set((state) => ({
          crew: state.crew.map((c) =>
            c.id === crewId
              ? {
                  ...c,
                  skills: c.skills.map((s) => (s.id === skillId ? { ...s, ...updates } : s)),
                }
              : c
          ),
        }));
      },

      addEvaluation: (crewId, evaluation) => {
        const newEval: PerformanceEvaluation = {
          ...evaluation,
          id: `eval-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        };
        set((state) => ({
          crew: state.crew.map((c) =>
            c.id === crewId
              ? {
                  ...c,
                  performance: {
                    ...c.performance,
                    evaluations: [newEval, ...c.performance.evaluations],
                  },
                }
              : c
          ),
        }));
      },

      addScheduleEntry: (crewId, entry) => {
        const newEntry: ScheduleEntry = {
          ...entry,
          id: `sched-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        };
        set((state) => ({
          crew: state.crew.map((c) =>
            c.id === crewId ? { ...c, schedule: [...c.schedule, newEntry] } : c
          ),
        }));
      },

      updatePsychologicalProfile: (crewId, updates) => {
        set((state) => ({
          crew: state.crew.map((c) =>
            c.id === crewId
              ? {
                  ...c,
                  psychologicalProfile: { ...c.psychologicalProfile, ...updates },
                }
              : c
          ),
        }));
      },

      getCrewStats: () => {
        const { crew } = get();
        return {
          total: crew.length,
          healthy: crew.filter((c) => c.healthStatus === "healthy").length,
          injured: crew.filter((c) => c.healthStatus === "injured").length,
          avgMorale: Math.round(crew.reduce((sum, c) => sum + c.psychologicalProfile.morale, 0) / crew.length),
          avgStress: Math.round(crew.reduce((sum, c) => sum + c.psychologicalProfile.stress, 0) / crew.length),
          avgEfficiency: Math.round(crew.reduce((sum, c) => sum + c.performance.efficiency, 0) / crew.length),
        };
      },
    }),
    {
      name: "navigator-iss-crew-management",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ crew: state.crew }),
    }
  )
);
