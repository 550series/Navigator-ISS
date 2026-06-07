import { memo, useState } from "react";
import { useExperimentStore } from "@/stores/experimentStore";
import Panel from "@/components/ui/Panel";
import ProgressBar from "@/components/ui/ProgressBar";
import { FlaskConical } from "lucide-react";

const statusColors: Record<string, string> = {
  planned: "border-cyber-blue/30 bg-cyber-blue/5 text-cyber-blue",
  active: "border-cyber-green/30 bg-cyber-green/5 text-cyber-green",
  paused: "border-cyber-amber/30 bg-cyber-amber/5 text-cyber-amber",
  completed: "border-gray-600/30 bg-gray-600/5 text-gray-400",
  aborted: "border-cyber-red/30 bg-cyber-red/5 text-cyber-red",
};

const statusLabels: Record<string, string> = {
  planned: "计划中",
  active: "进行中",
  paused: "已暂停",
  completed: "已完成",
  aborted: "已终止",
};

const categoryLabels: Record<string, string> = {
  biology: "生物学",
  physics: "物理学",
  materials: "材料学",
  earth_observation: "地球观测",
};

const categoryColors: Record<string, string> = {
  biology: "text-cyber-green",
  physics: "text-cyber-blue",
  materials: "text-cyber-amber",
  earth_observation: "text-cyber-purple",
};

const ExperimentList = memo(function ExperimentList() {
  const { experiments, updateStatus } = useExperimentStore();
  const [selectedExperiment, setSelectedExperiment] = useState<string | null>(null);

  const selected = experiments.find((e) => e.id === selectedExperiment);

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="col-span-2">
        <Panel title="实验项目" icon={<FlaskConical size={14} />}>
          <div className="space-y-2">
            {experiments.map((experiment) => (
              <div
                key={experiment.id}
                onClick={() => setSelectedExperiment(experiment.id)}
                className={`p-3 rounded border cursor-pointer transition-all duration-200 ${
                  selectedExperiment === experiment.id
                    ? "border-cyber-blue/50 bg-cyber-blue/5"
                    : "border-gray-800 hover:border-cyber-blue/30"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-rajdhani font-bold text-white">{experiment.name}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${statusColors[experiment.status]}`}>
                        {statusLabels[experiment.status]}
                      </span>
                      <span className={`text-[10px] ${categoryColors[experiment.category]}`}>
                        {categoryLabels[experiment.category]}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400">负责人: {experiment.principal}</div>
                    <div className="text-[10px] text-gray-500 mt-1">
                      开始: {experiment.startDate}
                      {experiment.endDate && ` · 结束: ${experiment.endDate}`}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div>
        {selected ? (
          <Panel title="实验详情" icon={<FlaskConical size={14} />}>
            <div className="space-y-3">
              <div>
                <div className="text-xs font-rajdhani font-bold text-white">{selected.name}</div>
                <div className="text-[10px] text-gray-500">{selected.principal} · {categoryLabels[selected.category]}</div>
              </div>

              <div>
                <div className="text-[10px] text-gray-500 mb-1">实验目标</div>
                <ul className="text-[10px] text-gray-300 space-y-0.5">
                  {selected.objectives.map((obj, i) => (
                    <li key={i} className="flex items-start gap-1">
                      <span className="text-cyber-blue">•</span>
                      {obj}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="text-[10px] text-gray-500 mb-1">资源使用</div>
                {selected.resources.map((res, i) => (
                  <div key={i} className="mb-1">
                    <div className="flex justify-between text-[10px] mb-0.5">
                      <span className="text-gray-400">{res.type}</span>
                      <span className="text-gray-500">{res.used}/{res.allocated}</span>
                    </div>
                    <ProgressBar value={res.used} max={res.allocated} showPercent={false} height={2} />
                  </div>
                ))}
              </div>

              {selected.status !== "completed" && selected.status !== "aborted" && (
                <div className="border-t border-gray-800 pt-3">
                  <div className="text-[10px] text-gray-500 mb-2">更新状态</div>
                  <div className="flex flex-wrap gap-1">
                    {selected.status !== "active" && (
                      <button onClick={() => updateStatus(selected.id, "active")} className="px-2 py-1 text-[10px] rounded border border-cyber-green/30 text-cyber-green hover:bg-cyber-green/10">
                        开始
                      </button>
                    )}
                    {selected.status === "active" && (
                      <button onClick={() => updateStatus(selected.id, "paused")} className="px-2 py-1 text-[10px] rounded border border-cyber-amber/30 text-cyber-amber hover:bg-cyber-amber/10">
                        暂停
                      </button>
                    )}
                    <button onClick={() => updateStatus(selected.id, "completed")} className="px-2 py-1 text-[10px] rounded border border-gray-600/30 text-gray-400 hover:bg-gray-600/10">
                      完成
                    </button>
                    <button onClick={() => updateStatus(selected.id, "aborted")} className="px-2 py-1 text-[10px] rounded border border-cyber-red/30 text-cyber-red hover:bg-cyber-red/10">
                      终止
                    </button>
                  </div>
                </div>
              )}
            </div>
          </Panel>
        ) : (
          <Panel title="实验详情" icon={<FlaskConical size={14} />}>
            <div className="text-center text-gray-500 text-xs py-8">选择实验查看详情</div>
          </Panel>
        )}
      </div>
    </div>
  );
});

export default ExperimentList;
