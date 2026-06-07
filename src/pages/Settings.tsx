import { useState } from "react";
import { useSimulationStore } from "@/stores/simulationStore";
import { useStationStore } from "@/stores/stationStore";
import { useResourceStore } from "@/stores/resourceStore";
import { useNavigationStore } from "@/stores/navigationStore";
import { useCommStore } from "@/stores/commStore";
import { useMissionStore } from "@/stores/missionStore";
import { useEventStore } from "@/stores/eventStore";
import { useAlertStore } from "@/stores/alertStore";
import { useOperationLogStore } from "@/stores/operationLogStore";
import { useSidebarStore } from "@/stores/sidebarStore";
import Panel from "@/components/ui/Panel";
import { Settings, RotateCcw, Zap, AlertTriangle, Database, Palette, Info, Gauge, ToggleLeft, ToggleRight, HardDrive, RefreshCw, Monitor } from "lucide-react";
import type { SimulationSpeed } from "@/stores/simulationStore";

const speedOptions: { value: SimulationSpeed; label: string; desc: string }[] = [
  { value: 1, label: "1x", desc: "标准速度" },
  { value: 2, label: "2x", desc: "快速模式" },
  { value: 5, label: "5x", desc: "极速模式" },
];

type SettingsTab = "simulation" | "events" | "display" | "data" | "about";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("simulation");

  const sim = useSimulationStore();
  const eventAutoTrigger = useEventStore((s) => s.autoTriggerEnabled);
  const toggleAutoTrigger = useEventStore((s) => s.toggleAutoTrigger);
  const sidebarCollapsed = useSidebarStore((s) => s.collapsed);

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

  const tabs = [
    { id: "simulation" as const, label: "仿真控制", icon: <Gauge size={12} /> },
    { id: "events" as const, label: "事件系统", icon: <AlertTriangle size={12} /> },
    { id: "display" as const, label: "显示设置", icon: <Palette size={12} /> },
    { id: "data" as const, label: "数据管理", icon: <Database size={12} /> },
    { id: "about" as const, label: "系统信息", icon: <Info size={12} /> },
  ];

  return (
    <div className="space-y-4">
      {/* 页面标题 */}
      <div className="flex items-center gap-2">
        <Settings size={20} className="text-cyber-blue" />
        <h2 className="font-orbitron text-lg text-cyber-blue tracking-wider">系统设置</h2>
      </div>

      {/* 二级导航 */}
      <div className="flex gap-1 bg-space-800/50 p-1 rounded-lg border border-cyber-blue/10">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
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

      {/* 仿真控制 */}
      {activeTab === "simulation" && (
        <div className="grid grid-cols-2 gap-4">
          <Panel title="运行状态" icon={<Zap size={14} />}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-gray-400 font-rajdhani">当前状态</div>
                  <div className={`text-lg font-orbitron font-bold ${sim.running ? "text-cyber-green" : "text-cyber-amber"}`}>
                    {sim.running ? "运行中" : "已暂停"}
                  </div>
                </div>
                <button
                  onClick={sim.toggle}
                  className={`px-4 py-2 text-xs rounded-lg border transition-colors font-rajdhani font-bold ${
                    sim.running
                      ? "border-cyber-amber/40 text-cyber-amber hover:bg-cyber-amber/10"
                      : "border-cyber-green/40 text-cyber-green hover:bg-cyber-green/10"
                  }`}
                >
                  {sim.running ? "暂停仿真" : "恢复仿真"}
                </button>
              </div>

              <div>
                <div className="text-xs text-gray-400 font-rajdhani mb-2">仿真速度</div>
                <div className="grid grid-cols-3 gap-2">
                  {speedOptions.map(({ value, label, desc }) => (
                    <button
                      key={value}
                      onClick={() => sim.setSpeed(value)}
                      className={`p-3 rounded-lg border transition-all duration-200 ${
                        sim.speed === value
                          ? "border-cyber-blue/50 bg-cyber-blue/10 shadow-glow-sm"
                          : "border-gray-700 hover:border-cyber-blue/30"
                      }`}
                    >
                      <div className={`text-lg font-orbitron font-bold ${sim.speed === value ? "text-cyber-blue" : "text-gray-400"}`}>
                        {label}
                      </div>
                      <div className="text-[10px] text-gray-500 mt-1">{desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Panel>

          <Panel title="仿真统计" icon={<Monitor size={14} />}>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-space-900/50 rounded-lg p-4 border border-cyber-blue/10 text-center">
                <div className="text-[10px] text-gray-500 mb-1">仿真天数</div>
                <div className="text-2xl font-orbitron font-bold text-white">D+{Math.floor(sim.elapsedDays)}</div>
              </div>
              <div className="bg-space-900/50 rounded-lg p-4 border border-cyber-blue/10 text-center">
                <div className="text-[10px] text-gray-500 mb-1">仿真 Tick</div>
                <div className="text-2xl font-orbitron font-bold text-white">T{sim.tickCount}</div>
              </div>
              <div className="bg-space-900/50 rounded-lg p-4 border border-cyber-blue/10 text-center">
                <div className="text-[10px] text-gray-500 mb-1">运行时间</div>
                <div className="text-lg font-rajdhani text-gray-300">
                  {Math.floor(sim.elapsedDays * 24)} 小时
                </div>
              </div>
              <div className="bg-space-900/50 rounded-lg p-4 border border-cyber-blue/10 text-center">
                <div className="text-[10px] text-gray-500 mb-1">更新频率</div>
                <div className="text-lg font-rajdhani text-gray-300">
                  {(3000 / sim.speed / 1000).toFixed(1)}s
                </div>
              </div>
            </div>
          </Panel>
        </div>
      )}

      {/* 事件系统 */}
      {activeTab === "events" && (
        <div className="grid grid-cols-2 gap-4">
          <Panel title="事件触发设置" icon={<AlertTriangle size={14} />}>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg border border-gray-800 bg-space-900/30">
                <div>
                  <div className="text-xs text-gray-300 font-rajdhani font-medium">自动事件触发</div>
                  <div className="text-[10px] text-gray-500 mt-1">仿真运行时随机触发太空事件</div>
                </div>
                <button
                  onClick={toggleAutoTrigger}
                  className={`p-1 rounded transition-colors ${
                    eventAutoTrigger ? "text-cyber-green" : "text-gray-500"
                  }`}
                >
                  {eventAutoTrigger ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                </button>
              </div>

              <div className="p-3 rounded-lg border border-gray-800 bg-space-900/30">
                <div className="text-xs text-gray-400 font-rajdhani mb-2">事件类型说明</div>
                <div className="space-y-2 text-[10px]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyber-green" />
                    <span className="text-gray-500">信息事件</span>
                    <span className="text-gray-400">- 补给到达、演练等</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyber-amber" />
                    <span className="text-gray-500">警告事件</span>
                    <span className="text-gray-400">- 太阳耀斑、设备故障等</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyber-red" />
                    <span className="text-gray-500">严重事件</span>
                    <span className="text-gray-400">- 微陨石撞击、反应堆过载等</span>
                  </div>
                </div>
              </div>
            </div>
          </Panel>

          <Panel title="事件历史" icon={<RefreshCw size={14} />}>
            <div className="space-y-3">
              <div className="text-[10px] text-gray-500">
                事件系统会根据当前系统状态自动触发各种太空事件，影响空间站的运行。
              </div>
              <div className="p-3 rounded-lg border border-gray-800 bg-space-900/30">
                <div className="text-xs text-gray-400 font-rajdhani mb-2">事件影响范围</div>
                <div className="space-y-1 text-[10px] text-gray-500">
                  <div>• 能源系统 - 反应堆输出、储能</div>
                  <div>• 生命维持 - 氧气、空气质量</div>
                  <div>• 推进系统 - 推力、燃料消耗</div>
                  <div>• 通信系统 - 信号强度、延迟</div>
                  <div>• 舱室状态 - 完整性、环境参数</div>
                  <div>• 船员健康 - 受伤、心理状态</div>
                </div>
              </div>
              <button
                onClick={clearEventHistory}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs rounded border border-gray-700 text-gray-400 hover:border-cyber-amber/40 hover:text-cyber-amber transition-colors font-rajdhani"
              >
                <RotateCcw size={12} /> 清除事件历史
              </button>
            </div>
          </Panel>
        </div>
      )}

      {/* 显示设置 */}
      {activeTab === "display" && (
        <div className="grid grid-cols-2 gap-4">
          <Panel title="界面设置" icon={<Palette size={14} />}>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg border border-gray-800 bg-space-900/30">
                <div>
                  <div className="text-xs text-gray-300 font-rajdhani font-medium">侧边栏状态</div>
                  <div className="text-[10px] text-gray-500 mt-1">{sidebarCollapsed ? "已折叠" : "已展开"}</div>
                </div>
                <div className={`px-2 py-1 rounded text-[10px] font-rajdhani ${
                  sidebarCollapsed ? "bg-cyber-amber/10 text-cyber-amber" : "bg-cyber-green/10 text-cyber-green"
                }`}>
                  {sidebarCollapsed ? "折叠" : "展开"}
                </div>
              </div>

              <div className="p-3 rounded-lg border border-gray-800 bg-space-900/30">
                <div className="text-xs text-gray-400 font-rajdhani mb-2">主题色彩</div>
                <div className="grid grid-cols-5 gap-2">
                  {[
                    { name: "冰蓝", color: "#00d4ff" },
                    { name: "琥珀", color: "#ff8c00" },
                    { name: "翠绿", color: "#00ff88" },
                    { name: "玫红", color: "#ff3b3b" },
                    { name: "紫罗兰", color: "#a855f7" },
                  ].map((theme) => (
                    <div key={theme.name} className="text-center">
                      <div
                        className="w-8 h-8 rounded-lg mx-auto mb-1 border border-gray-700"
                        style={{ backgroundColor: theme.color, boxShadow: `0 0 10px ${theme.color}40` }}
                      />
                      <div className="text-[10px] text-gray-500">{theme.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Panel>

          <Panel title="显示选项" icon={<Monitor size={14} />}>
            <div className="space-y-3">
              {[
                { label: "扫描线效果", desc: "全息扫描线叠加", enabled: true },
                { label: "星点背景", desc: "深空星点效果", enabled: true },
                { label: "网格背景", desc: "坐标网格叠加", enabled: true },
                { label: "动画效果", desc: "界面过渡动画", enabled: true },
              ].map((option) => (
                <div key={option.label} className="flex items-center justify-between p-3 rounded-lg border border-gray-800 bg-space-900/30">
                  <div>
                    <div className="text-xs text-gray-300 font-rajdhani font-medium">{option.label}</div>
                    <div className="text-[10px] text-gray-500 mt-1">{option.desc}</div>
                  </div>
                  <div className={`p-1 ${option.enabled ? "text-cyber-green" : "text-gray-500"}`}>
                    {option.enabled ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      )}

      {/* 数据管理 */}
      {activeTab === "data" && (
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
      )}

      {/* 系统信息 */}
      {activeTab === "about" && (
        <div className="grid grid-cols-2 gap-4">
          <Panel title="系统信息" icon={<Info size={14} />}>
            <div className="space-y-3">
              <div className="p-3 rounded-lg border border-gray-800 bg-space-900/30">
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">系统名称</span>
                    <span className="text-white font-rajdhani">领航员空间站管理系统</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">系统版本</span>
                    <span className="text-cyber-blue font-orbitron font-bold">v3.0.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">仿真引擎</span>
                    <span className="text-white font-rajdhani">Navigator-ISS Sim Core</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">数据来源</span>
                    <span className="text-white font-rajdhani">前端模拟（无后端）</span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg border border-gray-800 bg-space-900/30">
                <div className="text-xs text-gray-400 font-rajdhani mb-2">功能模块</div>
                <div className="grid grid-cols-2 gap-1 text-[10px]">
                  {["状态监控", "资源管理", "航线导航", "通信系统", "任务管理", "船员系统", "运维中心", "科研中心"].map((module) => (
                    <div key={module} className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyber-green" />
                      <span className="text-gray-400">{module}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Panel>

          <Panel title="技术栈" icon={<Settings size={14} />}>
            <div className="space-y-3">
              <div className="p-3 rounded-lg border border-gray-800 bg-space-900/30">
                <div className="text-xs text-gray-400 font-rajdhani mb-2">核心技术</div>
                <div className="space-y-2">
                  {[
                    { name: "React", version: "18.3", desc: "UI 框架" },
                    { name: "TypeScript", version: "5.8", desc: "类型系统" },
                    { name: "Zustand", version: "5.0", desc: "状态管理" },
                    { name: "Vite", version: "6.3", desc: "构建工具" },
                    { name: "Tailwind", version: "3.4", desc: "样式框架" },
                    { name: "Recharts", version: "2.15", desc: "图表库" },
                  ].map((tech) => (
                    <div key={tech.name} className="flex items-center justify-between">
                      <div>
                        <span className="text-xs text-white font-rajdhani">{tech.name}</span>
                        <span className="text-[10px] text-gray-500 ml-2">{tech.desc}</span>
                      </div>
                      <span className="text-[10px] text-cyber-blue font-rajdhani">v{tech.version}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-lg border border-cyber-blue/20 bg-cyber-blue/5">
                <div className="text-xs text-cyber-blue font-rajdhani mb-1">关于项目</div>
                <div className="text-[10px] text-gray-400">
                  《流浪地球》领航员空间站模拟管理界面，提供空间站日常运营核心功能的可视化交互体验。
                </div>
              </div>
            </div>
          </Panel>
        </div>
      )}
    </div>
  );
}

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
