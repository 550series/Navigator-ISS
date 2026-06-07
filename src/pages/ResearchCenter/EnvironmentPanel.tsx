import { memo } from "react";
import { useSpaceEnvironmentStore } from "@/stores/spaceEnvironmentStore";
import Panel from "@/components/ui/Panel";
import ProgressBar from "@/components/ui/ProgressBar";
import { Globe, Sun, Compass } from "lucide-react";

const EnvironmentPanel = memo(function EnvironmentPanel() {
  const { planets, weather, attitude } = useSpaceEnvironmentStore();

  return (
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
              <div className={`text-sm font-rajdhani font-bold ${weather.solarFlareRisk === "low" ? "text-cyber-green" : weather.solarFlareRisk === "moderate" ? "text-cyber-amber" : "text-cyber-red"}`}>
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
    </div>
  );
});

export default EnvironmentPanel;
