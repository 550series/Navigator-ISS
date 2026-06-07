import { useCrewManagementStore } from "@/stores/crewManagementStore";
import Panel from "@/components/ui/Panel";
import StatusCard from "@/components/ui/StatusCard";
import ProgressBar from "@/components/ui/ProgressBar";
import { Users, Heart, Brain, Star, Clock, Award, TrendingUp } from "lucide-react";
import { useState } from "react";

const mentalHealthColors = {
  stable: "text-cyber-green",
  stressed: "text-cyber-amber",
  anxious: "text-cyber-red",
  depressed: "text-cyber-red",
};

const mentalHealthLabels = {
  stable: "稳定",
  stressed: "压力",
  anxious: "焦虑",
  depressed: "抑郁",
};

const categoryLabels = {
  engineering: "工程",
  science: "科学",
  medical: "医疗",
  piloting: "航行",
  command: "指挥",
};

export default function CrewManagement() {
  const { crew, getCrewStats } = useCrewManagementStore();
  const [selectedCrew, setSelectedCrew] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "skills" | "psychology" | "performance" | "schedule">("overview");

  const stats = getCrewStats();
  const selected = crew.find((c) => c.id === selectedCrew);

  return (
    <div className="space-y-4">
      {/* 顶部统计 */}
      <div className="grid grid-cols-6 gap-4">
        <StatusCard title="船员总数" value={stats.total} icon={<Users size={16} />} />
        <StatusCard title="健康" value={stats.healthy} icon={<Heart size={16} />} status="normal" />
        <StatusCard title="受伤" value={stats.injured} icon={<Heart size={16} />} status={stats.injured > 0 ? "critical" : "normal"} />
        <StatusCard title="平均士气" value={stats.avgMorale} unit="%" icon={<Star size={16} />} />
        <StatusCard title="平均压力" value={stats.avgStress} unit="%" icon={<Brain size={16} />} status={stats.avgStress > 50 ? "warning" : "normal"} />
        <StatusCard title="平均效率" value={stats.avgEfficiency} unit="%" icon={<TrendingUp size={16} />} />
      </div>

      {/* 标签页切换 */}
      <div className="flex gap-2">
        {(["overview", "skills", "psychology", "performance", "schedule"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-xs rounded border transition-colors font-rajdhani font-bold ${
              activeTab === tab
                ? "border-cyber-blue/50 bg-cyber-blue/10 text-cyber-blue"
                : "border-gray-700 text-gray-400 hover:border-cyber-blue/30"
            }`}
          >
            {tab === "overview" ? "总览" :
             tab === "skills" ? "技能管理" :
             tab === "psychology" ? "心理健康" :
             tab === "performance" ? "绩效追踪" : "排班管理"}
          </button>
        ))}
      </div>

      {/* 总览 */}
      {activeTab === "overview" && (
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
      )}

      {/* 技能管理 */}
      {activeTab === "skills" && (
        <Panel title="技能矩阵" icon={<Award size={14} />}>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left py-2 px-3 text-gray-500 font-rajdhani">船员</th>
                  {Object.entries(categoryLabels).map(([key, label]) => (
                    <th key={key} className="text-center py-2 px-3 text-gray-500 font-rajdhani">{label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {crew.map((member) => (
                  <tr key={member.id} className="border-b border-gray-800/50 hover:bg-space-800/30">
                    <td className="py-2 px-3 text-gray-200 font-rajdhani">{member.name}</td>
                    {Object.keys(categoryLabels).map((category) => {
                      const categorySkills = member.skills.filter((s) => s.category === category);
                      const avgLevel = categorySkills.length > 0
                        ? Math.round(categorySkills.reduce((sum, s) => sum + s.level, 0) / categorySkills.length)
                        : 0;
                      return (
                        <td key={category} className="py-2 px-3 text-center">
                          {avgLevel > 0 ? (
                            <span className={`font-rajdhani font-bold ${
                              avgLevel >= 90 ? "text-cyber-green" :
                              avgLevel >= 70 ? "text-cyber-blue" :
                              avgLevel >= 50 ? "text-cyber-amber" : "text-gray-400"
                            }`}>
                              {avgLevel}
                            </span>
                          ) : (
                            <span className="text-gray-600">-</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      )}

      {/* 心理健康 */}
      {activeTab === "psychology" && (
        <div className="grid grid-cols-2 gap-4">
          {crew.map((member) => (
            <Panel key={member.id} title={member.name} icon={<Brain size={14} />}>
              <div className="space-y-2">
                <ProgressBar value={member.psychologicalProfile.morale} max={100} label="士气" />
                <ProgressBar value={member.psychologicalProfile.stress} max={100} label="压力" />
                <ProgressBar value={member.psychologicalProfile.socialConnections} max={100} label="社交" />
                <ProgressBar value={member.psychologicalProfile.sleepQuality} max={100} label="睡眠" />
                <div className="mt-2 p-2 bg-space-900/50 rounded border border-gray-800">
                  <div className="text-[10px] text-gray-500">心理状态</div>
                  <div className={`text-sm font-rajdhani font-bold ${mentalHealthColors[member.psychologicalProfile.mentalHealth]}`}>
                    {mentalHealthLabels[member.psychologicalProfile.mentalHealth]}
                  </div>
                </div>
                {member.psychologicalProfile.notes.length > 0 && (
                  <div className="mt-2">
                    <div className="text-[10px] text-gray-500 mb-1">备注</div>
                    {member.psychologicalProfile.notes.map((note, i) => (
                      <div key={i} className="text-[10px] text-gray-400 bg-space-900/50 p-1.5 rounded mb-1">{note}</div>
                    ))}
                  </div>
                )}
              </div>
            </Panel>
          ))}
        </div>
      )}

      {/* 绩效追踪 */}
      {activeTab === "performance" && (
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
      )}

      {/* 排班管理 */}
      {activeTab === "schedule" && (
        <Panel title="排班表" icon={<Clock size={14} />}>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left py-2 px-3 text-gray-500 font-rajdhani">船员</th>
                  <th className="text-center py-2 px-3 text-gray-500 font-rajdhani">班次</th>
                  <th className="text-left py-2 px-3 text-gray-500 font-rajdhani">当前位置</th>
                  <th className="text-left py-2 px-3 text-gray-500 font-rajdhani">健康状态</th>
                </tr>
              </thead>
              <tbody>
                {crew.map((member) => (
                  <tr key={member.id} className="border-b border-gray-800/50 hover:bg-space-800/30">
                    <td className="py-2 px-3">
                      <div className="text-gray-200 font-rajdhani">{member.name}</div>
                      <div className="text-[10px] text-gray-500">{member.role}</div>
                    </td>
                    <td className="py-2 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-rajdhani font-bold ${
                        member.shift === "A" ? "bg-cyber-blue/10 text-cyber-blue" :
                        member.shift === "B" ? "bg-cyber-green/10 text-cyber-green" :
                        "bg-cyber-amber/10 text-cyber-amber"
                      }`}>
                        {member.shift}班
                      </span>
                    </td>
                    <td className="py-2 px-3 text-gray-400">{member.location}</td>
                    <td className="py-2 px-3">
                      <span className={`text-[10px] ${
                        member.healthStatus === "healthy" ? "text-cyber-green" :
                        member.healthStatus === "minor" ? "text-cyber-amber" : "text-cyber-red"
                      }`}>
                        {member.healthStatus === "healthy" ? "健康" :
                         member.healthStatus === "minor" ? "轻伤" : "重伤"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      )}
    </div>
  );
}
