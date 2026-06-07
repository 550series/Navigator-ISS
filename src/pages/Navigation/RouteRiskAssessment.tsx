import { memo, useState } from "react";
import { useNavigationStore } from "@/stores/navigationStore";
import Panel from "@/components/ui/Panel";
import { AlertTriangle, Shield, MapPin } from "lucide-react";

const riskColors = {
  low: "border-cyber-green/30 bg-cyber-green/5 text-cyber-green",
  medium: "border-cyber-amber/30 bg-cyber-amber/5 text-cyber-amber",
  high: "border-cyber-red/30 bg-cyber-red/5 text-cyber-red",
  critical: "border-cyber-red/40 bg-cyber-red/10 text-cyber-red",
};

const riskLabels = {
  low: "低风险",
  medium: "中等风险",
  high: "高风险",
  critical: "极高风险",
};

const hazardTypeColors = {
  asteroid_field: "text-cyber-amber",
  radiation_zone: "text-cyber-red",
  gravity_well: "text-cyber-purple",
  debris_field: "text-gray-400",
  solar_activity: "text-yellow-500",
};

const RouteRiskAssessment = memo(function RouteRiskAssessment() {
  const { riskAssessments, routePlans } = useNavigationStore();
  const [selectedRisk, setSelectedRisk] = useState<string | null>(null);

  const selected = riskAssessments.find((r) => r.id === selectedRisk);

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="col-span-2">
        <Panel title="航线风险评估" icon={<AlertTriangle size={14} />}>
          <div className="space-y-3">
            {riskAssessments.map((assessment) => {
              const route = routePlans.find((r) => r.id === assessment.routeId);
              return (
                <div
                  key={assessment.id}
                  onClick={() => setSelectedRisk(assessment.id)}
                  className={`p-3 rounded border cursor-pointer transition-all duration-200 ${
                    selectedRisk === assessment.id
                      ? "border-cyber-blue/50 bg-cyber-blue/5"
                      : riskColors[assessment.overallRisk]
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-rajdhani font-bold text-white">{route?.name || "未知航线"}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${riskColors[assessment.overallRisk]}`}>
                          {riskLabels[assessment.overallRisk]}
                        </span>
                      </div>
                      <div className="text-[10px] text-gray-500">
                        {assessment.hazards.length} 个风险点 · 评估日期: {assessment.assessmentDate}
                      </div>
                    </div>
                    <Shield size={16} className={assessment.overallRisk === "low" ? "text-cyber-green" : "text-cyber-amber"} />
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>
      </div>

      <div>
        {selected ? (
          <Panel title="风险详情" icon={<Shield size={14} />}>
            <div className="space-y-3">
              <div className={`p-2 rounded border ${riskColors[selected.overallRisk]}`}>
                <div className="text-xs font-rajdhani font-bold">总体风险等级</div>
                <div className="text-lg font-orbitron">{riskLabels[selected.overallRisk]}</div>
              </div>

              <div>
                <div className="text-[10px] text-gray-500 mb-1">风险点列表</div>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {selected.hazards.map((hazard) => (
                    <div key={hazard.id} className="p-2 rounded border border-gray-800 bg-space-900/30">
                      <div className="flex items-center gap-2 mb-1">
                        <MapPin size={10} className={hazardTypeColors[hazard.type]} />
                        <span className="text-xs text-gray-200">{hazard.name}</span>
                        <span className={`text-[10px] ${hazard.severity === "high" ? "text-cyber-red" : hazard.severity === "medium" ? "text-cyber-amber" : "text-cyber-green"}`}>
                          {hazard.severity}
                        </span>
                      </div>
                      <div className="text-[10px] text-gray-400">{hazard.description}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-[10px] text-gray-500 mb-1">缓解策略</div>
                <ul className="text-[10px] text-gray-300 space-y-1">
                  {selected.mitigationStrategies.map((strategy, i) => (
                    <li key={i} className="flex items-start gap-1">
                      <span className="text-cyber-blue">•</span>
                      {strategy}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Panel>
        ) : (
          <Panel title="风险详情" icon={<Shield size={14} />}>
            <div className="text-center text-gray-500 text-xs py-8">选择风险评估查看详情</div>
          </Panel>
        )}
      </div>
    </div>
  );
});

export default RouteRiskAssessment;
