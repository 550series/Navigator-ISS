import { useSimulationStore } from "@/stores/simulationStore";
import { useStationStore } from "@/stores/stationStore";
import { useResourceStore } from "@/stores/resourceStore";
import { useNavigationStore } from "@/stores/navigationStore";
import { useCommStore } from "@/stores/commStore";
import { useMissionStore } from "@/stores/missionStore";
import { useEventStore } from "@/stores/eventStore";
import { useAlertStore } from "@/stores/alertStore";
import { useOperationLogStore } from "@/stores/operationLogStore";
import Panel from "@/components/ui/Panel";
import { Settings, RotateCcw, Zap, AlertTriangle, Database } from "lucide-react";
import type { SimulationSpeed } from "@/stores/simulationStore";

const speedOptions: { value: SimulationSpeed; label: string }[] = [
  { value: 1, label: "1x（标准）" },
  { value: 2, label: "2x（快速）" },
  { value: 5, label: "5x（极速）" },
];

/** 系统设置页面 */
export default function SettingsPage() {
  const sim = useSimulationStore();
  const eventAutoTrigger = useEventStore((s) => s.autoTriggerEnabled);
  const toggleAutoTrigger = useEventStore((s) => s.toggleAutoTrigger);

  const resetStation = useStationStore((s) => s.resetAll);
  const resetResource = useResourceStore((s) => s.resetAll);
  const resetNavigation = useNavigationStore((s) => s.resetAll);
  const resetComm = useCommStore((s) => s.resetAll);
  const resetMissions = useMissionStore((s) => s.resetMissions);
  const clearEventHistory = useEventStore((s) => s.clearHistory);
  const clearAlerts = useAlertStore((s) => s.clearResolved);
  const clearLogs = useOperationLogStore((s) => s.clearLogs);

  /** 重置所有数据 */
  const handleResetAll = () => {
    if (!confirm("确定重置所有系统数据到初始状态？此操作不可撤销。")) return;
    resetStation();
    resetResource();
    resetNavigation();
    resetComm();
    resetMissions();
    clearEventHistory();
    clearAlerts();
    clearLogs();
    sim.resetTick();
  };

  /** 清除 localStorage */
  const handleClearStorage = () => {
    if (!confirm("确定清除所有本地存储数据？页面将刷新。")) return;
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="space-y-4 max-w-3xl">
      {/* 仿真控制 */}
      <Panel title="仿真控制" icon={<Zap size={14} />}>
        <div className="space-y-4">
          {/* 运行状态 */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-300 font-rajdhani">运行状态</div>
              <div className={`text-sm font-orbitron font-bold ${sim.running ? "text-cyber-green" : "text-cyber-amber"}`}>
                {sim.running ? "运行中" : "已暂停"}
              </div>
            </div>
            <button
              onClick={sim.toggle}
              className={`px-4 py-2 text-xs rounded border transition-colors font-rajdhani font-bold ${
                sim.running
                  ? "border-cyber-amber/40 text-cyber-amber hover:bg-cyber-amber/10"
                  : "border-cyber-green/40 text-cyber-green hover:bg-cyber-green/10"
              }`}
            >
              {sim.running ? "暂停仿真" : "恢复仿真"}
            </button>
          </div>

          {/* 速度选择 */}
          <div>
            <div className="text-xs text-gray-400 font-rajdhani mb-2">仿真速度</div>
            <div className="flex gap-2">
              {speedOptions.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => sim.setSpeed(value)}
                  className={`flex-1 px-3 py-2 text-xs rounded border transition-colors font-rajdhani ${
                    sim.speed === value
                      ? "border-cyber-blue/50 bg-cyber-blue/10 text-cyber-blue"
                      : "border-gray-700 text-gray-400 hover:border-cyber-blue/30"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* 仿真统计 */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-space-900/50 rounded p-3 border border-cyber-blue/10">
              <div className="text-[10px] text-gray-500">仿真天数</div>
              <div className="text-lg font-orbitron font-bold text-white">D+{Math.floor(sim.elapsedDays)}</div>
            </div>
            <div className="bg-space-900/50 rounded p-3 border border-cyber-blue/10">
              <div className="text-[10px] text-gray-500">仿真 Tick</div>
              <div className="text-lg font-orbitron font-bold text-white">T{sim.tickCount}</div>
            </div>
          </div>
        </div>
      </Panel>

      {/* 事件系统 */}
      <Panel title="事件系统" icon={<AlertTriangle size={14} />}>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-300 font-rajdhani">自动事件触发</div>
              <div className="text-[10px] text-gray-500">仿真运行时随机触发太空事件</div>
            </div>
            <button
              onClick={toggleAutoTrigger}
              className={`px-3 py-1.5 text-xs rounded border transition-colors font-rajdhani font-bold ${
                eventAutoTrigger
                  ? "border-cyber-green/40 text-cyber-green hover:bg-cyber-green/10"
                  : "border-gray-600 text-gray-500 hover:border-gray-500"
              }`}
            >
              {eventAutoTrigger ? "已开启" : "已关闭"}
            </button>
          </div>
        </div>
      </Panel>

      {/* 数据管理 */}
      <Panel title="数据管理" icon={<Database size={14} />}>
        <div className="space-y-3">
          <div className="text-[10px] text-gray-500 mb-2">
            重置各子系统数据到初始状态。仿真数据会继续运行，但数值恢复为默认值。
          </div>

          <div className="grid grid-cols-2 gap-2">
            <ResetButton label="空间站状态" onReset={resetStation} />
            <ResetButton label="资源与人员" onReset={resetResource} />
            <ResetButton label="导航数据" onReset={resetNavigation} />
            <ResetButton label="通信系统" onReset={resetComm} />
            <ResetButton label="任务列表" onReset={resetMissions} />
            <ResetButton label="事件历史" onReset={clearEventHistory} />
            <ResetButton label="已解决告警" onReset={clearAlerts} />
            <ResetButton label="操作日志" onReset={clearLogs} />
          </div>

          <div className="border-t border-gray-800 pt-3 space-y-2">
            <button
              onClick={handleResetAll}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs rounded border border-cyber-red/40 text-cyber-red hover:bg-cyber-red/10 transition-colors font-rajdhani font-bold"
            >
              <RotateCcw size={12} /> 重置所有系统
            </button>
            <button
              onClick={handleClearStorage}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs rounded border border-gray-700 text-gray-500 hover:border-gray-500 hover:text-gray-300 transition-colors font-rajdhani"
            >
              <Database size={12} /> 清除本地存储并刷新
            </button>
          </div>
        </div>
      </Panel>

      {/* 关于 */}
      <Panel title="关于系统" icon={<Settings size={14} />}>
        <div className="space-y-2 text-xs text-gray-400">
          <div className="flex justify-between">
            <span className="text-gray-500">系统版本</span>
            <span className="text-white font-rajdhani">v3.0.0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">仿真引擎</span>
            <span className="text-white font-rajdhani">Navigator-ISS Sim Core</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">技术栈</span>
            <span className="text-white font-rajdhani">React + Zustand + Recharts</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">数据来源</span>
            <span className="text-white font-rajdhani">前端模拟（无后端）</span>
          </div>
        </div>
      </Panel>
    </div>
  );
}

/** 单项重置按钮 */
function ResetButton({ label, onReset }: { label: string; onReset: () => void }) {
  return (
    <button
      onClick={() => {
        if (confirm(`确定重置「${label}」数据？`)) onReset();
      }}
      className="flex items-center gap-1.5 px-3 py-2 text-[10px] rounded border border-gray-700 text-gray-400 hover:border-cyber-amber/40 hover:text-cyber-amber transition-colors font-rajdhani"
    >
      <RotateCcw size={10} /> {label}
    </button>
  );
}
