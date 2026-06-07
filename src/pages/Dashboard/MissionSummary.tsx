import { memo } from "react";
import { useMissionStore } from "@/stores/missionStore";
import Panel from "@/components/ui/Panel";
import ProgressBar from "@/components/ui/ProgressBar";
import { formatPercent } from "@/utils/formatters";
import { ClipboardList } from "lucide-react";
import { Link } from "react-router-dom";

const MissionSummary = memo(function MissionSummary() {
  const missions = useMissionStore((s) => s.missions);

  const activeMissions = missions.filter((m) => m.status === "in_progress").length;

  return (
    <Panel title="任务概览" icon={<ClipboardList size={14} />}>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">执行中任务</span>
          <span className="text-cyber-blue font-orbitron text-sm">{activeMissions}</span>
        </div>
        {missions
          .filter((m) => m.status === "in_progress")
          .slice(0, 3)
          .map((mission) => (
            <div key={mission.id} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-300 truncate mr-2">{mission.title}</span>
                <span className="text-gray-500 font-rajdhani">{formatPercent(mission.progress)}</span>
              </div>
              <ProgressBar value={mission.progress} max={100} height={3} />
            </div>
          ))}
        <Link to="/missions" className="block text-center text-xs text-cyber-blue hover:text-cyber-blue/80 mt-2">
          查看全部 →
        </Link>
      </div>
    </Panel>
  );
});

export default MissionSummary;
