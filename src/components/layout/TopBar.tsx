import { useStationStore } from "@/stores/stationStore";
import { Bell, Wifi, Clock } from "lucide-react";
import { useState, useEffect } from "react";

/** 顶部状态栏组件 */
export default function TopBar() {
  const alerts = useStationStore((s) => s.alerts);
  const acknowledgeAlert = useStationStore((s) => s.acknowledgeAlert);
  const [currentTime, setCurrentTime] = useState("");
  const [showAlerts, setShowAlerts] = useState(false);

  const unacknowledgedCount = alerts.filter((a) => !a.acknowledged).length;
  const criticalCount = alerts.filter((a) => a.level === "critical" && !a.acknowledged).length;

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("zh-CN", { hour12: false })
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="h-12 border-b border-cyber-blue/20 bg-space-900/80 backdrop-blur-sm flex items-center justify-between px-4">
      {/* 左侧标题 */}
      <div className="flex items-center gap-3">
        <h1 className="font-orbitron text-sm text-cyber-blue tracking-wider">
          领航员空间站管理系统
        </h1>
        <span className="text-[10px] text-gray-600 font-rajdhani">v2.847</span>
      </div>

      {/* 右侧状态 */}
      <div className="flex items-center gap-4">
        {/* 通信状态 */}
        <div className="flex items-center gap-1.5 text-xs">
          <Wifi size={14} className="text-cyber-green" />
          <span className="text-gray-400 font-rajdhani">LINK ACTIVE</span>
        </div>

        {/* 时间 */}
        <div className="flex items-center gap-1.5 text-xs">
          <Clock size={14} className="text-gray-500" />
          <span className="font-rajdhani text-gray-400 tracking-wider">{currentTime}</span>
        </div>

        {/* 告警 */}
        <div className="relative">
          <button
            onClick={() => setShowAlerts(!showAlerts)}
            className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded border transition-colors ${
              criticalCount > 0
                ? "border-cyber-red/40 text-cyber-red bg-cyber-red/5"
                : unacknowledgedCount > 0
                ? "border-cyber-amber/40 text-cyber-amber bg-cyber-amber/5"
                : "border-gray-700 text-gray-400"
            }`}
          >
            <Bell size={14} />
            {unacknowledgedCount > 0 && (
              <span className="font-rajdhani font-bold">{unacknowledgedCount}</span>
            )}
          </button>

          {/* 告警下拉面板 */}
          {showAlerts && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-space-800 border border-cyber-blue/20 rounded shadow-xl shadow-black/50 z-50">
              <div className="px-3 py-2 border-b border-cyber-blue/10 flex items-center justify-between">
                <span className="text-xs font-orbitron text-cyber-blue">系统告警</span>
                <span className="text-[10px] text-gray-500">{alerts.length} 条记录</span>
              </div>
              <div className="max-h-60 overflow-y-auto">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`px-3 py-2 border-b border-gray-800/50 text-xs ${
                      !alert.acknowledged ? "bg-space-700/50" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={`font-medium ${
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
                      <span className="text-gray-600 text-[10px]">{alert.timestamp}</span>
                    </div>
                    <p className="text-gray-400">{alert.message}</p>
                    {!alert.acknowledged && (
                      <button
                        onClick={() => acknowledgeAlert(alert.id)}
                        className="mt-1 text-cyber-blue hover:text-cyber-blue/80 text-[10px]"
                      >
                        确认
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
