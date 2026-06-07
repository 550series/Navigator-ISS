import { memo } from "react";
import { useNavigationStore } from "@/stores/navigationStore";
import Panel from "@/components/ui/Panel";
import ProgressBar from "@/components/ui/ProgressBar";
import { Fuel, Rocket, ArrowRight } from "lucide-react";
import { formatNumber } from "@/utils/formatters";

const FuelCalculation = memo(function FuelCalculation() {
  const { fuelCalculation } = useNavigationStore();

  return (
    <Panel title="燃料计算" icon={<Fuel size={14} />}>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-400">当前燃料</span>
            <span className="text-white font-rajdhani">{formatNumber(fuelCalculation.currentFuel, 1)}%</span>
          </div>
          <ProgressBar value={fuelCalculation.currentFuel} max={100} height={10} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-space-900/50 p-3 rounded border border-gray-800">
            <div className="text-[10px] text-gray-500 mb-1">消耗率</div>
            <div className="text-lg font-orbitron text-white">{formatNumber(fuelCalculation.consumptionRate * 1000, 2)}</div>
            <div className="text-[10px] text-gray-500">‰/tick</div>
          </div>
          <div className="bg-space-900/50 p-3 rounded border border-gray-800">
            <div className="text-[10px] text-gray-500 mb-1">效率</div>
            <div className="text-lg font-orbitron text-cyber-green">{formatNumber(fuelCalculation.efficiency * 100, 1)}%</div>
          </div>
          <div className="bg-space-900/50 p-3 rounded border border-gray-800">
            <div className="text-[10px] text-gray-500 mb-1">预计消耗</div>
            <div className="text-lg font-orbitron text-cyber-amber">{formatNumber(fuelCalculation.projectedConsumption, 1)}%</div>
          </div>
          <div className="bg-space-900/50 p-3 rounded border border-gray-800">
            <div className="text-[10px] text-gray-500 mb-1">储备燃料</div>
            <div className={`text-lg font-orbitron ${fuelCalculation.reserveFuel < 10 ? "text-cyber-red" : "text-cyber-green"}`}>
              {formatNumber(fuelCalculation.reserveFuel, 1)}%
            </div>
          </div>
        </div>

        <div>
          <div className="text-[10px] text-gray-500 mb-2">引力辅助点</div>
          <div className="space-y-2">
            {fuelCalculation.gravityAssists.map((ga) => (
              <div key={ga.id} className="flex items-center gap-3 p-2 rounded border border-gray-800 bg-space-900/30">
                <div className="w-8 h-8 rounded-full bg-cyber-amber/10 flex items-center justify-center">
                  <Rocket size={14} className="text-cyber-amber" />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-gray-200 font-rajdhani">{ga.planetName}</div>
                  <div className="text-[10px] text-gray-500">{ga.approachDate}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-cyber-green font-rajdhani">+{formatNumber(ga.fuelSaved, 1)}%</div>
                  <div className="text-[10px] text-gray-500">节省燃料</div>
                </div>
                <ArrowRight size={12} className="text-gray-600" />
                <div className="text-right">
                  <div className="text-xs text-cyber-blue font-rajdhani">{formatNumber(ga.deltaV, 1)}</div>
                  <div className="text-[10px] text-gray-500">ΔV km/s</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Panel>
  );
});

export default FuelCalculation;
