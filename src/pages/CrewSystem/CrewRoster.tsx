import { memo, useState } from "react";
import { useCrewManagementStore } from "@/stores/crewManagementStore";
import Panel from "@/components/ui/Panel";
import ProgressBar from "@/components/ui/ProgressBar";
import { Users } from "lucide-react";

const mentalHealthColors: Record<string, string> = {
  stable: "text-cyber-green",
  stressed: "text-cyber-amber",
  anxious: "text-cyber-red",
  depressed: "text-cyber-red",
};

const mentalHealthLabels: Record<string, string> = {
  stable: "稳定",
  stressed: "压力",
  anxious: "焦虑",
  depressed: "抑郁",
};

const CrewRoster = memo(function CrewRoster() {
  const crew = useCrewManagementStore((s) => s.crew);
  const [selectedCrew, setSelectedCrew] = useState<string | null>(null);

  const selected = crew.find((c) => c.id === selectedCrew);

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="col-span-2">
        <Panel title="船员列表" icon={<Users size={14} />}>
          <div className="space-y-2">
            {crew.map((member) => (
              <div
                key={member.id}
                onClick={() => setSelectedCrew(member.id)}
                className={`p-3 rounded border cursor-pointer transition-all duration-200 ${
                  selectedCrew === member.id
                    ? "border-cyber-blue/50 bg-cyber-blue/5"
                    : "border-gray-800 hover:border-cyber-blue/30"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-rajdhani font-bold text-white">{member.name}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-space-700 text-gray-400">{member.role}</span>
                      <span className={`text-[10px] ${mentalHealthColors[member.psychologicalProfile.mentalHealth]}`}>
                        {mentalHealthLabels[member.psychologicalProfile.mentalHealth]}
                      </span>
                    </div>
                    <div className="text-[10px] text-gray-500">
                      {member.department} · {member.shift}班 · {member.location}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-orbitron font-bold text-white">{member.performance.overallScore}</div>
                    <div className="text-[10px] text-gray-500">综合评分</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div>
        {selected ? (
          <Panel title="船员详情" icon={<Users size={14} />}>
            <div className="space-y-3">
              <div className="text-center mb-3">
                <div className="text-lg font-orbitron font-bold text-white">{selected.name}</div>
                <div className="text-xs text-gray-400">{selected.role} · {selected.department}</div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-space-900/50 p-2 rounded border border-gray-800 text-center">
                  <div className="text-[10px] text-gray-500">士气</div>
                  <div className="text-sm font-rajdhani font-bold text-cyber-green">{selected.psychologicalProfile.morale}%</div>
                </div>
                <div className="bg-space-900/50 p-2 rounded border border-gray-800 text-center">
                  <div className="text-[10px] text-gray-500">压力</div>
                  <div className={`text-sm font-rajdhani font-bold ${selected.psychologicalProfile.stress > 50 ? "text-cyber-amber" : "text-cyber-green"}`}>
                    {selected.psychologicalProfile.stress}%
                  </div>
                </div>
              </div>

              <div>
                <div className="text-[10px] text-gray-500 mb-1">主要技能</div>
                {selected.skills.slice(0, 2).map((skill) => (
                  <div key={skill.id} className="mb-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-400">{skill.name}</span>
                      <span className="text-cyber-blue font-rajdhani">{skill.level}</span>
                    </div>
                    <ProgressBar value={skill.level} max={100} showPercent={false} height={3} />
                  </div>
                ))}
              </div>

              <div>
                <div className="text-[10px] text-gray-500 mb-1">绩效指标</div>
                <div className="grid grid-cols-2 gap-1 text-[10px]">
                  <div className="flex justify-between">
                    <span className="text-gray-500">效率</span>
                    <span className="text-gray-300">{selected.performance.efficiency}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">可靠性</span>
                    <span className="text-gray-300">{selected.performance.reliability}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">领导力</span>
                    <span className="text-gray-300">{selected.performance.leadership}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">团队协作</span>
                    <span className="text-gray-300">{selected.performance.teamwork}%</span>
                  </div>
                </div>
              </div>
            </div>
          </Panel>
        ) : (
          <Panel title="船员详情" icon={<Users size={14} />}>
            <div className="text-center text-gray-500 text-xs py-8">选择左侧船员查看详情</div>
          </Panel>
        )}
      </div>
    </div>
  );
});

export default CrewRoster;
