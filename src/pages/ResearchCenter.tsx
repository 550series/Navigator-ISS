import { useState } from "react";
import { FlaskConical, Globe, Sun, Compass, Telescope, AlertTriangle, Radiation, Play, CheckCircle } from "lucide-react";
import { useExperimentStore } from "@/stores/experimentStore";
import { useSpaceEnvironmentStore } from "@/stores/spaceEnvironmentStore";
import Panel from "@/components/ui/Panel";
import StatusCard from "@/components/ui/StatusCard";
import ProgressBar from "@/components/ui/ProgressBar";

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

const threatColors: Record<string, string> = {
  low: "text-cyber-green",
  moderate: "text-cyber-amber",
  high: "text-cyber-red",
  extreme: "text-cyber-red",
  critical: "text-cyber-red",
};

const threatLabels: Record<string, string> = {
  low: "低",
  moderate: "中等",
  high: "高",
  extreme: "极端",
  critical: "危急",
};

export default function ResearchCenter() {
  const { experiments, updateStatus, getStats } = useExperimentStore();
  const { planets, weather, attitude, celestialEvents, observationLogs, getThreatLevel } = useSpaceEnvironmentStore();

  const [activeTab, setActiveTab] = useState<"experiments" | "environment" | "observations">("experiments");
  const [selectedExperiment, setSelectedExperiment] = useState<string | null>(null);

  const stats = getStats();
  const threatLevel = getThreatLevel();
  const selected = experiments.find((e) => e.id === selectedExperiment);

  return (
    <div className="space-y-4">
      {/* 顶部统计 */}
      <div className="grid grid-cols-6 gap-4">
        <StatusCard title="实验总数" value={stats.total} icon={<FlaskConical size={16} />} />
        <StatusCard title="进行中" value={stats.active} icon={<Play size={16} />} status={stats.active > 0 ? "normal" : "warning"} />
        <StatusCard title="已完成" value={stats.completed} icon={<CheckCircle size={16} />} />
        <StatusCard title="威胁等级" value={threatLabels[threatLevel]} icon={<AlertTriangle size={16} />} status={threatLevel === "low" ? "normal" : threatLevel === "moderate" ? "warning" : "critical"} />
        <StatusCard title="辐射水平" value={weather.radiationLevel.toFixed(2)} unit="mSv/h" icon={<Radiation size={16} />} />
        <StatusCard title="姿态稳定" value={attitude.stability.toFixed(1)} unit="%" icon={<Compass size={16} />} />
      </div>

      {/* 二级导航 */}
      <div className="flex gap-1 bg-space-800/50 p-1 rounded-lg border border-cyber-blue/10">
        {[
          { id: "experiments", label: "实验管理", icon: <FlaskConical size={12} /> },
          { id: "environment", label: "太空环境", icon: <Globe size={12} /> },
          { id: "observations", label: "天文观测", icon: <Telescope size={12} /> },
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

      {/* 实验管理 */}
      {activeTab === "experiments" && (
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

                  <div>
                    <div className="text-[10px] text-gray-500 mb-1">数据记录</div>
                    <div className="text-xs font-rajdhani text-white">{selected.dataPoints.length} 条</div>
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
      )}

      {/* 太空环境 */}
      {activeTab === "environment" && (
        <div className="grid grid-cols-2 gap-4">
          <Panel title="太阳系行星" icon={<Globe size={14} />}>
            <div className="space-y-2">
              {planets.map((planet) => (
                <div key={planet.id} className="flex items-center justify-between p-2 rounded border border-gray-800">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: planet.color, boxShadow: `0 0 6px ${planet.color}40` }} />
                    <span className="text-xs text-gray-200">{planet.name}</span>
                  </div>
                  <span className="text-xs text-cyber-blue font-rajdhani">{planet.currentDistance.toFixed(2)} AU</span>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="太空天气" icon={<Sun size={14} />}>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">太阳风速</span>
                  <span className="text-gray-500">{Math.round(weather.solarWindSpeed)} km/s</span>
                </div>
                <ProgressBar value={weather.solarWindSpeed} max={1000} showPercent={false} />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">宇宙射线</span>
                  <span className="text-gray-500">{weather.cosmicRayLevel.toFixed(0)}%</span>
                </div>
                <ProgressBar value={weather.cosmicRayLevel} max={100} showPercent={false} />
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3">
                <div className="bg-space-900/50 p-2 rounded border border-gray-800">
                  <div className="text-[10px] text-gray-500">耀斑风险</div>
                  <div className={`text-sm font-rajdhani font-bold ${threatColors[weather.solarFlareRisk]}`}>
                    {weather.solarFlareRisk === "low" ? "低" : weather.solarFlareRisk === "moderate" ? "中等" : "高"}
                  </div>
                </div>
                <div className="bg-space-900/50 p-2 rounded border border-gray-800">
                  <div className="text-[10px] text-gray-500">地磁暴</div>
                  <div className={`text-sm font-rajdhani font-bold ${weather.geomagneticStorm === "none" ? "text-cyber-green" : "text-cyber-amber"}`}>
                    {weather.geomagneticStorm === "none" ? "无" : "有"}
                  </div>
                </div>
              </div>
            </div>
          </Panel>

          <Panel title="空间站姿态" icon={<Compass size={14} />}>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-space-900/50 p-2 rounded border border-gray-800 text-center">
                  <div className="text-[10px] text-gray-500">翻滚</div>
                  <div className="text-sm font-orbitron text-white">{attitude.roll.toFixed(2)}°</div>
                </div>
                <div className="bg-space-900/50 p-2 rounded border border-gray-800 text-center">
                  <div className="text-[10px] text-gray-500">俯仰</div>
                  <div className="text-sm font-orbitron text-white">{attitude.pitch.toFixed(2)}°</div>
                </div>
                <div className="bg-space-900/50 p-2 rounded border border-gray-800 text-center">
                  <div className="text-[10px] text-gray-500">偏航</div>
                  <div className="text-sm font-orbitron text-white">{attitude.yaw.toFixed(2)}°</div>
                </div>
              </div>
              <ProgressBar value={attitude.stability} max={100} label="稳定性" />
            </div>
          </Panel>

          <Panel title="天文事件" icon={<Telescope size={14} />}>
            <div className="space-y-2">
              {celestialEvents.slice(0, 3).map((event) => (
                <div key={event.id} className="p-2 rounded border border-gray-800">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-rajdhani text-white">{event.name}</span>
                    <span className={`text-[10px] ${event.visibility === "excellent" ? "text-cyber-green" : event.visibility === "good" ? "text-cyber-blue" : "text-gray-400"}`}>
                      {event.visibility === "excellent" ? "极佳" : event.visibility === "good" ? "良好" : "较差"}
                    </span>
                  </div>
                  <div className="text-[10px] text-gray-500">{event.startTime}</div>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      )}

      {/* 天文观测 */}
      {activeTab === "observations" && (
        <Panel title="观测日志" icon={<Telescope size={14} />}>
          <div className="space-y-3">
            {observationLogs.map((log) => (
              <div key={log.id} className="p-3 rounded border border-gray-800">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="text-xs font-rajdhani font-bold text-white">{log.target}</div>
                    <div className="text-[10px] text-gray-500">{log.observer} · {log.timestamp}</div>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-space-700 text-gray-400">
                    {log.type === "visual" ? "目视" : log.type === "instrument" ? "仪器" : "摄影"}
                  </span>
                </div>
                <div className="text-xs text-gray-300 mb-2">{log.description}</div>
                <div className="text-xs text-cyber-blue bg-cyber-blue/5 p-2 rounded border border-cyber-blue/10">
                  {log.findings}
                </div>
              </div>
            ))}
          </div>
        </Panel>
      )}
    </div>
  );
}
