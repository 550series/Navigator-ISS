import { memo } from "react";
import { useResourceStore } from "@/stores/resourceStore";
import StatusCard from "@/components/ui/StatusCard";
import { Package, Users, Cpu, AlertTriangle, Recycle } from "lucide-react";
import { formatNumber } from "@/utils/formatters";

const ResourceStats = memo(function ResourceStats() {
  const { resources, personnel, equipment, getRecyclingEfficiency } = useResourceStore();

  const lowResources = resources.filter((r) => r.alertLevel !== "normal").length;
  const operationalEquipment = equipment.filter((e) => e.status === "operational").length;
  const recyclingEfficiency = getRecyclingEfficiency();

  return (
    <div className="grid grid-cols-5 gap-4">
      <StatusCard
        title="物资类别"
        value={new Set(resources.map((r) => r.category)).size}
        unit="类"
        icon={<Package size={16} />}
      />
      <StatusCard
        title="低库存物资"
        value={lowResources}
        unit="项"
        icon={<AlertTriangle size={16} />}
        status={lowResources > 0 ? "warning" : "normal"}
      />
      <StatusCard
        title="在站人员"
        value={personnel.length}
        unit="人"
        icon={<Users size={16} />}
      />
      <StatusCard
        title="设备运行率"
        value={formatNumber((operationalEquipment / equipment.length) * 100, 0)}
        unit="%"
        icon={<Cpu size={16} />}
      />
      <StatusCard
        title="回收效率"
        value={formatNumber(recyclingEfficiency, 1)}
        unit="%"
        icon={<Recycle size={16} />}
      />
    </div>
  );
});

export default ResourceStats;
