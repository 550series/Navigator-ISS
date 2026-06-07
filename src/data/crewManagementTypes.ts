export interface CrewSkill {
  id: string;
  name: string;
  category: "engineering" | "science" | "medical" | "piloting" | "command";
  level: number; // 1-100
  experience: number;
  maxExperience: number;
  certifications: string[];
}

export interface CrewMember {
  id: string;
  name: string;
  role: string;
  department: string;
  shift: "A" | "B" | "C";
  healthStatus: "healthy" | "minor" | "injured";
  location: string;
  skills: CrewSkill[];
  psychologicalProfile: PsychologicalProfile;
  performance: PerformanceMetrics;
  schedule: ScheduleEntry[];
}

export interface PsychologicalProfile {
  morale: number; // 0-100
  stress: number; // 0-100
  mentalHealth: "stable" | "stressed" | "anxious" | "depressed";
  socialConnections: number; // 0-100
  sleepQuality: number; // 0-100
  notes: string[];
}

export interface PerformanceMetrics {
  tasksCompleted: number;
  tasksAssigned: number;
  efficiency: number; // 0-100
  reliability: number; // 0-100
  leadership: number; // 0-100
  teamwork: number; // 0-100
  innovation: number; // 0-100
  overallScore: number; // 0-100
  evaluations: PerformanceEvaluation[];
}

export interface PerformanceEvaluation {
  id: string;
  date: string;
  evaluator: string;
  score: number;
  strengths: string[];
  areasForImprovement: string[];
  comments: string;
}

export interface ScheduleEntry {
  id: string;
  date: string;
  shift: "A" | "B" | "C";
  startTime: string;
  endTime: string;
  task: string;
  location: string;
  status: "scheduled" | "in_progress" | "completed" | "missed";
}

export interface CrewManagementState {
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
