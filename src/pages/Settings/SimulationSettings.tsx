import { memo } from "react";
import { useSimulationStore } from "@/stores/simulationStore";
import Panel from "@/components/ui/Panel";
import { Zap, Monitor } from "lucide-react";
import type { SimulationSpeed } from "@/stores/simulationStore";

const speedOptions: { value: SimulationSpeed; label: string; desc: string }[] = [
  { value: 1, label: "1x", desc: "标准速度" },
  { value: 2, label: "2x", desc: "快速模式" },
  { value: 5, label: "5x", desc: "极速模式" },
];

const SimulationSettings = memo(function SimulationSettings() {
  const sim = useSimulationStore();

  return (
    <div className="grid grid-cols-2 gap-4">
      <Panel title="运行状态" icon={<Zap size={14} />}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-400 font-rajdhani">当前状态</div>
              <div className={`text-lg font-orbitron font-bold ${sim.running ? "text-cyber-green" : "text-cyber-amber"}`}>
                {sim.running ? "运行中" : "已暂停"}
              </div>
            </div>
            <button
              onClick={sim.toggle}
              className={`px-4 py-2 text-xs rounded-lg border transition-colors font-rajdhani font-bold ${
                sim.running
                  ? "border-cyber-amber/40 text-cyber-amber hover:bg-cyber-amber/10"
                  : "border-cyber-green/40 text-cyber-green hover:bg-cyber-green/10"
              }`}
            >
              {sim.running ? "暂停仿真" : "恢复仿真"}
            </button>
          </div>

          <div>
            <div className="text-xs text-gray-400 font-rajdhani mb-2">仿真速度</div>
            <div className="grid grid-cols-3 gap-2">
              {speedOptions.map(({ value, label, desc }) => (
                <button
                  key={value}
                  onClick={() => sim.setSpeed(value)}
                  className={`p-3 rounded-lg border transition-all duration-200 ${
                    sim.speed === value
                      ? "border-cyber-blue/50 bg-cyber-blue/10 shadow-glow-sm"
                      : "border-gray-700 hover:border-cyber-blue/30"
                  }`}
                >
                  <div className={`text-lg font-orbitron font-bold ${sim.speed === value ? "text-cyber-blue" : "text-gray-400"}`}>
                    {label}
                  </div>
                  <div className="text-[10px] text-gray-500 mt-1">{desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </Panel>

      <Panel title="仿真统计" icon={<Monitor size={14} />}>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-space-900/50 rounded-lg p-4 border border-cyber-blue/10 text-center">
            <div className="text-[10px] text-gray-500 mb-1">仿真天数</div>
            <div className="text-2xl font-orbitron font-bold text-white">D+{Math.floor(sim.elapsedDays)}</div>
          </div>
          <div className="bg-space-900/50 rounded-lg p-4 border border-cyber-blue/10 text-center">
            <div className="text-[10px] text-gray-500 mb-1">仿真 Tick</div>
            <div className="text-2xl font-orbitron font-bold text-white">T{sim.tickCount}</div>
          </div>
          <div className="bg-space-900/50 rounded-lg p-4 border border-cyber-blue/10 text-center">
            <div className="text-[10px] text-gray-500 mb-1">运行时间</div>
            <div className="text-lg font-rajdhani text-gray-300">
              {Math.floor(sim.elapsedDays * 24)} 小时
            </div>
          </div>
          <div className="bg-space-900/50 rounded-lg p-4 border border-cyber-blue/10 text-center">
            <div className="text-[10px] text-gray-500 mb-1">更新频率</div>
            <div className="text-lg font-rajdhani text-gray-300">
              {(3000 / sim.speed / 1000).toFixed(1)}s
            </div>
          </div>
        </div>
      </Panel>
    </div>
  );
});

export default SimulationSettings;
