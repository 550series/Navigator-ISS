import { memo, useState } from "react";
import { useNavigationStore } from "@/stores/navigationStore";
import Panel from "@/components/ui/Panel";
import ProgressBar from "@/components/ui/ProgressBar";
import { Map, Plus, Check, Clock, AlertTriangle } from "lucide-react";
import { formatNumber } from "@/utils/formatters";

const riskColors = {
  low: "text-cyber-green",
  medium: "text-cyber-amber",
  high: "text-cyber-red",
  critical: "text-cyber-red",
};

const riskLabels = {
  low: "低",
  medium: "中等",
  high: "高",
  critical: "危急",
};

const statusLabels = {
  draft: "草稿",
  approved: "已批准",
  active: "执行中",
  completed: "已完成",
};

const statusColors = {
  draft: "text-gray-400",
  approved: "text-cyber-blue",
  active: "text-cyber-green",
  completed: "text-gray-500",
};

const RoutePlanning = memo(function RoutePlanning() {
  const { routePlans, updateRoutePlan, calculateFuel } = useNavigationStore();
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const selected = routePlans.find((r) => r.id === selectedRoute);
  const fuelCalc = selected ? calculateFuel(selected.id) : null;

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="col-span-2">
        <Panel
          title="航线规划"
          icon={<Map size={14} />}
          action={
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-1 px-2 py-1 text-[10px] rounded border border-cyber-blue/30 text-cyber-blue hover:bg-cyber-blue/10 transition-colors"
            >
              <Plus size={10} /> 新建航线
            </button>
          }
        >
          <div className="space-y-2">
            {routePlans.map((route) => (
              <div
                key={route.id}
                onClick={() => setSelectedRoute(route.id)}
                className={`p-3 rounded border cursor-pointer transition-all duration-200 ${
                  selectedRoute === route.id
                    ? "border-cyber-blue/50 bg-cyber-blue/5"
                    : "border-gray-800 hover:border-cyber-blue/30"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-rajdhani font-bold text-white">{route.name}</span>
                      <span className={`text-[10px] ${statusColors[route.status]}`}>
                        {statusLabels[route.status]}
                      </span>
                      <span className={`text-[10px] ${riskColors[route.riskLevel]}`}>
                        风险: {riskLabels[route.riskLevel]}
                      </span>
                    </div>
                    <div className="text-[10px] text-gray-500">
                      {route.origin} → {route.destination}
                    </div>
                    <div className="flex gap-3 mt-1 text-[10px] text-gray-400">
                      <span>距离: {formatNumber(route.distance, 2)} ly</span>
                      <span>预计: {route.estimatedTime} 天</span>
                      <span>燃料: {route.fuelRequired}%</span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {route.status === "draft" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateRoutePlan(route.id, { status: "approved" });
                        }}
                        className="p-1 text-[10px] rounded border border-cyber-green/30 text-cyber-green hover:bg-cyber-green/10"
                      >
                        <Check size={10} />
                      </button>
                    )}
                    {route.status === "approved" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateRoutePlan(route.id, { status: "active" });
                        }}
                        className="p-1 text-[10px] rounded border border-cyber-blue/30 text-cyber-blue hover:bg-cyber-blue/10"
                      >
                        <Clock size={10} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div>
        {selected ? (
          <Panel title="航线详情" icon={<Map size={14} />}>
            <div className="space-y-3">
              <div>
                <div className="text-xs font-rajdhani font-bold text-white mb-1">{selected.name}</div>
                <div className="text-[10px] text-gray-500">{selected.origin} → {selected.destination}</div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-space-900/50 p-2 rounded border border-gray-800">
                  <div className="text-[10px] text-gray-500">总距离</div>
                  <div className="text-sm font-rajdhani text-white">{formatNumber(selected.distance, 2)} ly</div>
                </div>
                <div className="bg-space-900/50 p-2 rounded border border-gray-800">
                  <div className="text-[10px] text-gray-500">预计时间</div>
                  <div className="text-sm font-rajdhani text-white">{selected.estimatedTime} 天</div>
                </div>
              </div>

              <div>
                <div className="text-[10px] text-gray-500 mb-1">航点列表</div>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {selected.waypoints.map((wp, i) => (
                    <div key={wp.id} className="flex items-center gap-2 text-[10px] p-1.5 rounded bg-space-900/30">
                      <span className="text-cyber-blue">{i + 1}.</span>
                      <span className="text-gray-300 flex-1">{wp.name}</span>
                      <span className="text-gray-500">{wp.fuelConsumption}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {fuelCalc && (
                <div>
                  <div className="text-[10px] text-gray-500 mb-1">燃料计算</div>
                  <div className="space-y-1">
                    <ProgressBar value={fuelCalc.currentFuel} max={100} label="当前燃料" />
                    <ProgressBar value={fuelCalc.projectedConsumption} max={100} label="预计消耗" />
                    <div className="flex justify-between text-[10px]">
                      <span className="text-gray-500">储备燃料</span>
                      <span className={fuelCalc.reserveFuel < 10 ? "text-cyber-red" : "text-cyber-green"}>
                        {formatNumber(fuelCalc.reserveFuel, 1)}%
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {selected.riskLevel === "high" || selected.riskLevel === "critical" ? (
                <div className="p-2 rounded border border-cyber-red/20 bg-cyber-red/5">
                  <div className="flex items-center gap-1 text-[10px] text-cyber-red font-rajdhani font-bold">
                    <AlertTriangle size={10} /> 高风险航线
                  </div>
                  <div className="text-[10px] text-gray-400 mt-1">
                    此航线经过多个危险区域，请确保所有系统状态良好
                  </div>
                </div>
              ) : null}
            </div>
          </Panel>
        ) : (
          <Panel title="航线详情" icon={<Map size={14} />}>
            <div className="text-center text-gray-500 text-xs py-8">选择航线查看详情</div>
          </Panel>
        )}
      </div>
    </div>
  );
});

export default RoutePlanning;
