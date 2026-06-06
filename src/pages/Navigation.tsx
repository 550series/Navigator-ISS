import { useNavigationStore } from "@/stores/navigationStore";
import Panel from "@/components/ui/Panel";
import StatusCard from "@/components/ui/StatusCard";
import ProgressBar from "@/components/ui/ProgressBar";
import { formatNumber } from "@/utils/formatters";
import { Navigation, Compass, Globe, Sun, Waves, Magnet } from "lucide-react";

/** 航线规划与导航页面 */
export default function NavigationPage() {
  const { navigation, astronomical } = useNavigationStore();

  const progressPercent = (navigation.currentDistance / navigation.totalDistance) * 100;

  return (
    <div className="space-y-4">
      {/* 顶部指标 */}
      <div className="grid grid-cols-4 gap-4">
        <StatusCard title="航行速度" value={formatNumber(navigation.speed * 1000, 2)} unit="‰ c" icon={<Navigation size={16} />} />
        <StatusCard title="航程进度" value={formatNumber(progressPercent, 2)} unit="%" icon={<Compass size={16} />} />
        <StatusCard title="轨道偏差" value={formatNumber(navigation.deviation * 1000, 2)} unit="‰" />
        <StatusCard title="航向角" value={formatNumber(navigation.heading, 1)} unit="°" />
      </div>

      {/* 航线可视化 + 航点列表 */}
      <div className="grid grid-cols-3 gap-4">
        <Panel title="航线可视化" icon={<Navigation size={14} />} className="col-span-2">
          <div className="relative h-72">
            <svg viewBox="0 0 600 250" className="w-full h-full">
              {/* 星点背景 */}
              {Array.from({ length: 30 }, (_, i) => (
                <circle
                  key={i}
                  cx={Math.random() * 600}
                  cy={Math.random() * 250}
                  r={Math.random() * 1.5 + 0.3}
                  fill="white"
                  opacity={Math.random() * 0.5 + 0.1}
                />
              ))}

              {/* 航线轨迹 */}
              <path
                d="M 50 200 C 150 180, 200 120, 300 100 S 450 80, 550 50"
                fill="none"
                stroke="#00d4ff"
                strokeWidth="1.5"
                strokeDasharray="6 3"
                opacity="0.4"
              />
              <path
                d="M 50 200 C 150 180, 200 120, 300 100"
                fill="none"
                stroke="#00d4ff"
                strokeWidth="2"
                opacity="0.8"
              />

              {/* 地球标记 */}
              <circle cx="50" cy="200" r="8" fill="#1a3355" stroke="#00d4ff" strokeWidth="1" />
              <text x="50" y="218" textAnchor="middle" fill="#4a5568" fontSize="9" fontFamily="Rajdhani">地球</text>

              {/* 当前位置 */}
              <circle cx="300" cy="100" r="6" fill="#00d4ff" opacity="0.3">
                <animate attributeName="r" values="6;10;6" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.3;0.1;0.3" dur="2s" repeatCount="indefinite" />
              </circle>
              <circle cx="300" cy="100" r="4" fill="#00d4ff" />
              <text x="300" y="88" textAnchor="middle" fill="#00d4ff" fontSize="9" fontFamily="Orbitron">ISS</text>

              {/* 目标标记 */}
              <circle cx="550" cy="50" r="8" fill="#1a3355" stroke="#ff8c00" strokeWidth="1" />
              <text x="550" y="68" textAnchor="middle" fill="#ff8c00" fontSize="9" fontFamily="Rajdhani">α星C</text>

              {/* 航点标记 */}
              {navigation.waypoints
                .filter((w) => w.completed)
                .map((wp, i) => {
                  const x = 50 + (i / (navigation.waypoints.length - 1)) * 500;
                  const y = 200 - (i / (navigation.waypoints.length - 1)) * 150;
                  return (
                    <g key={wp.name}>
                      <circle cx={x} cy={y} r="2" fill="#00ff88" opacity="0.6" />
                    </g>
                  );
                })}
            </svg>
          </div>
        </Panel>

        <Panel title="航点列表" icon={<Compass size={14} />}>
          <div className="space-y-2">
            {navigation.waypoints.map((wp, i) => (
              <div
                key={wp.name}
                className={`flex items-center gap-2 text-xs px-2 py-2 rounded border transition-colors ${
                  wp.completed
                    ? "border-cyber-green/20 bg-cyber-green/5"
                    : i === navigation.waypoints.filter((w) => w.completed).length
                    ? "border-cyber-blue/30 bg-cyber-blue/5"
                    : "border-gray-800/50"
                }`}
              >
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center text-[8px] ${
                  wp.completed ? "border-cyber-green/50 text-cyber-green" : "border-gray-600 text-gray-600"
                }`}>
                  {wp.completed ? "✓" : i + 1}
                </div>
                <span className={`flex-1 ${wp.completed ? "text-gray-400" : "text-gray-300"}`}>{wp.name}</span>
                <span className="text-gray-600 font-rajdhani">{formatNumber(wp.distance, 2)} ly</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      {/* 轨道参数 + 天文数据 */}
      <div className="grid grid-cols-2 gap-4">
        <Panel title="轨道参数" icon={<Globe size={14} />}>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-400">航程进度</span>
                <span className="text-white font-rajdhani">
                  {formatNumber(navigation.currentDistance, 3)} / {formatNumber(navigation.totalDistance, 3)} 光年
                </span>
              </div>
              <ProgressBar value={navigation.currentDistance} max={navigation.totalDistance} height={10} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-xs">
                <span className="text-gray-500">目标轨道</span>
                <div className="text-gray-200 font-rajdhani mt-1">{navigation.targetOrbit}</div>
              </div>
              <div className="text-xs">
                <span className="text-gray-500">当前偏差</span>
                <div className={`font-rajdhani mt-1 ${navigation.deviation > 0.005 ? "text-cyber-amber" : "text-cyber-green"}`}>
                  {formatNumber(navigation.deviation * 1000, 2)}‰
                </div>
              </div>
            </div>
          </div>
        </Panel>

        <Panel title="天文数据" icon={<Sun size={14} />}>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded border border-cyber-blue/15 p-3">
              <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-2">
                <Sun size={12} /> 恒星位置
              </div>
              <div className="text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-500">赤经(RA)</span>
                  <span className="text-white font-rajdhani">{formatNumber(astronomical.stellarPosition.ra, 1)}°</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">赤纬(Dec)</span>
                  <span className="text-white font-rajdhani">{formatNumber(astronomical.stellarPosition.dec, 1)}°</span>
                </div>
              </div>
            </div>
            <div className="rounded border border-cyber-blue/15 p-3">
              <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-2">
                <Globe size={12} /> 最近行星
              </div>
              <div className="text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-500">名称</span>
                  <span className="text-white font-rajdhani">{astronomical.nearestPlanet.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">距离</span>
                  <span className="text-white font-rajdhani">{formatNumber(astronomical.nearestPlanet.distance, 3)} ly</span>
                </div>
              </div>
            </div>
            <div className="rounded border border-cyber-blue/15 p-3">
              <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-2">
                <Waves size={12} /> 辐射带
              </div>
              <div className="text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-500">强度</span>
                  <span className="text-white font-rajdhani">{formatNumber(astronomical.radiationBelt.intensity, 2)} Sv/h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">距离</span>
                  <span className="text-white font-rajdhani">{formatNumber(astronomical.radiationBelt.distance, 2)} AU</span>
                </div>
              </div>
            </div>
            <div className="rounded border border-cyber-blue/15 p-3">
              <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-2">
                <Magnet size={12} /> 引力场
              </div>
              <div className="text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-500">量级</span>
                  <span className="text-white font-rajdhani">{formatNumber(astronomical.gravityField.magnitude, 2)} G</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">方向</span>
                  <span className="text-white font-rajdhani">{formatNumber(astronomical.gravityField.direction, 1)}°</span>
                </div>
              </div>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}
