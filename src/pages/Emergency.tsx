import { useEmergencyStore } from "@/stores/emergencyStore";
import Panel from "@/components/ui/Panel";
import StatusCard from "@/components/ui/StatusCard";
import { ShieldAlert, Siren, ClipboardCheck, CheckCircle, Clock, AlertTriangle, Play, Square } from "lucide-react";
import { useState } from "react";

const typeLabels: Record<string, string> = {
  fire: "火灾",
  decompression: "失压",
  radiation: "辐射",
  medical: "医疗",
  system_failure: "系统故障",
};

const typeColors: Record<string, string> = {
  fire: "text-cyber-red",
  decompression: "text-cyber-amber",
  radiation: "text-cyber-purple",
  medical: "text-cyber-green",
  system_failure: "text-cyber-blue",
};

const severityColors: Record<string, string> = {
  low: "text-gray-400",
  medium: "text-cyber-blue",
  high: "text-cyber-amber",
  critical: "text-cyber-red",
};

export default function Emergency() {
  const { plans, drills, activePlanId, activatePlan, deactivatePlan, completeStep, getStats } = useEmergencyStore();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"plans" | "drills" | "active">("plans");

  const stats = getStats();
  const selected = plans.find((p) => p.id === selectedPlan);
  const activePlan = plans.find((p) => p.id === activePlanId);
  const allStepsCompleted = activePlan?.steps.every((s) => s.completed) ?? false;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-5 gap-4">
        <StatusCard title="应急预案" value={stats.totalPlans} icon={<ShieldAlert size={16} />} />
        <StatusCard title="应急演练" value={stats.totalDrills} icon={<ClipboardCheck size={16} />} />
        <StatusCard title="平均得分" value={stats.avgScore} unit="分" icon={<CheckCircle size={16} />} />
        <StatusCard title="即将演练" value={stats.upcomingDrills} unit="项" icon={<Clock size={16} />} />
        <StatusCard
          title="当前应急"
          value={stats.activePlan ? "激活" : "无"}
          icon={<Siren size={16} />}
          status={stats.activePlan ? "critical" : "normal"}
        />
      </div>

      <div className="flex gap-2">
        {(["plans", "drills", "active"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-xs rounded border transition-colors font-rajdhani font-bold ${
              activeTab === tab
                ? "border-cyber-blue/50 bg-cyber-blue/10 text-cyber-blue"
                : "border-gray-700 text-gray-400 hover:border-cyber-blue/30"
            }`}
          >
            {tab === "plans" ? "应急预案" : tab === "drills" ? "演练记录" : "当前应急"}
          </button>
        ))}
      </div>

      {activeTab === "plans" && (
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <Panel title="应急预案列表" icon={<ShieldAlert size={14} />}>
              <div className="space-y-2 max-h-[500px] overflow-y-auto">
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
                          <span className={`text-[10px] ${typeColors[plan.type]}`}>
                            {typeLabels[plan.type]}
                          </span>
                          <span className="text-xs font-rajdhani font-bold text-white">{plan.name}</span>
                        </div>
                        <div className="text-[10px] text-gray-500">
                          严重程度: <span className={severityColors[plan.severity]}>{plan.severity}</span>
                          {" · "}{plan.steps.length} 个步骤
                          {plan.lastDrill && ` · 上次演练: ${plan.lastDrill}`}
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
            {selected ? (
              <Panel title="预案详情" icon={<ShieldAlert size={14} />}>
                <div className="space-y-3">
                  <div>
                    <div className="text-[10px] text-gray-500 mb-1">名称</div>
                    <div className="text-sm font-rajdhani text-white">{selected.name}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <div className="text-[10px] text-gray-500 mb-1">类型</div>
                      <div className={`text-sm font-rajdhani ${typeColors[selected.type]}`}>
                        {typeLabels[selected.type]}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-gray-500 mb-1">严重程度</div>
                      <div className={`text-sm font-rajdhani font-bold ${severityColors[selected.severity]}`}>
                        {selected.severity}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] text-gray-500 mb-1">处置步骤</div>
                    <div className="space-y-1">
                      {selected.steps.map((step) => (
                        <div key={step.order} className="text-xs text-gray-300 flex gap-2">
                          <span className="text-cyber-blue font-bold">{step.order}.</span>
                          <span>{step.action}</span>
                          <span className="text-gray-500 ml-auto">({step.timeLimit}min)</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] text-gray-500 mb-1">所需资源</div>
                    <div className="flex flex-wrap gap-1">
                      {selected.resources.map((r) => (
                        <span key={r} className="text-[10px] px-2 py-0.5 rounded bg-space-700 text-gray-400">
                          {r}
                        </span>
                      ))}
                    </div>
                  </div>

                  {activePlanId !== selected.id && (
                    <button
                      onClick={() => activatePlan(selected.id)}
                      className="w-full flex items-center justify-center gap-1 px-3 py-2 text-xs rounded border border-cyber-red/40 text-cyber-red hover:bg-cyber-red/10 transition-colors font-rajdhani font-bold"
                    >
                      <Play size={12} /> 启动应急预案
                    </button>
                  )}
                </div>
              </Panel>
            ) : (
              <Panel title="预案详情" icon={<ShieldAlert size={14} />}>
                <div className="text-center text-gray-500 text-xs py-8">选择左侧预案查看详情</div>
              </Panel>
            )}
          </div>
        </div>
      )}

      {activeTab === "drills" && (
        <Panel title="演练记录" icon={<ClipboardCheck size={14} />}>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left py-2 px-3 text-gray-500 font-rajdhani">预案</th>
                  <th className="text-left py-2 px-3 text-gray-500 font-rajdhani">日期</th>
                  <th className="text-right py-2 px-3 text-gray-500 font-rajdhani">时长</th>
                  <th className="text-left py-2 px-3 text-gray-500 font-rajdhani">参与人员</th>
                  <th className="text-right py-2 px-3 text-gray-500 font-rajdhani">得分</th>
                  <th className="text-left py-2 px-3 text-gray-500 font-rajdhani">发现问题</th>
                </tr>
              </thead>
              <tbody>
                {drills.map((drill) => (
                  <tr key={drill.id} className="border-b border-gray-800/50 hover:bg-space-800/30">
                    <td className="py-2 px-3 text-gray-200 font-rajdhani">{drill.planName}</td>
                    <td className="py-2 px-3 text-gray-400">{drill.date}</td>
                    <td className="py-2 px-3 text-right text-white font-rajdhani">{drill.duration}min</td>
                    <td className="py-2 px-3 text-gray-400">{drill.participants.join(", ")}</td>
                    <td className="py-2 px-3 text-right">
                      <span className={`font-rajdhani font-bold ${
                        drill.score >= 90 ? "text-cyber-green" : drill.score >= 70 ? "text-cyber-amber" : "text-cyber-red"
                      }`}>
                        {drill.score}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-gray-400 max-w-[200px]">
                      {drill.issues.map((issue, i) => (
                        <div key={i} className="text-[10px]">{" "}{issue}</div>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      )}

      {activeTab === "active" && (
        <>
          {activePlan ? (
            <Panel title={`执行中: ${activePlan.name}`} icon={<Siren size={14} />}>
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-cyber-red font-rajdhani font-bold animate-pulse">应急处置进行中</span>
                </div>
                {activePlan.steps.map((step) => (
                  <div
                    key={step.order}
                    className={`p-3 rounded border transition-all ${
                      step.completed
                        ? "border-cyber-green/30 bg-cyber-green/5"
                        : "border-cyber-amber/30 bg-cyber-amber/5"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-cyber-blue">{step.order}.</span>
                        <span className={`text-xs ${step.completed ? "text-gray-500 line-through" : "text-white"}`}>
                          {step.action}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-gray-500">{step.responsible} · {step.timeLimit}min</span>
                        {!step.completed && (
                          <button
                            onClick={() => completeStep(activePlan.id, step.order)}
                            className="px-2 py-1 text-[10px] rounded border border-cyber-green/30 text-cyber-green hover:bg-cyber-green/10 transition-colors"
                          >
                            完成
                          </button>
                        )}
                        {step.completed && <CheckCircle size={14} className="text-cyber-green" />}
                      </div>
                    </div>
                  </div>
                ))}
                <div className="border-t border-gray-800 pt-3 flex gap-2">
                  {allStepsCompleted && (
                    <div className="flex-1 text-center text-cyber-green text-xs font-rajdhani font-bold py-2">
                      所有步骤已完成！
                    </div>
                  )}
                  <button
                    onClick={deactivatePlan}
                    className="flex items-center gap-1 px-3 py-2 text-xs rounded border border-gray-700 text-gray-400 hover:border-gray-500 transition-colors font-rajdhani"
                  >
                    <Square size={12} /> 结束应急
                  </button>
                </div>
              </div>
            </Panel>
          ) : (
            <Panel title="当前应急" icon={<Siren size={14} />}>
              <div className="text-center text-gray-500 text-xs py-8">
                <AlertTriangle size={32} className="mx-auto mb-2 opacity-30" />
                <div>当前无激活的应急预案</div>
                <div className="mt-1">请在「应急预案」标签中选择并启动</div>
              </div>
            </Panel>
          )}
        </>
      )}
    </div>
  );
}
