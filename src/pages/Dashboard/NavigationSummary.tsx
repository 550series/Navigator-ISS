import { memo } from "react";
import { useNavigationStore } from "@/stores/navigationStore";
import Panel from "@/components/ui/Panel";
import ProgressBar from "@/components/ui/ProgressBar";
import { formatNumber } from "@/utils/formatters";
import { Navigation } from "lucide-react";
import { Link } from "react-router-dom";

const NavigationSummary = memo(function NavigationSummary() {
  const navigation = useNavigationStore((s) => s.navigation);

  return (
    <Panel title="航线概览" icon={<Navigation size={14} />}>
      <div className="space-y-3">
        <div className="flex justify-between text-xs">
          <span className="text-gray-400">航程进度</span>
          <span className="text-white font-rajdhani">
            {formatNumber(navigation.currentDistance, 2)} / {formatNumber(navigation.totalDistance, 2)} 光年
          </span>
        </div>
        <ProgressBar value={navigation.currentDistance} max={navigation.totalDistance} height={8} />
        <div className="flex justify-between text-xs">
          <span className="text-gray-400">当前速度</span>
          <span className="text-cyber-blue font-rajdhani">{formatNumber(navigation.speed * 1000, 2)}‰ c</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-gray-400">轨道偏差</span>
          <span className={navigation.deviation > 0.005 ? "text-cyber-amber" : "text-cyber-green"}>
            {formatNumber(navigation.deviation * 1000, 2)}‰
          </span>
        </div>
        <Link to="/navigation" className="block text-center text-xs text-cyber-blue hover:text-cyber-blue/80 mt-2">
          查看详情 →
        </Link>
      </div>
    </Panel>
  );
});

export default NavigationSummary;
