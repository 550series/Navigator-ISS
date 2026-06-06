import { useMissionStore } from "@/stores/missionStore";
import Panel from "@/components/ui/Panel";
import ProgressBar from "@/components/ui/ProgressBar";
import { formatPercent, getPriorityColor, getStatusColor, getStatusBgColor } from "@/utils/formatters";
import { ClipboardList, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import { useState } from "react";

type StatusFilter = "all" | "in_progress" | "planned" | "completed";

const statusFilters: { value: StatusFilter; label: string; icon: typeof Clock }[] = [
  { value: "all", label: "全部", icon: ClipboardList },
  { value: "in_progress", label: "执行中", icon: Clock },
  { value: "planned", label: "计划中", icon: AlertTriangle },
  { value: "completed", label: "已完成", icon: CheckCircle },
];

/** 任务管理页面 */
export default function Missions() {
  const { missions } = useMissionStore();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selectedMission, setSelectedMission] = useState<string | null>(null);

  const filteredMissions =
    statusFilter === "all"
      ? missions
      : missions.filter((m) => m.status === statusFilter);

  const selectedMissionData = missions.find((m) => m.id === selectedMission);

  const inProgress = missions.filter((m) => m.status === "in_progress").length;
  const planned = missions.filter((m) => m.status === "planned").length;
  const completed = missions.filter((m) => m.status === "completed").length;

  return (
    <div className="space-y-4">
      {/* 统计卡片 */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-space-800/60 rounded border border-cyber-blue/20 p-4">
          <div className="text-xs text-gray-400 font-rajdhani mb-1">总任务数</div>
          <div className="text-2xl font-orbitron font-bold text-white">{missions.length}</div>
        </div>
        <div className="bg-space-800/60 rounded border border-cyber-amber/20 p-4">
          <div className="text-xs text-gray-400 font-rajdhani mb-1">执行中</div>
          <div className="text-2xl font-orbitron font-bold text-cyber-amber">{inProgress}</div>
        </div>
        <div className="bg-space-800/60 rounded border border-cyber-blue/20 p-4">
          <div className="text-xs text-gray-400 font-rajdhani mb-1">计划中</div>
          <div className="text-2xl font-orbitron font-bold text-cyber-blue">{planned}</div>
        </div>
        <div className="bg-space-800/60 rounded border border-cyber-green/20 p-4">
          <div className="text-xs text-gray-400 font-rajdhani mb-1">已完成</div>
          <div className="text-2xl font-orbitron font-bold text-cyber-green">{completed}</div>
        </div>
      </div>

      {/* 筛选 + 任务列表 + 详情 */}
      <div className="grid grid-cols-3 gap-4">
        {/* 任务列表 */}
        <Panel title="任务列表" icon={<ClipboardList size={14} />} className="col-span-2">
          {/* 状态筛选 */}
          <div className="flex gap-2 mb-4">
            {statusFilters.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => setStatusFilter(value)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded border transition-colors font-rajdhani ${
                  statusFilter === value
                    ? "border-cyber-blue/50 bg-cyber-blue/10 text-cyber-blue"
                    : "border-gray-700 text-gray-400 hover:border-cyber-blue/30"
                }`}
              >
                <Icon size={12} />
                {label}
              </button>
            ))}
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredMissions.map((mission) => (
              <div
                key={mission.id}
                onClick={() => setSelectedMission(mission.id)}
                className={`rounded border p-3 cursor-pointer transition-all duration-200 ${
                  selectedMission === mission.id
                    ? "border-cyber-blue/40 bg-cyber-blue/5"
                    : "border-gray-800/50 hover:border-cyber-blue/20"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold uppercase ${getPriorityColor(mission.priority)}`}>
                      {mission.priority === "critical" ? "!!" : mission.priority === "high" ? "!" : mission.priority === "medium" ? "◆" : "○"}
                    </span>
                    <span className="text-sm text-gray-200 font-rajdhani font-medium">{mission.title}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] border ${getStatusBgColor(mission.status)}`}>
                    {mission.status === "in_progress" ? "执行中" : mission.status === "planned" ? "计划中" : mission.status === "completed" ? "已完成" : "已中止"}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-2 line-clamp-1">{mission.description}</p>
                <ProgressBar value={mission.progress} max={100} height={4} />
                <div className="flex items-center justify-between mt-1.5 text-[10px] text-gray-600">
                  <span>负责人: {mission.assignee}</span>
                  <span>截止: {mission.deadline}</span>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        {/* 任务详情 */}
        <Panel title="任务详情">
          {selectedMissionData ? (
            <div className="space-y-4">
              <div>
                <h4 className="font-orbitron text-sm text-white mb-1">{selectedMissionData.title}</h4>
                <p className="text-xs text-gray-400 leading-relaxed">{selectedMissionData.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-gray-500">优先级</span>
                  <div className={`font-rajdhani font-bold mt-0.5 ${getPriorityColor(selectedMissionData.priority)}`}>
                    {selectedMissionData.priority === "critical" ? "紧急" : selectedMissionData.priority === "high" ? "高" : selectedMissionData.priority === "medium" ? "中" : "低"}
                  </div>
                </div>
                <div>
                  <span className="text-gray-500">状态</span>
                  <div className={`font-rajdhani font-bold mt-0.5 ${getStatusColor(selectedMissionData.status)}`}>
                    {selectedMissionData.status === "in_progress" ? "执行中" : selectedMissionData.status === "planned" ? "计划中" : "已完成"}
                  </div>
                </div>
                <div>
                  <span className="text-gray-500">负责人</span>
                  <div className="text-gray-200 font-rajdhani mt-0.5">{selectedMissionData.assignee}</div>
                </div>
                <div>
                  <span className="text-gray-500">截止日期</span>
                  <div className="text-gray-200 font-rajdhani mt-0.5">{selectedMissionData.deadline}</div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-gray-500">总进度</span>
                  <span className="text-white font-rajdhani">{formatPercent(selectedMissionData.progress)}</span>
                </div>
                <ProgressBar value={selectedMissionData.progress} max={100} height={8} />
              </div>

              <div>
                <span className="text-xs text-gray-500">子任务</span>
                <div className="space-y-1.5 mt-2">
                  {selectedMissionData.subtasks.map((subtask, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                        subtask.completed ? "border-cyber-green/50 bg-cyber-green/10" : "border-gray-600"
                      }`}>
                        {subtask.completed && <CheckCircle size={10} className="text-cyber-green" />}
                      </div>
                      <span className={subtask.completed ? "text-gray-500 line-through" : "text-gray-300"}>
                        {subtask.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-48 text-xs text-gray-600">
              选择一个任务查看详情
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
}
