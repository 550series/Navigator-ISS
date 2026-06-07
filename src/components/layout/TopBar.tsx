import { useStationStore } from "@/stores/stationStore";
import { useSimulationStore } from "@/stores/simulationStore";
import { useTimeStore } from "@/stores/timeStore";
import { Bell, Clock, Pause, Play, Gauge, Sun, Moon, Cpu, HardDrive } from "lucide-react";
import { useState, useEffect } from "react";
import type { SimulationSpeed } from "@/stores/simulationStore";

const speedLabels: Record<SimulationSpeed, string> = { 1: "1x", 2: "2x", 5: "5x" };
const speedOptions: SimulationSpeed[] = [1, 2, 5];

export default function TopBar() {
  const alerts = useStationStore((s) => s.alerts);
  const acknowledgeAlert = useStationStore((s) => s.acknowledgeAlert);
  const { running, speed, toggle, setSpeed, tickCount, elapsedDays } = useSimulationStore();
  const { getTimeString, getDateString, isDaylight } = useTimeStore();

  const [currentTime, setCurrentTime] = useState("");
  const [showAlerts, setShowAlerts] = useState(false);

  const unacknowledgedCount = alerts.filter((a) => !a.acknowledged).length;
  const criticalCount = alerts.filter((a) => a.level === "critical" && !a.acknowledged).length;

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString("zh-CN", { hour12: false }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="h-12 border-b border-cyber-blue/15 bg-space-900/80 backdrop-blur-md flex items-center justify-between px-4 relative z-50">
      {/* 左侧区域 */}
      <div className="flex items-center gap-4">
        <h1 className="font-orbitron text-sm text-cyber-blue tracking-wider">
          领航员空间站管理系统
        </h1>
        <span className="text-[10px] text-gray-600 font-rajdhani px-2 py-0.5 rounded-full border border-gray-800 bg-space-800/50">
          v3.0.0
        </span>
      </div>

      {/* 右侧状态区 */}
      <div className="flex items-center gap-2">
        {/* 仿真控制区 */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-cyber-blue/15 bg-space-800/50">
          <button
            onClick={toggle}
            className={`p-1 rounded transition-colors ${
              running
                ? "text-cyber-green hover:text-cyber-green/80"
                : "text-cyber-amber hover:text-cyber-amber/80"
            }`}
            title={running ? "暂停仿真" : "恢复仿真"}
          >
            {running ? <Pause size={12} /> : <Play size={12} />}
          </button>
          <div className="w-px h-4 bg-gray-700" />
          <div className="flex items-center gap-0.5">
            <Gauge size={10} className="text-gray-500" />
            {speedOptions.map((s) => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className={`text-[10px] px-1 py-0.5 rounded transition-colors font-rajdhani font-bold ${
                  speed === s
                    ? "bg-cyber-blue/20 text-cyber-blue"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                {speedLabels[s]}
              </button>
            ))}
          </div>
          <div className="w-px h-4 bg-gray-700" />
          <span className="text-[10px] text-gray-500 font-rajdhani">
            D+{Math.floor(elapsedDays)} | T{tickCount}
          </span>
        </div>

        {/* 时间显示 */}
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg border border-gray-800/50 bg-space-800/30">
          {isDaylight ? (
            <Sun size={12} className="text-cyber-amber" />
          ) : (
            <Moon size={12} className="text-cyber-blue" />
          )}
          <span className="text-[11px] font-rajdhani text-gray-300">{getTimeString()}</span>
          <span className="text-[10px] text-gray-600">{getDateString()}</span>
        </div>

        {/* 系统状态 */}
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg border border-cyber-green/15 bg-cyber-green/5">
          <div className="w-1.5 h-1.5 rounded-full bg-cyber-green status-dot" />
          <span className="text-[10px] text-cyber-green font-rajdhani font-medium">ONLINE</span>
        </div>

        {/* 系统资源 */}
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg border border-gray-800/50 bg-space-800/30">
          <Cpu size={10} className="text-gray-500" />
          <span className="text-[10px] text-gray-400 font-rajdhani">45%</span>
          <div className="w-px h-3 bg-gray-700" />
          <HardDrive size={10} className="text-gray-500" />
          <span className="text-[10px] text-gray-400 font-rajdhani">62%</span>
        </div>

        {/* 系统时间 */}
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg border border-gray-800/50 bg-space-800/30">
          <Clock size={12} className="text-gray-500" />
          <span className="text-[10px] font-rajdhani text-gray-400 tracking-wider">{currentTime}</span>
        </div>

        {/* 告警按钮 */}
        <div className="relative">
          <button
            onClick={() => setShowAlerts(!showAlerts)}
            className={`flex items-center gap-1.5 text-xs px-2 py-1.5 rounded-lg border transition-all duration-200 ${
              criticalCount > 0
                ? "border-cyber-red/40 text-cyber-red bg-cyber-red/5 shadow-glow-red"
                : unacknowledgedCount > 0
                ? "border-cyber-amber/40 text-cyber-amber bg-cyber-amber/5 shadow-glow-amber"
                : "border-gray-700 text-gray-400 hover:border-cyber-blue/30 hover:text-cyber-blue"
            }`}
          >
            <Bell size={12} />
            {unacknowledgedCount > 0 && (
              <span className="font-rajdhani font-bold text-[10px]">{unacknowledgedCount}</span>
            )}
          </button>

          {/* 告警下拉面板 */}
          {showAlerts && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-space-900/95 backdrop-blur-md border border-cyber-blue/20 rounded-lg shadow-xl shadow-black/50 z-50 animate-slide-down">
              <div className="px-3 py-2 border-b border-cyber-blue/10 flex items-center justify-between">
                <span className="text-xs font-orbitron text-cyber-blue tracking-wider">系统告警</span>
                <span className="text-[10px] text-gray-500 font-rajdhani">{alerts.length} 条</span>
              </div>
              <div className="max-h-60 overflow-y-auto">
                {alerts.length === 0 ? (
                  <div className="px-3 py-6 text-center">
                    <Bell size={24} className="mx-auto mb-2 text-gray-700" />
                    <div className="text-xs text-gray-500">暂无告警</div>
                  </div>
                ) : (
                  alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`px-3 py-2.5 border-b border-gray-800/50 text-xs transition-colors hover:bg-space-800/50 ${
                        !alert.acknowledged ? "bg-space-800/30" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className={`font-medium font-rajdhani ${
                            alert.level === "critical"
                              ? "text-cyber-red"
                              : alert.level === "warning"
                              ? "text-cyber-amber"
                              : "text-cyber-blue"
                          }`}
                        >
                          {alert.level === "critical" ? "!!" : alert.level === "warning" ? "!" : "i"}{" "}
                          {alert.source}
                        </span>
                        <span className="text-gray-600 text-[10px] font-rajdhani">{alert.timestamp}</span>
                      </div>
                      <p className="text-gray-400 leading-relaxed">{alert.message}</p>
                      {!alert.acknowledged && (
                        <button
                          onClick={() => acknowledgeAlert(alert.id)}
                          className="mt-1.5 text-cyber-blue hover:text-cyber-blue/80 text-[10px] font-rajdhani font-medium"
                        >
                          确认
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
