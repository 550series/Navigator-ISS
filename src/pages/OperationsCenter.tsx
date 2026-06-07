import { useState } from "react";
import { ShieldAlert, Bell, Wrench, AlertTriangle, CheckCircle, Clock, AlertCircle, Info, Play, Square, Siren } from "lucide-react";
import { useAlertStore } from "@/stores/alertStore";
import { useMaintenanceStore } from "@/stores/maintenanceStore";
import { useEmergencyStore } from "@/stores/emergencyStore";
import Panel from "@/components/ui/Panel";
import StatusCard from "@/components/ui/StatusCard";
import ProgressBar from "@/components/ui/ProgressBar";

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

const statusColors: Record<string, string> = {
  scheduled: "border-cyber-blue/30 bg-cyber-blue/5 text-cyber-blue",
  in_progress: "border-cyber-amber/30 bg-cyber-amber/5 text-cyber-amber",
  completed: "border-cyber-green/30 bg-cyber-green/5 text-cyber-green",
  overdue: "border-cyber-red/30 bg-cyber-red/5 text-cyber-red",
};

const statusLabels: Record<string, string> = {
  scheduled: "计划中",
  in_progress: "进行中",
  completed: "已完成",
  overdue: "已逾期",
};

const typeLabels: Record<string, string> = {
  fire: "火灾",
  decompression: "失压",
  radiation: "辐射",
  medical: "医疗",
  system_failure: "系统故障",
};

