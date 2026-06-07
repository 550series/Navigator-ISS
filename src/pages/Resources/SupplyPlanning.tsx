import { memo, useState } from "react";
import { useResourceStore } from "@/stores/resourceStore";
import Panel from "@/components/ui/Panel";
import { Truck, Plus, Clock, Check } from "lucide-react";

const statusLabels = {
  planned: "计划中",
  in_transit: "运输中",
  arrived: "已到达",
  cancelled: "已取消",
};

const statusColors = {
  planned: "text-cyber-blue",
  in_transit: "text-cyber-amber",
  arrived: "text-cyber-green",
  cancelled: "text-gray-500",
};

const priorityColors = {
  low: "text-gray-400",
  medium: "text-cyber-blue",
  high: "text-cyber-amber",
  critical: "text-cyber-red",
};

const SupplyPlanning = memo(function SupplyPlanning() {
  const { supplyPlans, updateSupplyPlan } = useResourceStore();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const selected = supplyPlans.find((p) => p.id === selectedPlan);

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="col-span-2">
        <Panel
          title="补给计划"
          icon={<Truck size={14} />}
          action={
            <button className="flex items-center gap-1 px-2 py-1 text-[10px] rounded border border-cyber-blue/30 text-cyber-blue hover:bg-cyber-blue/10 transition-colors">
              <Plus size={10} /> 新建计划
            </button>
          }
        >
          <div className="space-y-2">
            {supplyPlans.map((plan) => (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`p-3 rounded border cursor-pointer transition-all duration-200 ${
                  selectedPlan === plan.id
                    ? "border-cyber-blue/50 bg-cyber-blue/5"
                    : "border-gray-800 hover:border-cyber-blue/30"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-rajdhani font-bold text-white">{plan.name}</span>
                      <span className={`text-[10px] ${statusColors[plan.status]}`}>
                        {statusLabels[plan.status]}
                      </span>
                      <span className={`text-[10px] ${priorityColors[plan.priority]}`}>
                        {plan.priority}
                      </span>
                    </div>
                    <div className="flex gap-3 text-[10px] text-gray-400">
                      <span>发射: {plan.launchDate}</span>
                      <span>到达: {plan.arrivalDate}</span>
                      <span>质量: {plan.totalMass} kg</span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {plan.status === "planned" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateSupplyPlan(plan.id, { status: "in_transit" });
                        }}
                        className="p-1 text-[10px] rounded border border-cyber-amber/30 text-cyber-amber hover:bg-cyber-amber/10"
                      >
                        <Clock size={10} />
                      </button>
                    )}
                    {plan.status === "in_transit" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateSupplyPlan(plan.id, { status: "arrived" });
                        }}
                        className="p-1 text-[10px] rounded border border-cyber-green/30 text-cyber-green hover:bg-cyber-green/10"
                      >
                        <Check size={10} />
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
          <Panel title="计划详情" icon={<Truck size={14} />}>
            <div className="space-y-3">
              <div>
                <div className="text-xs font-rajdhani font-bold text-white mb-1">{selected.name}</div>
                <div className="flex gap-2">
                  <span className={`text-[10px] ${statusColors[selected.status]}`}>
                    {statusLabels[selected.status]}
                  </span>
                  <span className={`text-[10px] ${priorityColors[selected.priority]}`}>
                    优先级: {selected.priority}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-space-900/50 p-2 rounded border border-gray-800">
                  <div className="text-[10px] text-gray-500">发射日期</div>
                  <div className="text-sm font-rajdhani text-white">{selected.launchDate}</div>
                </div>
                <div className="bg-space-900/50 p-2 rounded border border-gray-800">
                  <div className="text-[10px] text-gray-500">到达日期</div>
                  <div className="text-sm font-rajdhani text-white">{selected.arrivalDate}</div>
                </div>
              </div>

              <div>
                <div className="text-[10px] text-gray-500 mb-1">补给物资</div>
                <div className="space-y-1">
                  {selected.items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded bg-space-900/30">
                      <span className="text-xs text-gray-300">{item.resourceName}</span>
                      <span className="text-xs text-cyber-blue font-rajdhani">
                        {item.quantity} {item.unit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-2 rounded border border-gray-800 bg-space-900/30">
                <div className="text-[10px] text-gray-500">总质量</div>
                <div className="text-lg font-orbitron text-white">{selected.totalMass} kg</div>
              </div>
            </div>
          </Panel>
        ) : (
          <Panel title="计划详情" icon={<Truck size={14} />}>
            <div className="text-center text-gray-500 text-xs py-8">选择补给计划查看详情</div>
          </Panel>
        )}
      </div>
    </div>
  );
});

export default SupplyPlanning;
