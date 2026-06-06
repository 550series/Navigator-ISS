import { useResourceStore } from "@/stores/resourceStore";
import Panel from "@/components/ui/Panel";
import ProgressBar from "@/components/ui/ProgressBar";
import StatusCard from "@/components/ui/StatusCard";
import { formatNumber, getStatusColor, getStatusBgColor } from "@/utils/formatters";
import { Package, Users, Cpu, AlertTriangle } from "lucide-react";
import { useState } from "react";

const categories = ["全部", "食物", "水", "医疗", "备件", "能源", "气体"];

/** 资源管理页面 */
export default function Resources() {
  const { resources, personnel, equipment } = useResourceStore();
  const [selectedCategory, setSelectedCategory] = useState("全部");

  const filteredResources =
    selectedCategory === "全部"
      ? resources
      : resources.filter((r) => r.category === selectedCategory);

  const lowResources = resources.filter((r) => r.alertLevel !== "normal").length;
  const operationalEquipment = equipment.filter((e) => e.status === "operational").length;

  return (
    <div className="space-y-4">
      {/* 概览卡片 */}
      <div className="grid grid-cols-4 gap-4">
        <StatusCard title="物资类别" value={new Set(resources.map((r) => r.category)).size} unit="类" icon={<Package size={16} />} />
        <StatusCard title="低库存物资" value={lowResources} unit="项" icon={<AlertTriangle size={16} />} status={lowResources > 0 ? "warning" : "normal"} />
        <StatusCard title="在站人员" value={personnel.length} unit="人" icon={<Users size={16} />} />
        <StatusCard title="设备运行率" value={formatNumber((operationalEquipment / equipment.length) * 100, 0)} unit="%" icon={<Cpu size={16} />} />
      </div>

      {/* 物资储备 */}
      <Panel title="物资储备" icon={<Package size={14} />}>
        {/* 分类筛选 */}
        <div className="flex gap-2 mb-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 text-xs rounded border transition-colors font-rajdhani ${
                selectedCategory === cat
                  ? "border-cyber-blue/50 bg-cyber-blue/10 text-cyber-blue"
                  : "border-gray-700 text-gray-400 hover:border-cyber-blue/30 hover:text-gray-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-3">
          {filteredResources.map((resource) => (
            <div
              key={resource.id}
              className={`rounded border p-3 ${getStatusBgColor(resource.alertLevel)} transition-all duration-300`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-300 font-rajdhani font-medium">{resource.name}</span>
                <span className={`text-[10px] font-bold uppercase ${getStatusColor(resource.alertLevel)}`}>
                  {resource.alertLevel === "normal" ? "正常" : resource.alertLevel === "low" ? "偏低" : "紧急"}
                </span>
              </div>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-lg font-orbitron font-bold text-white">{formatNumber(resource.quantity, 0)}</span>
                <span className="text-xs text-gray-500">/ {formatNumber(resource.capacity, 0)} {resource.unit}</span>
              </div>
              <ProgressBar value={resource.quantity} max={resource.capacity} height={4} />
              <div className="text-[10px] text-gray-600 mt-1">
                消耗速率: {resource.consumptionRate} {resource.unit}/天
              </div>
            </div>
          ))}
        </div>
      </Panel>

      {/* 人员 + 设备 */}
      <div className="grid grid-cols-2 gap-4">
        <Panel title="人员状态" icon={<Users size={14} />}>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {personnel.map((p) => (
              <div key={p.id} className="flex items-center gap-3 text-xs px-2 py-1.5 rounded border border-gray-800/50 hover:border-cyber-blue/20 transition-colors">
                <div className={`w-2 h-2 rounded-full ${
                  p.healthStatus === "healthy" ? "bg-cyber-green" : p.healthStatus === "minor" ? "bg-cyber-amber" : "bg-cyber-red"
                }`} />
                <span className="text-gray-200 font-rajdhani font-medium w-16">{p.name}</span>
                <span className="text-gray-500 flex-1">{p.role}</span>
                <span className="text-gray-600">{p.department}</span>
                <span className="text-gray-600">班次 {p.shift}</span>
                <span className="text-gray-600">{p.location}</span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="设备管理" icon={<Cpu size={14} />}>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {equipment.map((e) => (
              <div key={e.id} className="flex items-center gap-3 text-xs px-2 py-1.5 rounded border border-gray-800/50 hover:border-cyber-blue/20 transition-colors">
                <div className={`w-2 h-2 rounded-full ${
                  e.status === "operational" ? "bg-cyber-green" : e.status === "degraded" ? "bg-cyber-amber" : "bg-cyber-red"
                }`} />
                <span className="text-gray-200 font-rajdhani font-medium flex-1">{e.name}</span>
                <span className="text-gray-600">{e.location}</span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] border ${getStatusBgColor(e.status)}`}>
                  {e.status === "operational" ? "运行中" : e.status === "degraded" ? "降级" : "离线"}
                </span>
                <span className="text-gray-600">下次维护: {e.nextMaintenance}</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
