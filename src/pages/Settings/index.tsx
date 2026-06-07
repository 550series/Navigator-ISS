import { useState } from "react";
import { Settings, Gauge, AlertTriangle, Palette, Database, Info } from "lucide-react";
import SimulationSettings from "./SimulationSettings";
import EventSettings from "./EventSettings";
import DisplaySettings from "./DisplaySettings";
import DataSettings from "./DataSettings";
import AboutSettings from "./AboutSettings";

type SettingsTab = "simulation" | "events" | "display" | "data" | "about";

const tabs = [
  { id: "simulation" as const, label: "仿真控制", icon: <Gauge size={12} /> },
  { id: "events" as const, label: "事件系统", icon: <AlertTriangle size={12} /> },
  { id: "display" as const, label: "显示设置", icon: <Palette size={12} /> },
  { id: "data" as const, label: "数据管理", icon: <Database size={12} /> },
  { id: "about" as const, label: "系统信息", icon: <Info size={12} /> },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("simulation");

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Settings size={20} className="text-cyber-blue" />
        <h2 className="font-orbitron text-lg text-cyber-blue tracking-wider">系统设置</h2>
      </div>

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

      {activeTab === "simulation" && <SimulationSettings />}
      {activeTab === "events" && <EventSettings />}
      {activeTab === "display" && <DisplaySettings />}
      {activeTab === "data" && <DataSettings />}
      {activeTab === "about" && <AboutSettings />}
    </div>
  );
}
