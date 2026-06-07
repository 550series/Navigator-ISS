import { memo } from "react";
import { useNavigationStore } from "@/stores/navigationStore";
import Panel from "@/components/ui/Panel";
import { Globe } from "lucide-react";
import { formatNumber } from "@/utils/formatters";

const OrbitalMonitoring = memo(function OrbitalMonitoring() {
  const { orbitalParameters } = useNavigationStore();

  return (
    <Panel title="轨道监测" icon={<Globe size={14} />}>
      <div className="space-y-4">
        {/* 轨道可视化 */}
        <div className="relative h-40 flex items-center justify-center">
          <svg viewBox="0 0 200 120" className="w-full max-w-xs">
            {/* 中心天体 */}
            <circle cx="100" cy="60" r="8" fill="#1a3355" stroke="#00d4ff" strokeWidth="1" />
            <text x="100" y="63" textAnchor="middle" fill="#00d4ff" fontSize="6" fontFamily="Orbitron">Star</text>

            {/* 椭圆轨道 */}
            <ellipse
              cx="100"
              cy="60"
              rx={orbitalParameters.semiMajorAxis * 30}
              ry={orbitalParameters.semiMajorAxis * 30 * (1 - orbitalParameters.eccentricity)}
              fill="none"
              stroke="#00d4ff"
              strokeWidth="1"
              opacity="0.3"
              transform={`rotate(${orbitalParameters.inclination}, 100, 60)`}
            />

            {/* 航天器位置 */}
            <circle
              cx={100 + Math.cos((orbitalParameters.trueAnomaly * Math.PI) / 180) * orbitalParameters.semiMajorAxis * 30}
              cy={60 + Math.sin((orbitalParameters.trueAnomaly * Math.PI) / 180) * orbitalParameters.semiMajorAxis * 30 * (1 - orbitalParameters.eccentricity)}
              r="4"
              fill="#00d4ff"
            >
              <animate attributeName="r" values="4;6;4" dur="2s" repeatCount="indefinite" />
            </circle>
          </svg>
        </div>

        {/* 轨道参数 */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-space-900/50 p-2 rounded border border-gray-800">
            <div className="text-[10px] text-gray-500">半长轴</div>
            <div className="text-sm font-rajdhani text-white">{formatNumber(orbitalParameters.semiMajorAxis, 3)} AU</div>
          </div>
          <div className="bg-space-900/50 p-2 rounded border border-gray-800">
            <div className="text-[10px] text-gray-500">偏心率</div>
            <div className="text-sm font-rajdhani text-white">{formatNumber(orbitalParameters.eccentricity, 4)}</div>
          </div>
          <div className="bg-space-900/50 p-2 rounded border border-gray-800">
            <div className="text-[10px] text-gray-500">轨道倾角</div>
            <div className="text-sm font-rajdhani text-white">{formatNumber(orbitalParameters.inclination, 2)}°</div>
          </div>
          <div className="bg-space-900/50 p-2 rounded border border-gray-800">
            <div className="text-[10px] text-gray-500">真近点角</div>
            <div className="text-sm font-rajdhani text-white">{formatNumber(orbitalParameters.trueAnomaly, 1)}°</div>
          </div>
          <div className="bg-space-900/50 p-2 rounded border border-gray-800">
            <div className="text-[10px] text-gray-500">远日点</div>
            <div className="text-sm font-rajdhani text-white">{formatNumber(orbitalParameters.apoapsis, 3)} AU</div>
          </div>
          <div className="bg-space-900/50 p-2 rounded border border-gray-800">
            <div className="text-[10px] text-gray-500">近日点</div>
            <div className="text-sm font-rajdhani text-white">{formatNumber(orbitalParameters.periapsis, 3)} AU</div>
          </div>
          <div className="bg-space-900/50 p-2 rounded border border-gray-800 col-span-2">
            <div className="text-[10px] text-gray-500">轨道周期</div>
            <div className="text-sm font-rajdhani text-white">{formatNumber(orbitalParameters.period, 0)} 天</div>
          </div>
        </div>
      </div>
    </Panel>
  );
});

export default OrbitalMonitoring;
