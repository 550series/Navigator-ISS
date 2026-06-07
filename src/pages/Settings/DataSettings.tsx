import { memo } from "react";
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
import { RotateCcw, Database, HardDrive } from "lucide-react";

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

const DataSettings = memo(function DataSettings() {
  const sim = useSimulationStore();
  const resetStation = useStationStore((s) => s.resetAll);
  const resetResource = useResourceStore((s) => s.resetAll);
  const resetNavigation = useNavigationStore((s) => s.resetAll);
  const resetComm = useCommStore((s) => s.resetAll);
  const resetMissions = useMissionStore((s) => s.resetMissions);
  const clearEventHistory = useEventStore((s) => s.clearHistory);
  const clearAlerts = useAlertStore((s) => s.clearResolved);
  const clearLogs = useOperationLogStore((s) => s.clearLogs);

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

  const handleClearStorage = () => {
    if (!confirm("确定清除所有本地存储数据？页面将刷新。")) return;
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <Panel title="子系统重置" icon={<RotateCcw size={14} />}>
        <div className="space-y-3">
          <div className="text-[10px] text-gray-500 mb-2">
            重置各子系统数据到初始状态。仿真会继续运行，但数值恢复为默认值。
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
        </div>
      </Panel>

      <Panel title="全局操作" icon={<Database size={14} />}>
        <div className="space-y-3">
          <div className="p-3 rounded-lg border border-cyber-red/20 bg-cyber-red/5">
            <div className="text-xs text-cyber-red font-rajdhani font-bold mb-1">危险操作</div>
            <div className="text-[10px] text-gray-400 mb-3">
              以下操作不可撤销，请谨慎执行。
            </div>
            <div className="space-y-2">
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
                <HardDrive size={12} /> 清除本地存储并刷新
              </button>
            </div>
          </div>

          <div className="p-3 rounded-lg border border-gray-800 bg-space-900/30">
            <div className="text-xs text-gray-400 font-rajdhani mb-2">存储信息</div>
            <div className="space-y-1 text-[10px]">
              <div className="flex justify-between">
                <span className="text-gray-500">存储类型</span>
                <span className="text-gray-300">localStorage</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">数据持久化</span>
                <span className="text-cyber-green">已启用</span>
              </div>
            </div>
          </div>
        </div>
      </Panel>
    </div>
  );
});

export default DataSettings;
