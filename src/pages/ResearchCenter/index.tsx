import { useState } from "react";
import { FlaskConical, Globe, Telescope } from "lucide-react";
import ResearchStats from "./ResearchStats";
import ExperimentList from "./ExperimentList";
import EnvironmentPanel from "./EnvironmentPanel";
import ObservationLogs from "./ObservationLogs";

type TabId = "experiments" | "environment" | "observations";

const tabs = [
  { id: "experiments" as const, label: "实验管理", icon: <FlaskConical size={12} /> },
  { id: "environment" as const, label: "太空环境", icon: <Globe size={12} /> },
  { id: "observations" as const, label: "天文观测", icon: <Telescope size={12} /> },
];

export default function ResearchCenter() {
  const [activeTab, setActiveTab] = useState<TabId>("experiments");

  return (
    <div className="space-y-4">
      <ResearchStats />

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

      {activeTab === "experiments" && <ExperimentList />}
      {activeTab === "environment" && <EnvironmentPanel />}
      {activeTab === "observations" && <ObservationLogs />}
    </div>
  );
}
