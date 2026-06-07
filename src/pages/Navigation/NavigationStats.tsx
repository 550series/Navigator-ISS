import { memo } from "react";
import { useNavigationStore } from "@/stores/navigationStore";
import StatusCard from "@/components/ui/StatusCard";
import { formatNumber } from "@/utils/formatters";
import { Navigation, Compass, Gauge, Fuel } from "lucide-react";

const NavigationStats = memo(function NavigationStats() {
  const { navigation, fuelCalculation } = useNavigationStore();

  const progressPercent = (navigation.currentDistance / navigation.totalDistance) * 100;

  return (
    <div className="grid grid-cols-5 gap-4">
      <StatusCard
        title="航行速度"
        value={formatNumber(navigation.speed * 1000, 2)}
        unit="‰ c"
        icon={<Navigation size={16} />}
      />
      <StatusCard
        title="航程进度"
        value={formatNumber(progressPercent, 2)}
        unit="%"
        icon={<Compass size={16} />}
      />
      <StatusCard
        title="轨道偏差"
        value={formatNumber(navigation.deviation * 1000, 2)}
        unit="‰"
        status={navigation.deviation > 0.005 ? "warning" : "normal"}
      />
      <StatusCard
        title="航向角"
        value={formatNumber(navigation.heading, 1)}
        unit="°"
        icon={<Gauge size={16} />}
      />
      <StatusCard
        title="燃料储备"
        value={formatNumber(fuelCalculation.currentFuel, 1)}
        unit="%"
        icon={<Fuel size={16} />}
        status={fuelCalculation.currentFuel < 20 ? "critical" : fuelCalculation.currentFuel < 40 ? "warning" : "normal"}
      />
    </div>
  );
});

export default NavigationStats;
