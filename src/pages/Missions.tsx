import { useMissionStore } from "@/stores/missionStore";
import Panel from "@/components/ui/Panel";
import ProgressBar from "@/components/ui/ProgressBar";
import { formatPercent, getPriorityColor, getStatusColor, getStatusBgColor } from "@/utils/formatters";
import { ClipboardList, CheckCircle, Clock, AlertTriangle, Play, RotateCcw, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import type { Mission } from "@/data/types";

type StatusFilter = "all" | "in_progress" | "planned" | "completed";

const statusFilters: { value: StatusFilter; label: string; icon: typeof Clock }[] = [
  { value: "all", label: "全部", icon: ClipboardList },
  { value: "in_progress", label: "执行中", icon: Clock },
  { value: "planned", label: "计划中", icon: AlertTriangle },
  { value: "completed", label: "已完成", icon: CheckCircle },
];

const statusLabels: Record<Mission["status"], string> = {
  in_progress: "执行中",
  planned: "计划中",
  completed: "已完成",
  aborted: "已中止",
};

const priorityLabels: Record<Mission["priority"], string> = {
  critical: "紧急",
  high: "高",
  medium: "中",
  low: "低",
};

/** 任务管理页面 */
export default function Missions() {
  const { missions, toggleSubtask, setMissionStatus, resetMissions, addMission, deleteMission } = useMissionStore();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selectedMission, setSelectedMission] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formPriority, setFormPriority] = useState<Mission["priority"]>("medium");
  const [formAssignee, setFormAssignee] = useState("");
  const [formDeadline, setFormDeadline] = useState("");

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
          {/* 状态筛选 + 重置 */}
          <div className="flex gap-2 mb-4 items-center">
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
            <button
              onClick={() => setShowAddForm(true)}
              className="ml-auto flex items-center gap-1 px-2 py-1.5 text-[10px] text-cyber-blue hover:text-cyber-blue/80 border border-cyber-blue/30 rounded"
            >
              <Plus size={10} /> 新建任务
            </button>
            <button
              onClick={() => {
                if (confirm("确定重置所有任务到初始状态？")) resetMissions();
              }}
              className="flex items-center gap-1 px-2 py-1.5 text-[10px] text-gray-500 hover:text-cyber-amber border border-gray-800 rounded"
            >
              <RotateCcw size={10} /> 重置
            </button>
          </div>

          {/* 新建任务表单 */}
          {showAddForm && (
            <div className="mb-4 p-3 rounded border border-cyber-blue/20 bg-space-900/80 space-y-2">
              <div className="text-xs text-cyber-blue font-rajdhani font-bold mb-1">新建任务</div>
              <input
                type="text"
                placeholder="标题"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className="w-full px-2 py-1 text-xs bg-space-900 border border-gray-700 rounded text-gray-200 placeholder-gray-600 focus:border-cyber-blue/50 focus:outline-none"
              />
              <input
                type="text"
                placeholder="描述"
                value={formDesc}
                onChange={(e) => setFormDesc(e.target.value)}
                className="w-full px-2 py-1 text-xs bg-space-900 border border-gray-700 rounded text-gray-200 placeholder-gray-600 focus:border-cyber-blue/50 focus:outline-none"
              />
              <select
                value={formPriority}
                onChange={(e) => setFormPriority(e.target.value as Mission["priority"])}
                className="w-full px-2 py-1 text-xs bg-space-900 border border-gray-700 rounded text-gray-200 focus:border-cyber-blue/50 focus:outline-none"
              >
                <option value="critical">紧急</option>
                <option value="high">高</option>
                <option value="medium">中</option>
                <option value="low">低</option>
              </select>
              <input
                type="text"
                placeholder="负责人"
                value={formAssignee}
                onChange={(e) => setFormAssignee(e.target.value)}
                className="w-full px-2 py-1 text-xs bg-space-900 border border-gray-700 rounded text-gray-200 placeholder-gray-600 focus:border-cyber-blue/50 focus:outline-none"
              />
              <input
                type="text"
                placeholder="截止日期"
                value={formDeadline}
                onChange={(e) => setFormDeadline(e.target.value)}
                className="w-full px-2 py-1 text-xs bg-space-900 border border-gray-700 rounded text-gray-200 placeholder-gray-600 focus:border-cyber-blue/50 focus:outline-none"
              />
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => {
                    if (!formTitle.trim()) return;
                    addMission({
                      title: formTitle.trim(),
                      description: formDesc.trim(),
                      priority: formPriority,
                      status: "planned",
                      progress: 0,
                      assignee: formAssignee.trim(),
                      deadline: formDeadline.trim(),
                      subtasks: [],
                    });
                    setFormTitle("");
                    setFormDesc("");
                    setFormPriority("medium");
                    setFormAssignee("");
                    setFormDeadline("");
                    setShowAddForm(false);
                  }}
                  className="px-3 py-1 text-[10px] border border-cyber-blue/40 text-cyber-blue rounded hover:bg-cyber-blue/10"
                >
                  确认
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-3 py-1 text-[10px] border border-gray-700 text-gray-400 rounded hover:border-gray-500"
                >
                  取消
                </button>
              </div>
            </div>
          )}

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
                    {statusLabels[mission.status]}
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
                    {priorityLabels[selectedMissionData.priority]}
                  </div>
                </div>
                <div>
                  <span className="text-gray-500">状态</span>
                  <div className={`font-rajdhani font-bold mt-0.5 ${getStatusColor(selectedMissionData.status)}`}>
                    {statusLabels[selectedMissionData.status]}
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

              {/* 状态切换按钮 */}
              <div className="flex gap-1.5">
                {selectedMissionData.status !== "in_progress" && (
                  <button
                    onClick={() => setMissionStatus(selectedMissionData.id, "in_progress")}
                    className="flex items-center gap-1 px-2 py-1 text-[10px] border border-cyber-blue/40 text-cyber-blue rounded hover:bg-cyber-blue/10"
                  >
                    <Play size={10} /> 开始
                  </button>
                )}
                {selectedMissionData.status !== "planned" && (
                  <button
                    onClick={() => setMissionStatus(selectedMissionData.id, "planned")}
                    className="px-2 py-1 text-[10px] border border-gray-700 text-gray-400 rounded hover:border-gray-500"
                  >
                    转为计划
                  </button>
                )}
                {selectedMissionData.status !== "completed" && (
                  <button
                    onClick={() => setMissionStatus(selectedMissionData.id, "completed")}
                    className="px-2 py-1 text-[10px] border border-cyber-green/40 text-cyber-green rounded hover:bg-cyber-green/10"
                  >
                    标记完成
                  </button>
                )}
                <button
                  onClick={() => {
                    if (confirm("确定删除此任务？此操作不可撤销。")) {
                      deleteMission(selectedMissionData.id);
                      setSelectedMission(null);
                    }
                  }}
                  className="ml-auto flex items-center gap-1 px-2 py-1 text-[10px] border border-red-800/40 text-red-400 rounded hover:bg-red-900/20"
                >
                  <Trash2 size={10} /> 删除
                </button>
              </div>

              <div>
                <span className="text-xs text-gray-500">子任务（点击切换）</span>
                <div className="space-y-1.5 mt-2">
                  {selectedMissionData.subtasks.map((subtask, i) => (
                    <button
                      key={i}
                      onClick={() => toggleSubtask(selectedMissionData.id, i)}
                      className="w-full flex items-center gap-2 text-xs text-left hover:bg-space-700/30 px-1 py-0.5 rounded transition-colors"
                    >
                      <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${
                        subtask.completed ? "border-cyber-green/50 bg-cyber-green/10" : "border-gray-600"
                      }`}>
                        {subtask.completed && <CheckCircle size={10} className="text-cyber-green" />}
                      </div>
                      <span className={subtask.completed ? "text-gray-500 line-through" : "text-gray-300"}>
                        {subtask.name}
                      </span>
                    </button>
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
