import { memo } from "react";
import { useNavigationStore } from "@/stores/navigationStore";
import Panel from "@/components/ui/Panel";
import { Sun, Globe, Waves, Magnet } from "lucide-react";
import { formatNumber } from "@/utils/formatters";

const AstronomicalData = memo(function AstronomicalData() {
  const { astronomical } = useNavigationStore();

  return (
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
            <div className="flex justify-between">
              <span className="text-gray-500">角度</span>
              <span className="text-white font-rajdhani">{formatNumber(astronomical.nearestPlanet.angle, 1)}°</span>
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
  );
});

export default AstronomicalData;
