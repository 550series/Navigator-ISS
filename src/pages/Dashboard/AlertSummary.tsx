import { memo } from "react";
import { useStationStore } from "@/stores/stationStore";
import Panel from "@/components/ui/Panel";
import { getAlertLevelColor } from "@/utils/formatters";
import { AlertTriangle } from "lucide-react";

const AlertSummary = memo(function AlertSummary() {
  const alerts = useStationStore((s) => s.alerts);

  return (
    <Panel title="系统告警" icon={<AlertTriangle size={14} />} alert={alerts.some((a) => a.level === "critical" && !a.acknowledged)}>
      <div className="space-y-2 max-h-40 overflow-y-auto">
        {alerts.slice(0, 5).map((alert) => (
          <div
            key={alert.id}
            className={`flex items-start gap-2 text-xs px-2 py-1.5 rounded border ${
              alert.level === "critical"
                ? "border-cyber-red/20 bg-cyber-red/5"
                : alert.level === "warning"
                ? "border-cyber-amber/20 bg-cyber-amber/5"
                : "border-cyber-blue/20 bg-cyber-blue/5"
            }`}
          >
            <span className={`font-bold ${getAlertLevelColor(alert.level)}`}>
              {alert.level === "critical" ? "!!" : alert.level === "warning" ? "!" : "i"}
            </span>
            <div className="flex-1">
              <span className="text-gray-300">{alert.message}</span>
              <div className="text-gray-600 text-[10px] mt-0.5">{alert.source} | {alert.timestamp}</div>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
});

export default AlertSummary;