export default function OperationsCenter() {
  const { alerts, acknowledgeAlert, resolveAlert, getStats: getAlertStats } = useAlertStore();
  const { records, spareParts, getStats: getMaintenanceStats } = useMaintenanceStore();
  const { plans, activePlanId, activatePlan, deactivatePlan, completeStep, getStats: getEmergencyStats } = useEmergencyStore();

  const [activeTab, setActiveTab] = useState<"alerts" | "maintenance" | "emergency">("alerts");
  const [selectedAlert, setSelectedAlert] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [resolutionText, setResolutionText] = useState("");

  const alertStats = getAlertStats();
  const maintenanceStats = getMaintenanceStats();
  const emergencyStats = getEmergencyStats();

  const activePlan = plans.find((p) => p.id === activePlanId);
  const allStepsCompleted = activePlan?.steps.every((s) => s.completed) ?? false;

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
    <div className="space-y-4">
      {/* 顶部统计 */}
      <div className="grid grid-cols-6 gap-4">
        <StatusCard title="未确认告警" value={alertStats.unacknowledged} icon={<Bell size={16} />} status={alertStats.unacknowledged > 0 ? "warning" : "normal"} />
        <StatusCard title="严重告警" value={alertStats.critical} icon={<AlertCircle size={16} />} status={alertStats.critical > 0 ? "critical" : "normal"} />
        <StatusCard title="维修工单" value={maintenanceStats.totalRecords} icon={<Wrench size={16} />} />
        <StatusCard title="进行中" value={maintenanceStats.inProgress} icon={<Clock size={16} />} status={maintenanceStats.inProgress > 0 ? "warning" : "normal"} />
        <StatusCard title="应急预案" value={emergencyStats.totalPlans} icon={<ShieldAlert size={16} />} />
        <StatusCard title="应急状态" value={emergencyStats.activePlan ? "激活" : "正常"} icon={<Siren size={16} />} status={emergencyStats.activePlan ? "critical" : "normal"} />
      </div>

      {/* 二级导航 */}
      <div className="flex gap-1 bg-space-800/50 p-1 rounded-lg border border-cyber-blue/10">
        {[
          { id: "alerts", label: "告警中心", icon: <Bell size={12} /> },
          { id: "maintenance", label: "维修日志", icon: <Wrench size={12} /> },
          { id: "emergency", label: "应急响应", icon: <ShieldAlert size={12} /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
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

      {/* 告警中心 */}
      {activeTab === "alerts" && (
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
      )}

      {/* 维修日志 */}
      {activeTab === "maintenance" && (
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <Panel title="维修工单" icon={<Wrench size={14} />}>
              <div className="space-y-2">
                {records.map((record) => (
                  <div key={record.id} className="p-3 rounded border border-gray-800 hover:border-cyber-blue/30 transition-colors">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-rajdhani font-bold text-white">{record.equipmentName}</span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded ${statusColors[record.status]}`}>
                            {statusLabels[record.status]}
                          </span>
                        </div>
                        <div className="text-xs text-gray-300">{record.description}</div>
                        <div className="text-[10px] text-gray-500 mt-1">
                          {record.scheduledDate} · {record.assignee}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Panel>
          </div>

          <div>
            <Panel title="备件库存" icon={<Wrench size={14} />}>
              <div className="space-y-2">
                {spareParts.map((part) => (
                  <div key={part.id} className="p-2 rounded border border-gray-800">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-200">{part.name}</span>
                      <span className={`text-[10px] ${part.quantity <= part.minStock ? "text-cyber-red" : "text-cyber-green"}`}>
                        {part.quantity}/{part.minStock}
                      </span>
                    </div>
                    <ProgressBar value={part.quantity} max={part.minStock * 2} showPercent={false} height={2} />
                  </div>
                ))}
              </div>
            </Panel>
          </div>
        </div>
      )}

      {/* 应急响应 */}
      {activeTab === "emergency" && (
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <Panel title="应急预案" icon={<ShieldAlert size={14} />}>
              <div className="space-y-2">
                {plans.map((plan) => (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`p-3 rounded border cursor-pointer transition-all duration-200 ${
                      selectedPlan === plan.id
                        ? "border-cyber-blue/50 bg-cyber-blue/5"
                        : "border-gray-800 hover:border-cyber-blue/30"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-rajdhani font-bold text-white">{plan.name}</span>
                          <span className="text-[10px] text-gray-500">{typeLabels[plan.type]}</span>
                        </div>
                        <div className="text-[10px] text-gray-500">
                          {plan.steps.length} 个步骤 · {plan.lastDrill && `上次演练: ${plan.lastDrill}`}
                        </div>
                      </div>
                      {activePlanId === plan.id && (
                        <span className="text-[10px] px-2 py-1 rounded bg-cyber-red/10 text-cyber-red animate-pulse">
                          执行中
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Panel>
          </div>

          <div>
            {activePlan ? (
              <Panel title="执行中" icon={<Siren size={14} />}>
                <div className="space-y-2">
                  <div className="text-xs text-cyber-red font-rajdhani font-bold animate-pulse mb-2">
                    {activePlan.name}
                  </div>
                  {activePlan.steps.map((step) => (
                    <div
                      key={step.order}
                      className={`p-2 rounded border ${step.completed ? "border-cyber-green/30 bg-cyber-green/5" : "border-cyber-amber/30 bg-cyber-amber/5"}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-cyber-blue">{step.order}</span>
                          <span className={`text-[10px] ${step.completed ? "text-gray-500 line-through" : "text-white"}`}>
                            {step.action}
                          </span>
                        </div>
                        {!step.completed && (
                          <button
                            onClick={() => completeStep(activePlan.id, step.order)}
                            className="px-1.5 py-0.5 text-[10px] rounded border border-cyber-green/30 text-cyber-green hover:bg-cyber-green/10"
                          >
                            完成
                          </button>
                        )}
                        {step.completed && <CheckCircle size={12} className="text-cyber-green" />}
                      </div>
                    </div>
                  ))}
                  {allStepsCompleted && (
                    <div className="text-center text-cyber-green text-[10px] font-rajdhani font-bold py-2">
                      所有步骤已完成！
                    </div>
                  )}
                  <button
                    onClick={deactivatePlan}
                    className="w-full flex items-center justify-center gap-1 px-2 py-1.5 text-[10px] rounded border border-gray-700 text-gray-400 hover:border-gray-500"
                  >
                    <Square size={10} /> 结束应急
                  </button>
                </div>
              </Panel>
            ) : selectedPlan ? (
              <Panel title="预案详情" icon={<ShieldAlert size={14} />}>
                {(() => {
                  const plan = plans.find((p) => p.id === selectedPlan);
                  if (!plan) return null;
                  return (
                    <div className="space-y-3">
                      <div>
                        <div className="text-xs font-rajdhani font-bold text-white mb-1">{plan.name}</div>
                        <div className="text-[10px] text-gray-500">{typeLabels[plan.type]}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-gray-500 mb-1">处置步骤</div>
                        <div className="space-y-1">
                          {plan.steps.map((step) => (
                            <div key={step.order} className="text-[10px] text-gray-300 flex gap-1">
                              <span className="text-cyber-blue">{step.order}.</span>
                              {step.action}
                            </div>
                          ))}
                        </div>
                      </div>
                      <button
                        onClick={() => activatePlan(plan.id)}
                        className="w-full flex items-center justify-center gap-1 px-2 py-1.5 text-[10px] rounded border border-cyber-red/40 text-cyber-red hover:bg-cyber-red/10 font-rajdhani font-bold"
                      >
                        <Play size={10} /> 启动应急预案
                      </button>
                    </div>
                  );
                })()}
              </Panel>
            ) : (
              <Panel title="应急详情" icon={<ShieldAlert size={14} />}>
                <div className="text-center text-gray-500 text-xs py-8">选择预案查看详情</div>
              </Panel>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
