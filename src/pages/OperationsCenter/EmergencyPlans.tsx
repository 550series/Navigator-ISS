import { memo, useState } from "react";
import { useEmergencyStore } from "@/stores/emergencyStore";
import Panel from "@/components/ui/Panel";
import { ShieldAlert, Play, Square, Siren, CheckCircle } from "lucide-react";

const typeLabels: Record<string, string> = {
  fire: "火灾",
  decompression: "失压",
  radiation: "辐射",
  medical: "医疗",
  system_failure: "系统故障",
};

const EmergencyPlans = memo(function EmergencyPlans() {
  const { plans, activePlanId, activatePlan, deactivatePlan, completeStep } = useEmergencyStore();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const activePlan = plans.find((p) => p.id === activePlanId);
  const allStepsCompleted = activePlan?.steps.every((s) => s.completed) ?? false;

  return (
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
  );
});

export default EmergencyPlans;
