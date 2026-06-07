import { memo } from "react";
import { useStationStore } from "@/stores/stationStore";
import { useCommStore } from "@/stores/commStore";
import StatusCard from "@/components/ui/StatusCard";
import ProgressBar from "@/components/ui/ProgressBar";
import { formatNumber } from "@/utils/formatters";
import { Zap, Heart, Rocket, Radio } from "lucide-react";

const SystemStatusCards = memo(function SystemStatusCards() {
  const { energy, lifeSupport, propulsion } = useStationStore();
  const commLinks = useCommStore((s) => s.commLinks);

  const connectedLinks = commLinks.filter((l) => l.status === "connected").length;
  const totalLinks = commLinks.length;

  return (
    <div className="grid grid-cols-4 gap-4">
      <StatusCard
        title="能源系统"
        value={formatNumber(energy.reactorOutput, 0)}
        unit="MW"
        icon={<Zap size={16} />}
        status={energy.reactorOutput / energy.reactorOutputMax < 0.5 ? "warning" : "normal"}
      >
        <div className="mt-2">
          <ProgressBar value={energy.storageLevel} max={100} label="储能" height={4} />
        </div>
      </StatusCard>

      <StatusCard
        title="生命维持"
        value={formatNumber(lifeSupport.oxygenLevel, 1)}
        unit="%O₂"
        icon={<Heart size={16} />}
        status={lifeSupport.filterStatus}
      >
        <div className="mt-2">
          <ProgressBar value={lifeSupport.airQuality} max={100} label="空气质量" height={4} />
        </div>
      </StatusCard>

      <StatusCard
        title="推进系统"
        value={formatNumber(propulsion.mainThrust / 1000, 1)}
        unit="kN"
        icon={<Rocket size={16} />}
        status={propulsion.engineStatus === "online" ? "normal" : "warning"}
      >
        <div className="mt-2">
          <ProgressBar value={propulsion.fuelReserve} max={100} label="燃料储备" height={4} />
        </div>
      </StatusCard>

      <StatusCard
        title="通信系统"
        value={`${connectedLinks}/${totalLinks}`}
        unit="链路"
        icon={<Radio size={16} />}
        status={connectedLinks < totalLinks * 0.5 ? "critical" : "normal"}
      >
        <div className="mt-2">
          <ProgressBar value={connectedLinks} max={totalLinks} label="连接率" height={4} />
        </div>
      </StatusCard>
    </div>
  );
});

export default SystemStatusCards;
