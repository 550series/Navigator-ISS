import { memo } from "react";
import { useCrewManagementStore } from "@/stores/crewManagementStore";
import Panel from "@/components/ui/Panel";
import { TrendingUp } from "lucide-react";

const PerformanceRanking = memo(function PerformanceRanking() {
  const crew = useCrewManagementStore((s) => s.crew);

  return (
    <Panel title="绩效排行榜" icon={<TrendingUp size={14} />}>
      <div className="space-y-2">
        {[...crew]
          .sort((a, b) => b.performance.overallScore - a.performance.overallScore)
          .map((member, index) => (
            <div key={member.id} className="p-3 rounded border border-gray-800 flex items-center gap-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-orbitron font-bold ${
                index === 0 ? "bg-yellow-500/20 text-yellow-500" :
                index === 1 ? "bg-gray-400/20 text-gray-400" :
                index === 2 ? "bg-orange-500/20 text-orange-500" :
                "bg-space-700 text-gray-500"
              }`}>
                {index + 1}
              </div>
              <div className="flex-1">
                <div className="text-xs font-rajdhani font-bold text-white">{member.name}</div>
                <div className="text-[10px] text-gray-500">{member.role}</div>
              </div>
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-[10px] text-gray-500">效率</div>
                  <div className="text-xs font-rajdhani text-gray-300">{member.performance.efficiency}%</div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-500">可靠</div>
                  <div className="text-xs font-rajdhani text-gray-300">{member.performance.reliability}%</div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-500">创新</div>
                  <div className="text-xs font-rajdhani text-gray-300">{member.performance.innovation}%</div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-500">综合</div>
                  <div className="text-sm font-orbitron font-bold text-cyber-blue">{member.performance.overallScore}</div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </Panel>
  );
});

export default PerformanceRanking;
