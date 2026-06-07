import { memo } from "react";
import { useCrewManagementStore } from "@/stores/crewManagementStore";
import StatusCard from "@/components/ui/StatusCard";
import { Users, Heart, Brain, Star, TrendingUp } from "lucide-react";

const CrewStats = memo(function CrewStats() {
  const getCrewStats = useCrewManagementStore((s) => s.getCrewStats);
  const stats = getCrewStats();

  return (
    <div className="grid grid-cols-6 gap-4">
      <StatusCard title="船员总数" value={stats.total} icon={<Users size={16} />} />
      <StatusCard title="健康" value={stats.healthy} icon={<Heart size={16} />} status="normal" />
      <StatusCard title="受伤" value={stats.injured} icon={<Heart size={16} />} status={stats.injured > 0 ? "critical" : "normal"} />
      <StatusCard title="平均士气" value={stats.avgMorale} unit="%" icon={<Star size={16} />} />
      <StatusCard title="平均压力" value={stats.avgStress} unit="%" icon={<Brain size={16} />} status={stats.avgStress > 50 ? "warning" : "normal"} />
      <StatusCard title="平均效率" value={stats.avgEfficiency} unit="%" icon={<TrendingUp size={16} />} />
    </div>
  );
});

export default CrewStats;
