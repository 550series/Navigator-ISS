import { useState } from "react";
import { Navigation, Map, Fuel, Globe, AlertTriangle, Sun } from "lucide-react";
import NavigationStats from "./NavigationStats";
import RouteVisualization from "./RouteVisualization";
import RoutePlanning from "./RoutePlanning";
import FuelCalculation from "./FuelCalculation";
import OrbitalMonitoring from "./OrbitalMonitoring";
import RouteRiskAssessment from "./RouteRiskAssessment";
import AstronomicalData from "./AstronomicalData";

type NavTab = "overview" | "planning" | "fuel" | "orbital" | "risk" | "astronomical";

const tabs = [
  { id: "overview" as const, label: "航线概览", icon: <Navigation size={12} /> },
  { id: "planning" as const, label: "航线规划", icon: <Map size={12} /> },
  { id: "fuel" as const, label: "燃料计算", icon: <Fuel size={12} /> },
  { id: "orbital" as const, label: "轨道监测", icon: <Globe size={12} /> },
  { id: "risk" as const, label: "风险评估", icon: <AlertTriangle size={12} /> },
  { id: "astronomical" as const, label: "天文数据", icon: <Sun size={12} /> },
];

export default function NavigationPage() {
  const [activeTab, setActiveTab] = useState<NavTab>("overview");

  return (
    <div className="space-y-4">
      <NavigationStats />

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

      {activeTab === "overview" && <RouteVisualization />}
      {activeTab === "planning" && <RoutePlanning />}
      {activeTab === "fuel" && <FuelCalculation />}
      {activeTab === "orbital" && <OrbitalMonitoring />}
      {activeTab === "risk" && <RouteRiskAssessment />}
      {activeTab === "astronomical" && <AstronomicalData />}
    </div>
  );
}
