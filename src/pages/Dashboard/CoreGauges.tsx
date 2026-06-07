import { memo } from "react";
import { useStationStore } from "@/stores/stationStore";
import Panel from "@/components/ui/Panel";
import GaugeChart from "@/components/ui/GaugeChart";

const CoreGauges = memo(function CoreGauges() {
  const { energy, lifeSupport, propulsion } = useStationStore();

  return (
    <Panel title="核心指标">
      <div className="grid grid-cols-2 gap-4 justify-items-center">
        <GaugeChart value={energy.reactorOutput} max={energy.reactorOutputMax} label="反应堆输出" unit="MW" />
        <GaugeChart value={lifeSupport.oxygenLevel} max={25} label="氧气浓度" unit="%" />
        <GaugeChart value={propulsion.fuelReserve} max={100} label="燃料储备" unit="%" color="#ff8c00" />
        <GaugeChart value={propulsion.vectorControl} max={100} label="矢量控制" unit="%" />
      </div>
    </Panel>
  );
});

export default CoreGauges;
