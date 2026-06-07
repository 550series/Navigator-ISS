import { memo } from "react";
import { useResourceStore } from "@/stores/resourceStore";
import Panel from "@/components/ui/Panel";
import ProgressBar from "@/components/ui/ProgressBar";
import { TrendingDown, AlertTriangle, Clock, ArrowDown } from "lucide-react";
import { formatNumber } from "@/utils/formatters";

const actionLabels = {
  none: "无需操作",
  monitor: "持续监控",
  reduce: "减少消耗",
  resupply: "需要补给",
};

const actionColors = {
  none: "text-cyber-green",
  monitor: "text-cyber-blue",
  reduce: "text-cyber-amber",
  resupply: "text-cyber-red",
};

const ResourceForecast = memo(function ResourceForecast() {
  const getForecasts = useResourceStore((s) => s.getForecasts);
  const forecasts = getForecasts();

  const criticalForecasts = forecasts.filter((f) => f.recommendedAction === "resupply");

  return (
    <Panel
      title="资源消耗预测"
      icon={<TrendingDown size={14} />}
      alert={criticalForecasts.length > 0}
    >
      <div className="space-y-3">
        {criticalForecasts.length > 0 && (
          <div className="p-2 rounded border border-cyber-red/20 bg-cyber-red/5">
            <div className="flex items-center gap-1 text-[10px] text-cyber-red font-rajdhani font-bold">
              <AlertTriangle size={10} /> {criticalForecasts.length} 项物资即将耗尽
            </div>
          </div>
        )}

        <div className="space-y-2 max-h-80 overflow-y-auto">
          {forecasts.map((forecast) => (
            <div
              key={forecast.resourceId}
              className="p-3 rounded border border-gray-800 hover:border-cyber-blue/20 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="text-xs font-rajdhani font-bold text-white">{forecast.resourceName}</div>
                  <div className="text-[10px] text-gray-500">
                    当前: {formatNumber(forecast.currentLevel, 0)}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-[10px] font-rajdhani font-bold ${actionColors[forecast.recommendedAction]}`}>
                    {actionLabels[forecast.recommendedAction]}
                  </div>
                </div>
              </div>

              <div className="mb-2">
                <div className="flex justify-between text-[10px] mb-1">
                  <span className="text-gray-500">当前水平</span>
                  <span className="text-gray-400">{formatNumber(forecast.currentLevel, 0)}</span>
                </div>
                <ProgressBar value={forecast.currentLevel} max={100} showPercent={false} height={4} />
              </div>

              <div className="flex items-center gap-2 text-[10px]">
                <div className="flex items-center gap-1 text-gray-500">
                  <Clock size={10} />
                  <span>预计耗尽: </span>
                </div>
                <span className={forecast.daysUntilDepletion < 7 ? "text-cyber-red" : forecast.daysUntilDepletion < 14 ? "text-cyber-amber" : "text-cyber-green"}>
                  {forecast.daysUntilDepletion} 天
                </span>
                <div className="flex items-center gap-1 text-gray-500 ml-2">
                  <ArrowDown size={10} />
                  <span>30天后: </span>
                </div>
                <span className="text-gray-400">{formatNumber(forecast.projectedLevel, 0)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
});

export default ResourceForecast;
