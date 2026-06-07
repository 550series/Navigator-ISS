import { useState } from "react";
import { Bell, Wrench, ShieldAlert } from "lucide-react";
import OperationsStats from "./OperationsStats";
import AlertList from "./AlertList";
import MaintenanceOrders from "./MaintenanceOrders";
import EmergencyPlans from "./EmergencyPlans";

type TabId = "alerts" | "maintenance" | "emergency";

const tabs = [
  { id: "alerts" as const, label: "告警中心", icon: <Bell size={12} /> },
  { id: "maintenance" as const, label: "维修日志", icon: <Wrench size={12} /> },
  { id: "emergency" as const, label: "应急响应", icon: <ShieldAlert size={12} /> },
];

export default function OperationsCenter() {
  const [activeTab, setActiveTab] = useState<TabId>("alerts");

  return (
    <div className="space-y-4">
      <OperationsStats />

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

      {activeTab === "alerts" && <AlertList />}
      {activeTab === "maintenance" && <MaintenanceOrders />}
      {activeTab === "emergency" && <EmergencyPlans />}
    </div>
  );
}
