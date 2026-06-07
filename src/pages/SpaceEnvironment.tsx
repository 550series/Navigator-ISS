import { useSpaceEnvironmentStore } from "@/stores/spaceEnvironmentStore";
import Panel from "@/components/ui/Panel";
import StatusCard from "@/components/ui/StatusCard";
import ProgressBar from "@/components/ui/ProgressBar";
import { Globe, Sun, Compass, Telescope, AlertTriangle, Wind, Radiation } from "lucide-react";
import { useState } from "react";

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

export default function SpaceEnvironment() {
  const { planets, weather, attitude, celestialEvents, observationLogs, getThreatLevel } = useSpaceEnvironmentStore();
  const [activeTab, setActiveTab] = useState<"planets" | "weather" | "attitude" | "events" | "logs">("planets");

  const threatLevel = getThreatLevel();

  return (
    <div className="space-y-4">
      {/* 顶部统计 */}
      <div className="grid grid-cols-5 gap-4">
        <StatusCard
          title="威胁等级"
          value={threatLabels[threatLevel]}
          icon={<AlertTriangle size={16} />}
          status={threatLevel === "low" ? "normal" : threatLevel === "moderate" ? "warning" : "critical"}
        />
        <StatusCard
          title="太阳风速"
          value={Math.round(weather.solarWindSpeed)}
          unit="km/s"
          icon={<Wind size={16} />}
        />
        <StatusCard
          title="辐射水平"
          value={weather.radiationLevel.toFixed(2)}
          unit="mSv/h"
          icon={<Radiation size={16} />}
          status={weather.radiationLevel > 1 ? "warning" : "normal"}
        />
        <StatusCard
          title="姿态稳定性"
          value={attitude.stability.toFixed(1)}
          unit="%"
          icon={<Compass size={16} />}
        />
        <StatusCard
          title="观测日志"
          value={observationLogs.length}
          unit="条"
          icon={<Telescope size={16} />}
        />
      </div>

      {/* 标签页切换 */}
      <div className="flex gap-2">
        {(["planets", "weather", "attitude", "events", "logs"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-xs rounded border transition-colors font-rajdhani font-bold ${
              activeTab === tab
                ? "border-cyber-blue/50 bg-cyber-blue/10 text-cyber-blue"
                : "border-gray-700 text-gray-400 hover:border-cyber-blue/30"
            }`}
          >
            {tab === "planets" ? "行星追踪" :
             tab === "weather" ? "太空天气" :
             tab === "attitude" ? "姿态控制" :
             tab === "events" ? "天文事件" : "观测日志"}
          </button>
        ))}
      </div>

      {/* 行星追踪 */}
      {activeTab === "planets" && (
        <div className="grid grid-cols-2 gap-4">
          <Panel title="太阳系行星位置" icon={<Globe size={14} />} className="col-span-2">
            <div className="relative h-80 bg-space-900/50 rounded border border-cyber-blue/10">
              {/* Sun */}
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <div className="w-12 h-12 rounded-full bg-yellow-500 shadow-[0_0_30px_rgba(234,179,8,0.5)]" />
                <div className="text-[10px] text-center text-yellow-500 mt-1 font-rajdhani">太阳</div>
              </div>

              {/* Planets */}
              {planets.map((planet) => (
                <div
                  key={planet.id}
                  className="absolute transition-all duration-1000"
                  style={{
                    left: `${planet.position.x}%`,
                    top: `${planet.position.y}%`,
                  }}
                >
                  <div
                    className="w-6 h-6 rounded-full shadow-lg"
                    style={{
                      backgroundColor: planet.color,
                      boxShadow: `0 0 10px ${planet.color}40`,
                    }}
                  />
                  <div className="text-[10px] text-center text-gray-400 mt-1 font-rajdhani whitespace-nowrap">
                    {planet.name}
                  </div>
                  <div className="text-[8px] text-center text-gray-600 font-rajdhani">
                    {planet.currentDistance.toFixed(1)} AU
                  </div>
                </div>
              ))}

              {/* Orbit lines */}
              <svg className="absolute inset-0 w-full h-full" style={{ zIndex: -1 }}>
                {planets.map((planet) => (
                  <ellipse
                    key={planet.id}
                    cx="50%"
                    cy="50%"
                    rx={`${planet.distance * 8}%`}
                    ry={`${planet.distance * 6}%`}
                    fill="none"
                    stroke="rgba(0,212,255,0.1)"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                ))}
              </svg>
            </div>
          </Panel>

          {planets.map((planet) => (
            <Panel key={planet.id} title={planet.name} icon={<Globe size={14} />}>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">英文名</span>
                  <span className="text-gray-300">{planet.nameEn}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">距太阳</span>
                  <span className="text-gray-300">{planet.distance} AU</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">当前距离</span>
                  <span className="text-cyber-blue font-rajdhani">{planet.currentDistance.toFixed(2)} AU</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">直径</span>
                  <span className="text-gray-300">{planet.diameter.toLocaleString()} km</span>
                </div>
                <div className="text-[10px] text-gray-500 mt-2">{planet.description}</div>
              </div>
            </Panel>
          ))}
        </div>
      )}

      {/* 太空天气 */}
      {activeTab === "weather" && (
        <div className="grid grid-cols-2 gap-4">
          <Panel title="太阳风" icon={<Sun size={14} />}>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">风速</span>
                  <span className="text-gray-500">{Math.round(weather.solarWindSpeed)} km/s</span>
                </div>
                <ProgressBar value={weather.solarWindSpeed} max={1000} showPercent={false} />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">密度</span>
                  <span className="text-gray-500">{weather.solarWindDensity.toFixed(1)} p/cm³</span>
                </div>
                <ProgressBar value={weather.solarWindDensity} max={20} showPercent={false} />
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3">
                <div className="bg-space-900/50 p-2 rounded border border-gray-800">
                  <div className="text-[10px] text-gray-500">耀斑风险</div>
                  <div className={`text-sm font-rajdhani font-bold ${threatColors[weather.solarFlareRisk]}`}>
                    {weather.solarFlareRisk === "low" ? "低" :
                     weather.solarFlareRisk === "moderate" ? "中等" :
                     weather.solarFlareRisk === "high" ? "高" : "极端"}
                  </div>
                </div>
                <div className="bg-space-900/50 p-2 rounded border border-gray-800">
                  <div className="text-[10px] text-gray-500">地磁暴</div>
                  <div className={`text-sm font-rajdhani font-bold ${
                    weather.geomagneticStorm === "none" ? "text-cyber-green" : "text-cyber-amber"
                  }`}>
                    {weather.geomagneticStorm === "none" ? "无" :
                     weather.geomagneticStorm === "minor" ? "轻微" :
                     weather.geomagneticStorm === "moderate" ? "中等" : "严重"}
                  </div>
                </div>
              </div>
            </div>
          </Panel>

          <Panel title="辐射环境" icon={<Radiation size={14} />}>
            <div className="space-y-3">
              <ProgressBar value={weather.cosmicRayLevel} max={100} label="宇宙射线" />
              <ProgressBar value={weather.magnetosphereStrength} max={100} label="磁层强度" />
              <ProgressBar value={weather.radiationLevel * 50} max={100} label="辐射水平" />
            </div>
          </Panel>

          <Panel title="天气预报" icon={<Wind size={14} />} className="col-span-2">
            <div className="text-xs text-gray-400">
              {weather.solarFlareRisk === "high" || weather.geomagneticStorm !== "none" ? (
                <div className="flex items-center gap-2 text-cyber-amber">
                  <AlertTriangle size={14} />
                  <span>当前存在太空天气威胁，建议加强辐射防护</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-cyber-green">
                  <Sun size={14} />
                  <span>太空天气状况良好，适合舱外活动</span>
                </div>
              )}
            </div>
          </Panel>
        </div>
      )}

      {/* 姿态控制 */}
      {activeTab === "attitude" && (
        <div className="grid grid-cols-2 gap-4">
          <Panel title="姿态角度" icon={<Compass size={14} />}>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-space-900/50 p-3 rounded border border-gray-800 text-center">
                  <div className="text-[10px] text-gray-500">翻滚</div>
                  <div className="text-lg font-orbitron font-bold text-white">{attitude.roll.toFixed(2)}°</div>
                </div>
                <div className="bg-space-900/50 p-3 rounded border border-gray-800 text-center">
                  <div className="text-[10px] text-gray-500">俯仰</div>
                  <div className="text-lg font-orbitron font-bold text-white">{attitude.pitch.toFixed(2)}°</div>
                </div>
                <div className="bg-space-900/50 p-3 rounded border border-gray-800 text-center">
                  <div className="text-[10px] text-gray-500">偏航</div>
                  <div className="text-lg font-orbitron font-bold text-white">{attitude.yaw.toFixed(2)}°</div>
                </div>
              </div>
              <ProgressBar value={attitude.stability} max={100} label="稳定性" />
            </div>
          </Panel>

          <Panel title="角速度" icon={<Compass size={14} />}>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">X轴</span>
                <span className="text-gray-300 font-rajdhani">{attitude.angularVelocity.x.toFixed(3)} °/s</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Y轴</span>
                <span className="text-gray-300 font-rajdhani">{attitude.angularVelocity.y.toFixed(3)} °/s</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Z轴</span>
                <span className="text-gray-300 font-rajdhani">{attitude.angularVelocity.z.toFixed(3)} °/s</span>
              </div>
              <div className="mt-3 p-2 bg-space-900/50 rounded border border-gray-800">
                <div className="text-[10px] text-gray-500">当前模式</div>
                <div className="text-sm font-rajdhani text-cyber-blue">
                  {attitude.orientation === "sun_pointing" ? "太阳指向" :
                   attitude.orientation === "earth_pointing" ? "地球指向" :
                   attitude.orientation === "inertial" ? "惯性姿态" : "手动控制"}
                </div>
              </div>
            </div>
          </Panel>
        </div>
      )}

      {/* 天文事件 */}
      {activeTab === "events" && (
        <Panel title="天文事件日历" icon={<Telescope size={14} />}>
          <div className="space-y-3">
            {celestialEvents.map((event) => (
              <div key={event.id} className="p-3 rounded border border-gray-800 hover:border-cyber-blue/30 transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-rajdhani font-bold text-white">{event.name}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                        event.visibility === "excellent" ? "bg-cyber-green/10 text-cyber-green" :
                        event.visibility === "good" ? "bg-cyber-blue/10 text-cyber-blue" :
                        "bg-gray-800 text-gray-400"
                      }`}>
                        {event.visibility === "excellent" ? "极佳" :
                         event.visibility === "good" ? "良好" : "较差"}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400">{event.description}</div>
                    <div className="text-[10px] text-gray-500 mt-1">
                      {event.startTime} - {event.endTime}
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-1 rounded bg-space-700 text-gray-400">
                    {event.type === "meteor_shower" ? "流星雨" :
                     event.type === "eclipse" ? "食" :
                     event.type === "conjunction" ? "合" :
                     event.type === "transit" ? "凌" : "彗星"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      )}

      {/* 观测日志 */}
      {activeTab === "logs" && (
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
                    {log.type === "visual" ? "目视" :
                     log.type === "instrument" ? "仪器" : "摄影"}
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
