import { useExperimentStore } from "@/stores/experimentStore";
import Panel from "@/components/ui/Panel";
import StatusCard from "@/components/ui/StatusCard";
import ProgressBar from "@/components/ui/ProgressBar";
import { FlaskConical, Play, Pause, CheckCircle, XCircle, Clock, BarChart3 } from "lucide-react";
import { useState } from "react";

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

const statusIcons: Record<string, React.ReactNode> = {
  planned: <Clock size={12} />,
  active: <Play size={12} />,
  paused: <Pause size={12} />,
  completed: <CheckCircle size={12} />,
  aborted: <XCircle size={12} />,
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

export default function Experiments() {
  const { experiments, updateStatus, getStats } = useExperimentStore();
  const [selectedExperiment, setSelectedExperiment] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"list" | "data">("list");

  const stats = getStats();
  const selected = experiments.find((e) => e.id === selectedExperiment);

  return (
    <div className="space-y-4">
      {/* 顶部统计 */}
      <div className="grid grid-cols-5 gap-4">
        <StatusCard
          title="总实验数"
          value={stats.total}
          icon={<FlaskConical size={16} />}
        />
        <StatusCard
          title="进行中"
          value={stats.active}
          icon={<Play size={16} />}
          status={stats.active > 0 ? "normal" : "warning"}
        />
        <StatusCard
          title="计划中"
          value={stats.planned}
          icon={<Clock size={16} />}
        />
        <StatusCard
          title="已完成"
          value={stats.completed}
          icon={<CheckCircle size={16} />}
        />
        <StatusCard
          title="已终止"
          value={stats.aborted}
          icon={<XCircle size={16} />}
          status={stats.aborted > 0 ? "critical" : "normal"}
        />
      </div>

      {/* 标签页切换 */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab("list")}
          className={`px-4 py-2 text-xs rounded border transition-colors font-rajdhani font-bold ${
            activeTab === "list"
              ? "border-cyber-blue/50 bg-cyber-blue/10 text-cyber-blue"
              : "border-gray-700 text-gray-400 hover:border-cyber-blue/30"
          }`}
        >
          <FlaskConical size={12} className="inline mr-1" /> 实验列表
        </button>
        <button
          onClick={() => setActiveTab("data")}
          className={`px-4 py-2 text-xs rounded border transition-colors font-rajdhani font-bold ${
            activeTab === "data"
              ? "border-cyber-blue/50 bg-cyber-blue/10 text-cyber-blue"
              : "border-gray-700 text-gray-400 hover:border-cyber-blue/30"
          }`}
        >
          <BarChart3 size={12} className="inline mr-1" /> 数据分析
        </button>
      </div>

      {activeTab === "list" ? (
        <div className="grid grid-cols-3 gap-4">
          {/* 实验列表 */}
          <div className="col-span-2">
            <Panel title="实验项目" icon={<FlaskConical size={14} />}>
              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {experiments.map((experiment) => (
                  <div
                    key={experiment.id}
                    onClick={() => setSelectedExperiment(experiment.id)}
                    className={`p-3 rounded border cursor-pointer transition-all duration-200 ${
                      selectedExperiment === experiment.id
                        ? "border-cyber-blue/50 bg-cyber-blue/5"
                        : `${statusColors[experiment.status]} hover:border-cyber-blue/30`
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-rajdhani font-bold text-white">
                            {experiment.name}
                          </span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded ${statusColors[experiment.status]}`}>
                            {statusIcons[experiment.status]} {statusLabels[experiment.status]}
                          </span>
                          <span className={`text-[10px] ${categoryColors[experiment.category]}`}>
                            {categoryLabels[experiment.category]}
                          </span>
                        </div>
                        <div className="text-xs text-gray-300">
                          负责人: {experiment.principal}
                        </div>
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

          {/* 实验详情 */}
          <div>
            {selected ? (
              <Panel title="实验详情" icon={<FlaskConical size={14} />}>
                <div className="space-y-3">
                  <div>
                    <div className="text-[10px] text-gray-500 mb-1">实验名称</div>
                    <div className="text-sm font-rajdhani text-white">{selected.name}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-500 mb-1">负责人</div>
                    <div className="text-sm font-rajdhani text-white">{selected.principal}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-500 mb-1">类别</div>
                    <div className={`text-sm font-rajdhani ${categoryColors[selected.category]}`}>
                      {categoryLabels[selected.category]}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-500 mb-1">状态</div>
                    <div className={`text-sm font-rajdhani font-bold ${statusColors[selected.status].split(" ").pop()}`}>
                      {statusLabels[selected.status]}
                    </div>
                  </div>

                  {/* 实验目标 */}
                  <div>
                    <div className="text-[10px] text-gray-500 mb-1">实验目标</div>
                    <ul className="text-xs text-gray-300 space-y-1">
                      {selected.objectives.map((obj, i) => (
                        <li key={i} className="flex items-start gap-1">
                          <span className="text-cyber-blue">•</span>
                          {obj}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* 资源使用 */}
                  <div>
                    <div className="text-[10px] text-gray-500 mb-2">资源使用</div>
                    <div className="space-y-2">
                      {selected.resources.map((res, i) => (
                        <div key={i}>
                          <div className="flex justify-between text-[10px] mb-1">
                            <span className="text-gray-400">{res.type}</span>
                            <span className="text-gray-500">
                              {res.used}/{res.allocated}
                            </span>
                          </div>
                          <ProgressBar
                            value={res.used}
                            max={res.allocated}
                            height={2}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 数据点数量 */}
                  <div>
                    <div className="text-[10px] text-gray-500 mb-1">数据记录</div>
                    <div className="text-sm font-rajdhani text-white">
                      {selected.dataPoints.length} 条
                    </div>
                  </div>

                  {/* 备注 */}
                  {selected.notes.length > 0 && (
                    <div>
                      <div className="text-[10px] text-gray-500 mb-1">备注</div>
                      <div className="space-y-1">
                        {selected.notes.map((note, i) => (
                          <div key={i} className="text-xs text-gray-400 bg-space-900/50 p-2 rounded">
                            {note}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 状态操作 */}
                  {selected.status !== "completed" && selected.status !== "aborted" && (
                    <div className="border-t border-gray-800 pt-3">
                      <div className="text-[10px] text-gray-500 mb-2">更新状态</div>
                      <div className="flex flex-wrap gap-1">
                        {selected.status !== "active" && (
                          <button
                            onClick={() => updateStatus(selected.id, "active")}
                            className="px-2 py-1 text-[10px] rounded border border-cyber-green/30 text-cyber-green hover:bg-cyber-green/10 transition-colors"
                          >
                            开始
                          </button>
                        )}
                        {selected.status === "active" && (
                          <button
                            onClick={() => updateStatus(selected.id, "paused")}
                            className="px-2 py-1 text-[10px] rounded border border-cyber-amber/30 text-cyber-amber hover:bg-cyber-amber/10 transition-colors"
                          >
                            暂停
                          </button>
                        )}
                        <button
                          onClick={() => updateStatus(selected.id, "completed")}
                          className="px-2 py-1 text-[10px] rounded border border-gray-600/30 text-gray-400 hover:bg-gray-600/10 transition-colors"
                        >
                          完成
                        </button>
                        <button
                          onClick={() => updateStatus(selected.id, "aborted")}
                          className="px-2 py-1 text-[10px] rounded border border-cyber-red/30 text-cyber-red hover:bg-cyber-red/10 transition-colors"
                        >
                          终止
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </Panel>
            ) : (
              <Panel title="实验详情" icon={<FlaskConical size={14} />}>
                <div className="text-center text-gray-500 text-xs py-8">
                  选择左侧实验查看详情
                </div>
              </Panel>
            )}
          </div>
        </div>
      ) : (
        /* 数据分析 */
        <Panel title="实验数据分析" icon={<BarChart3 size={14} />}>
          <div className="space-y-4">
            {experiments
              .filter((e) => e.dataPoints.length > 0)
              .map((experiment) => (
                <div key={experiment.id} className="p-3 rounded border border-gray-800">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-rajdhani font-bold text-white">
                      {experiment.name}
                    </span>
                    <span className={`text-[10px] ${categoryColors[experiment.category]}`}>
                      {categoryLabels[experiment.category]}
                    </span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-[10px]">
                      <thead>
                        <tr className="border-b border-gray-800">
                          <th className="text-left py-1 px-2 text-gray-500">时间</th>
                          {Object.keys(experiment.dataPoints[0]?.parameters || {}).map((key) => (
                            <th key={key} className="text-right py-1 px-2 text-gray-500">{key}</th>
                          ))}
                          <th className="text-left py-1 px-2 text-gray-500">观察</th>
                        </tr>
                      </thead>
                      <tbody>
                        {experiment.dataPoints.map((dp, i) => (
                          <tr key={i} className="border-b border-gray-800/50">
                            <td className="py-1 px-2 text-gray-400">{dp.timestamp}</td>
                            {Object.values(dp.parameters).map((val, j) => (
                              <td key={j} className="py-1 px-2 text-right text-white font-rajdhani">
                                {val}
                              </td>
                            ))}
                            <td className="py-1 px-2 text-gray-400 max-w-[200px] truncate">
                              {dp.observations}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
          </div>
        </Panel>
      )}
    </div>
  );
}
