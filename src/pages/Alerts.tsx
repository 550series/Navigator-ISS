import { useAlertStore } from "@/stores/alertStore";
import Panel from "@/components/ui/Panel";
import StatusCard from "@/components/ui/StatusCard";
import { AlertTriangle, Bell, CheckCircle, Filter, AlertCircle, Info, Shield } from "lucide-react";
import { useState } from "react";
import type { AlertDetail } from "@/data/types";

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

function getLevelIcon(level: string) {
  switch (level) {
    case "critical": return <AlertCircle size={14} />;
    case "warning": return <AlertTriangle size={14} />;
    default: return <Info size={14} />;
  }
}

export default function Alerts() {
  const { alerts, filter, setFilter, acknowledgeAlert, resolveAlert, clearResolved } = useAlertStore();
  const [selectedAlert, setSelectedAlert] = useState<string | null>(null);
  const [showFilter, setShowFilter] = useState(false);
  const [resolutionText, setResolutionText] = useState("");

  const getStats = useAlertStore((s) => s.getStats);
  const getFilteredAlerts = useAlertStore((s) => s.getFilteredAlerts);
  
  const stats = getStats();
  const filteredAlerts = getFilteredAlerts();
  const selected = alerts.find((a) => a.id === selectedAlert) as AlertDetail | undefined;

  const handleAcknowledge = (id: string) => {
    acknowledgeAlert(id);
  };

  const handleResolve = (id: string) => {
    if (!resolutionText.trim()) return;
    resolveAlert(id, resolutionText);
    setResolutionText("");
    setSelectedAlert(null);
  };

  const toggleFilter = (type: "level" | "category" | "status", value: string) => {
    const current = filter[type];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    setFilter({ [type]: updated });
  };

  return (
    <div className="space-y-4">
      {/* 顶部统计 */}
      <div className="grid grid-cols-5 gap-4">
        <StatusCard
          title="总告警数"
          value={stats.total}
          icon={<Bell size={16} />}
        />
        <StatusCard
          title="未确认"
          value={stats.unacknowledged}
          icon={<AlertTriangle size={16} />}
          status={stats.unacknowledged > 0 ? "warning" : "normal"}
        />
        <StatusCard
          title="严重告警"
          value={stats.critical}
          icon={<AlertCircle size={16} />}
          status={stats.critical > 0 ? "critical" : "normal"}
        />
        <StatusCard
          title="警告"
          value={stats.warning}
          icon={<AlertTriangle size={16} />}
          status={stats.warning > 0 ? "warning" : "normal"}
        />
        <StatusCard
          title="已解决"
          value={stats.resolved}
          icon={<CheckCircle size={16} />}
          status="normal"
        />
      </div>

      {/* 筛选和操作栏 */}
      <Panel title="告警列表" icon={<Bell size={14} />}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilter(!showFilter)}
              className={`flex items-center gap-1 px-3 py-1.5 text-xs rounded border transition-colors font-rajdhani ${
                showFilter
                  ? "border-cyber-blue/40 text-cyber-blue bg-cyber-blue/10"
                  : "border-gray-700 text-gray-400 hover:border-cyber-blue/30"
              }`}
            >
              <Filter size={12} /> 筛选
            </button>
            <button
              onClick={clearResolved}
              className="px-3 py-1.5 text-xs rounded border border-gray-700 text-gray-400 hover:border-cyber-amber/30 hover:text-cyber-amber transition-colors font-rajdhani"
            >
              清除已解决
            </button>
          </div>
          <div className="text-xs text-gray-500 font-rajdhani">
            显示 {filteredAlerts.length} / {alerts.length} 条告警
          </div>
        </div>

        {/* 筛选面板 */}
        {showFilter && (
          <div className="mb-4 p-3 bg-space-900/50 rounded border border-gray-800">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-[10px] text-gray-500 mb-2">级别</div>
                <div className="flex flex-wrap gap-1">
                  {["critical", "warning", "info"].map((level) => (
                    <button
                      key={level}
                      onClick={() => toggleFilter("level", level)}
                      className={`px-2 py-1 text-[10px] rounded border transition-colors ${
                        filter.level.includes(level)
                          ? levelColors[level]
                          : "border-gray-700 text-gray-500"
                      }`}
                    >
                      {level === "critical" ? "严重" : level === "warning" ? "警告" : "信息"}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-gray-500 mb-2">类别</div>
                <div className="flex flex-wrap gap-1">
                  {["system", "environment", "equipment", "personnel"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => toggleFilter("category", cat)}
                      className={`px-2 py-1 text-[10px] rounded border transition-colors ${
                        filter.category.includes(cat)
                          ? "border-cyber-blue/40 bg-cyber-blue/5 text-cyber-blue"
                          : "border-gray-700 text-gray-500"
                      }`}
                    >
                      {categoryLabels[cat]}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-gray-500 mb-2">状态</div>
                <div className="flex flex-wrap gap-1">
                  {["unacknowledged", "acknowledged", "resolved", "unresolved"].map((status) => (
                    <button
                      key={status}
                      onClick={() => toggleFilter("status", status)}
                      className={`px-2 py-1 text-[10px] rounded border transition-colors ${
                        filter.status.includes(status)
                          ? "border-cyber-green/40 bg-cyber-green/5 text-cyber-green"
                          : "border-gray-700 text-gray-500"
                      }`}
                    >
                      {status === "unacknowledged" ? "未确认" : 
                       status === "acknowledged" ? "已确认" :
                       status === "resolved" ? "已解决" : "未解决"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 告警列表 */}
        <div className="space-y-2 max-h-[500px] overflow-y-auto">
          {filteredAlerts.map((alert) => (
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
                    {getLevelIcon(alert.level)}
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
                      {alert.resolvedAt && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyber-blue/10 text-cyber-blue">
                          已解决
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

      {/* 告警详情 */}
      {selected && (
        <Panel title="告警详情" icon={<Shield size={14} />}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-[10px] text-gray-500 mb-1">告警级别</div>
                <div className={`text-sm font-rajdhani font-bold ${
                  selected.level === "critical" ? "text-cyber-red" : 
                  selected.level === "warning" ? "text-cyber-amber" : "text-cyber-blue"
                }`}>
                  {selected.level === "critical" ? "严重" : selected.level === "warning" ? "警告" : "信息"}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-gray-500 mb-1">告警类别</div>
                <div className="text-sm font-rajdhani text-white">{categoryLabels[selected.category]}</div>
              </div>
              <div>
                <div className="text-[10px] text-gray-500 mb-1">告警来源</div>
                <div className="text-sm font-rajdhani text-white">{selected.source}</div>
              </div>
              <div>
                <div className="text-[10px] text-gray-500 mb-1">告警时间</div>
                <div className="text-sm font-rajdhani text-white">{selected.timestamp}</div>
              </div>
            </div>

            <div>
              <div className="text-[10px] text-gray-500 mb-1">告警信息</div>
              <div className="text-xs text-gray-300 bg-space-900/50 p-3 rounded border border-gray-800">
                {selected.message}
              </div>
            </div>

            {selected.relatedEquipment && selected.relatedEquipment.length > 0 && (
              <div>
                <div className="text-[10px] text-gray-500 mb-1">相关设备</div>
                <div className="flex flex-wrap gap-1">
                  {selected.relatedEquipment.map((eq) => (
                    <span key={eq} className="text-[10px] px-2 py-1 rounded bg-space-700 text-gray-400">
                      {eq}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {selected.handler && (
              <div>
                <div className="text-[10px] text-gray-500 mb-1">处理人</div>
                <div className="text-sm font-rajdhani text-white">{selected.handler}</div>
              </div>
            )}

            {selected.resolvedAt && (
              <div>
                <div className="text-[10px] text-gray-500 mb-1">解决方案</div>
                <div className="text-xs text-gray-300 bg-space-900/50 p-3 rounded border border-gray-800">
                  {selected.resolution}
                </div>
                <div className="text-[10px] text-gray-500 mt-1">解决时间: {selected.resolvedAt}</div>
              </div>
            )}

            {/* 操作按钮 */}
            {!selected.resolvedAt && (
              <div className="border-t border-gray-800 pt-4">
                <div className="text-[10px] text-gray-500 mb-2">处理告警</div>
                <div className="flex gap-2">
                  {!selected.acknowledged && (
                    <button
                      onClick={() => handleAcknowledge(selected.id)}
                      className="flex items-center gap-1 px-3 py-2 text-xs rounded border border-cyber-green/30 text-cyber-green hover:bg-cyber-green/10 transition-colors font-rajdhani"
                    >
                      <CheckCircle size={12} /> 确认告警
                    </button>
                  )}
                  <div className="flex-1 flex gap-2">
                    <input
                      type="text"
                      value={resolutionText}
                      onChange={(e) => setResolutionText(e.target.value)}
                      placeholder="输入解决方案..."
                      className="flex-1 bg-space-900 border border-gray-700 text-xs text-gray-300 px-3 py-2 rounded"
                    />
                    <button
                      onClick={() => handleResolve(selected.id)}
                      disabled={!resolutionText.trim()}
                      className="px-3 py-2 text-xs rounded border border-cyber-blue/30 text-cyber-blue hover:bg-cyber-blue/10 transition-colors font-rajdhani disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      解决
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Panel>
      )}
    </div>
  );
}
