import { memo } from "react";
import { useAlertStore } from "@/stores/alertStore";
import { useMaintenanceStore } from "@/stores/maintenanceStore";
import { useEmergencyStore } from "@/stores/emergencyStore";
import StatusCard from "@/components/ui/StatusCard";
import { Bell, AlertCircle, Wrench, Clock, ShieldAlert, Siren } from "lucide-react";

const OperationsStats = memo(function OperationsStats() {
  const getAlertStats = useAlertStore((s) => s.getStats);
  const getMaintenanceStats = useMaintenanceStore((s) => s.getStats);
  const getEmergencyStats = useEmergencyStore((s) => s.getStats);

  const alertStats = getAlertStats();
  const maintenanceStats = getMaintenanceStats();
  const emergencyStats = getEmergencyStats();

  return (
    <div className="grid grid-cols-6 gap-4">
      <StatusCard title="未确认告警" value={alertStats.unacknowledged} icon={<Bell size={16} />} status={alertStats.unacknowledged > 0 ? "warning" : "normal"} />
      <StatusCard title="严重告警" value={alertStats.critical} icon={<AlertCircle size={16} />} status={alertStats.critical > 0 ? "critical" : "normal"} />
      <StatusCard title="维修工单" value={maintenanceStats.totalRecords} icon={<Wrench size={16} />} />
      <StatusCard title="进行中" value={maintenanceStats.inProgress} icon={<Clock size={16} />} status={maintenanceStats.inProgress > 0 ? "warning" : "normal"} />
      <StatusCard title="应急预案" value={emergencyStats.totalPlans} icon={<ShieldAlert size={16} />} />
      <StatusCard title="应急状态" value={emergencyStats.activePlan ? "激活" : "正常"} icon={<Siren size={16} />} status={emergencyStats.activePlan ? "critical" : "normal"} />
    </div>
  );
});

export default OperationsStats;
