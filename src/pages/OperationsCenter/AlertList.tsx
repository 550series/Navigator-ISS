import { memo, useState } from "react";
import { useAlertStore } from "@/stores/alertStore";
import Panel from "@/components/ui/Panel";
import { Bell, AlertTriangle, AlertCircle, Info, CheckCircle, ShieldAlert } from "lucide-react";

const levelColors: Record<string, string> = {
  critical: "border-cyber-red/40 bg-cyber-red/5 text-cyber-red",
  warning: "border-cyber-amber/40 bg-cyber-amber/5 text-cyber-amber",
  info: "border-cyber-blue/40 bg-cyber-blue/5 text-cyber-blue",
};

const categoryLabels: Record<string, string> = {
  system: "系统",
  environment: "环境",
  equipment: "设备",
  personnel: "人员",
};

const AlertList = memo(function AlertList() {
  const { alerts, acknowledgeAlert, resolveAlert } = useAlertStore();
  const [selectedAlert, setSelectedAlert] = useState<string | null>(null);
  const [resolutionText, setResolutionText] = useState("");

  const handleAcknowledge = (id: string) => {
    acknowledgeAlert(id);
  };

  const handleResolve = (id: string) => {
    if (!resolutionText.trim()) return;
    resolveAlert(id, resolutionText);
    setResolutionText("");
    setSelectedAlert(null);
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="col-span-2">
        <Panel title="告警列表" icon={<Bell size={14} />}>
          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                onClick={() => setSelectedAlert(alert.id)}
                className={`p-3 rounded border cursor-pointer transition-all duration-200 ${
                  selectedAlert === alert.id
                    ? "border-cyber-blue/50 bg-cyber-blue/5"
                    : `${levelColors[alert.level]} hover:border-cyber-blue/30`
                } ${alert.acknowledged ? "opacity-70" : ""}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-2">
                    <div className={`mt-0.5 ${alert.level === "critical" ? "text-cyber-red" : alert.level === "warning" ? "text-cyber-amber" : "text-cyber-blue"}`}>
                      {alert.level === "critical" ? <AlertCircle size={14} /> : alert.level === "warning" ? <AlertTriangle size={14} /> : <Info size={14} />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-rajdhani font-bold text-white">{alert.source}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-space-700 text-gray-400">
                          {categoryLabels[alert.category]}
                        </span>
                        {alert.acknowledged && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyber-green/10 text-cyber-green">
                            已确认
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-300">{alert.message}</div>
                      <div className="text-[10px] text-gray-500 mt-1">
                        {alert.timestamp}
                        {alert.handler && ` · 处理人: ${alert.handler}`}
                      </div>
                    </div>
                  </div>
                  {!alert.acknowledged && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAcknowledge(alert.id);
                      }}
                      className="px-2 py-1 text-[10px] rounded border border-cyber-green/30 text-cyber-green hover:bg-cyber-green/10 transition-colors"
                    >
                      确认
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div>
        {selectedAlert ? (
          <Panel title="告警详情" icon={<ShieldAlert size={14} />}>
            {(() => {
              const alert = alerts.find((a) => a.id === selectedAlert);
              if (!alert) return null;
              return (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <div className="text-[10px] text-gray-500 mb-1">级别</div>
                      <div className={`text-sm font-rajdhani font-bold ${levelColors[alert.level].split(" ").pop()}`}>
                        {alert.level === "critical" ? "严重" : alert.level === "warning" ? "警告" : "信息"}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-gray-500 mb-1">类别</div>
                      <div className="text-sm font-rajdhani text-white">{categoryLabels[alert.category]}</div>
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] text-gray-500 mb-1">信息</div>
                    <div className="text-xs text-gray-300 bg-space-900/50 p-2 rounded border border-gray-800">
                      {alert.message}
                    </div>
                  </div>

                  {!alert.resolvedAt && (
                    <div className="border-t border-gray-800 pt-3">
                      <div className="text-[10px] text-gray-500 mb-2">处理告警</div>
                      <div className="flex gap-2">
                        {!alert.acknowledged && (
                          <button
                            onClick={() => handleAcknowledge(alert.id)}
                            className="flex items-center gap-1 px-2 py-1.5 text-[10px] rounded border border-cyber-green/30 text-cyber-green hover:bg-cyber-green/10 transition-colors"
                          >
                            <CheckCircle size={10} /> 确认
                          </button>
                        )}
                        <div className="flex-1 flex gap-1">
                          <input
                            type="text"
                            value={resolutionText}
                            onChange={(e) => setResolutionText(e.target.value)}
                            placeholder="解决方案..."
                            className="flex-1 bg-space-900 border border-gray-700 text-[10px] text-gray-300 px-2 py-1.5 rounded"
                          />
                          <button
                            onClick={() => handleResolve(alert.id)}
                            disabled={!resolutionText.trim()}
                            className="px-2 py-1.5 text-[10px] rounded border border-cyber-blue/30 text-cyber-blue hover:bg-cyber-blue/10 transition-colors disabled:opacity-50"
                          >
                            解决
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          </Panel>
        ) : (
          <Panel title="告警详情" icon={<ShieldAlert size={14} />}>
            <div className="text-center text-gray-500 text-xs py-8">选择告警查看详情</div>
          </Panel>
        )}
      </div>
    </div>
  );
});

export default AlertList;
