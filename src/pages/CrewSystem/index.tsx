import { useState } from "react";
import { Users, Award, Brain, TrendingUp, Clock } from "lucide-react";
import CrewStats from "./CrewStats";
import CrewRoster from "./CrewRoster";
import SkillMatrix from "./SkillMatrix";
import PsychologyPanel from "./PsychologyPanel";
import PerformanceRanking from "./PerformanceRanking";
import ScheduleTable from "./ScheduleTable";

type TabId = "roster" | "skills" | "psychology" | "performance" | "schedule";

const tabs = [
  { id: "roster" as const, label: "船员花名册", icon: <Users size={12} /> },
  { id: "skills" as const, label: "技能管理", icon: <Award size={12} /> },
  { id: "psychology" as const, label: "心理健康", icon: <Brain size={12} /> },
  { id: "performance" as const, label: "绩效追踪", icon: <TrendingUp size={12} /> },
  { id: "schedule" as const, label: "排班管理", icon: <Clock size={12} /> },
];

export default function CrewSystem() {
  const [activeTab, setActiveTab] = useState<TabId>("roster");

  return (
    <div className="space-y-4">
      <CrewStats />

      <div className="flex gap-1 bg-space-800/50 p-1 rounded-lg border border-cyber-blue/10">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md transition-all duration-200 font-rajdhani font-medium ${
              activeTab === tab.id
                ? "bg-cyber-blue/10 text-cyber-blue border border-cyber-blue/30"
                : "text-gray-400 hover:text-cyber-blue hover:bg-cyber-blue/5 border border-transparent"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "roster" && <CrewRoster />}
      {activeTab === "skills" && <SkillMatrix />}
      {activeTab === "psychology" && <PsychologyPanel />}
      {activeTab === "performance" && <PerformanceRanking />}
      {activeTab === "schedule" && <ScheduleTable />}
    </div>
  );
}
