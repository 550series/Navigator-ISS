import { memo } from "react";
import { useResourceStore } from "@/stores/resourceStore";
import Panel from "@/components/ui/Panel";
import ProgressBar from "@/components/ui/ProgressBar";
import { PieChart, Recycle, Droplets, Wind, Trash, Zap } from "lucide-react";
import { formatNumber } from "@/utils/formatters";

const recyclingIcons = {
  water: Droplets,
  air: Wind,
  waste: Trash,
  energy: Zap,
};

const recyclingLabels = {
  water: "水循环",
  air: "空气循环",
  waste: "废物处理",
  energy: "能量回收",
};

const ResourceAllocation = memo(function ResourceAllocation() {
  const { allocations, recyclingSystems } = useResourceStore();

  return (
    <div className="grid grid-cols-2 gap-4">
      <Panel title="资源分配" icon={<PieChart size={14} />}>
        <div className="space-y-3">
          {allocations.map((alloc) => (
            <div key={alloc.id} className="p-3 rounded border border-gray-800">
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs font-rajdhani font-bold text-white">{alloc.systemName}</div>
                <div className="text-[10px] text-gray-500">{alloc.resourceName}</div>
              </div>
              <div className="mb-1">
                <div className="flex justify-between text-[10px] mb-1">
                  <span className="text-gray-500">使用量</span>
                  <span className="text-gray-400">{alloc.used}/{alloc.allocated}</span>
                </div>
                <ProgressBar value={alloc.used} max={alloc.allocated} showPercent={false} height={4} />
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="text-gray-500">效率</span>
                <span className={alloc.efficiency >= 90 ? "text-cyber-green" : alloc.efficiency >= 70 ? "text-cyber-amber" : "text-cyber-red"}>
                  {formatNumber(alloc.efficiency, 1)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="回收系统" icon={<Recycle size={14} />}>
        <div className="space-y-3">
          {recyclingSystems.map((system) => {
            const Icon = recyclingIcons[system.type];
            return (
              <div key={system.id} className="p-3 rounded border border-gray-800">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    system.status === "active" ? "bg-cyber-green/10" : "bg-gray-800"
                  }`}>
                    <Icon size={16} className={system.status === "active" ? "text-cyber-green" : "text-gray-500"} />
                  </div>
                  <div>
                    <div className="text-xs font-rajdhani font-bold text-white">{recyclingLabels[system.type]}</div>
                    <div className="text-[10px] text-gray-500">
                      {system.status === "active" ? "运行中" : system.status === "maintenance" ? "维护中" : "离线"}
                    </div>
                  </div>
                </div>
                <div className="mb-1">
                  <div className="flex justify-between text-[10px] mb-1">
                    <span className="text-gray-500">效率</span>
                    <span className={system.efficiency >= 80 ? "text-cyber-green" : system.efficiency >= 60 ? "text-cyber-amber" : "text-cyber-red"}>
                      {formatNumber(system.efficiency, 1)}%
                    </span>
                  </div>
                  <ProgressBar value={system.efficiency} max={100} showPercent={false} height={4} />
                </div>
                <div className="flex justify-between text-[10px]">
                  <span className="text-gray-500">输入/输出</span>
                  <span className="text-gray-400">{system.inputAmount}/{system.outputAmount}</span>
                </div>
              </div>
            );
          })}
        </div>
      </Panel>
    </div>
  );
});

export default ResourceAllocation;
