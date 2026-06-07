import { memo } from "react";
import { useCrewManagementStore } from "@/stores/crewManagementStore";
import Panel from "@/components/ui/Panel";
import ProgressBar from "@/components/ui/ProgressBar";
import { Brain } from "lucide-react";

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

const PsychologyPanel = memo(function PsychologyPanel() {
  const crew = useCrewManagementStore((s) => s.crew);

  return (
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
  );
});

export default PsychologyPanel;
