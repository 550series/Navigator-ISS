import { useState } from "react";
import { Package, TrendingDown, Truck, PieChart } from "lucide-react";
import ResourceStats from "./ResourceStats";
import ResourceForecast from "./ResourceForecast";
import SupplyPlanning from "./SupplyPlanning";
import ResourceAllocation from "./ResourceAllocation";
import ResourceDetails from "./ResourceDetails";

type ResourceTab = "overview" | "forecast" | "supply" | "allocation";

const tabs = [
  { id: "overview" as const, label: "资源概览", icon: <Package size={12} /> },
  { id: "forecast" as const, label: "消耗预测", icon: <TrendingDown size={12} /> },
  { id: "supply" as const, label: "补给计划", icon: <Truck size={12} /> },
  { id: "allocation" as const, label: "分配与回收", icon: <PieChart size={12} /> },
];

export default function ResourcesPage() {
  const [activeTab, setActiveTab] = useState<ResourceTab>("overview");

  return (
    <div className="space-y-4">
      <ResourceStats />

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

      {activeTab === "overview" && <ResourceDetails />}
      {activeTab === "forecast" && <ResourceForecast />}
      {activeTab === "supply" && <SupplyPlanning />}
      {activeTab === "allocation" && <ResourceAllocation />}
    </div>
  );
}
