import { memo } from "react";
import { useExperimentStore } from "@/stores/experimentStore";
import { useSpaceEnvironmentStore } from "@/stores/spaceEnvironmentStore";
import StatusCard from "@/components/ui/StatusCard";
import { FlaskConical, Play, CheckCircle, AlertTriangle, Radiation, Compass } from "lucide-react";

const ResearchStats = memo(function ResearchStats() {
  const getStats = useExperimentStore((s) => s.getStats);
  const { weather, attitude, getThreatLevel } = useSpaceEnvironmentStore();

  const stats = getStats();
  const threatLevel = getThreatLevel();

  const threatLabels: Record<string, string> = {
    low: "低",
    moderate: "中等",
    high: "高",
    extreme: "极端",
    critical: "危急",
  };

  return (
    <div className="grid grid-cols-6 gap-4">
      <StatusCard title="实验总数" value={stats.total} icon={<FlaskConical size={16} />} />
      <StatusCard title="进行中" value={stats.active} icon={<Play size={16} />} status={stats.active > 0 ? "normal" : "warning"} />
      <StatusCard title="已完成" value={stats.completed} icon={<CheckCircle size={16} />} />
      <StatusCard title="威胁等级" value={threatLabels[threatLevel]} icon={<AlertTriangle size={16} />} status={threatLevel === "low" ? "normal" : threatLevel === "moderate" ? "warning" : "critical"} />
      <StatusCard title="辐射水平" value={weather.radiationLevel.toFixed(2)} unit="mSv/h" icon={<Radiation size={16} />} />
      <StatusCard title="姿态稳定" value={attitude.stability.toFixed(1)} unit="%" icon={<Compass size={16} />} />
    </div>
  );
});

export default ResearchStats;
