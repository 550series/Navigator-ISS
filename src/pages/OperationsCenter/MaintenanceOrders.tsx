import { memo } from "react";
import { useMaintenanceStore } from "@/stores/maintenanceStore";
import Panel from "@/components/ui/Panel";
import ProgressBar from "@/components/ui/ProgressBar";
import { Wrench } from "lucide-react";

const statusColors: Record<string, string> = {
  scheduled: "border-cyber-blue/30 bg-cyber-blue/5 text-cyber-blue",
  in_progress: "border-cyber-amber/30 bg-cyber-amber/5 text-cyber-amber",
  completed: "border-cyber-green/30 bg-cyber-green/5 text-cyber-green",
  overdue: "border-cyber-red/30 bg-cyber-red/5 text-cyber-red",
};

const statusLabels: Record<string, string> = {
  scheduled: "计划中",
  in_progress: "进行中",
  completed: "已完成",
  overdue: "已逾期",
};

const MaintenanceOrders = memo(function MaintenanceOrders() {
  const { records, spareParts } = useMaintenanceStore();

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="col-span-2">
        <Panel title="维修工单" icon={<Wrench size={14} />}>
          <div className="space-y-2">
            {records.map((record) => (
              <div key={record.id} className="p-3 rounded border border-gray-800 hover:border-cyber-blue/30 transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-rajdhani font-bold text-white">{record.equipmentName}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${statusColors[record.status]}`}>
                        {statusLabels[record.status]}
                      </span>
                    </div>
                    <div className="text-xs text-gray-300">{record.description}</div>
                    <div className="text-[10px] text-gray-500 mt-1">
                      {record.scheduledDate} · {record.assignee}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div>
        <Panel title="备件库存" icon={<Wrench size={14} />}>
          <div className="space-y-2">
            {spareParts.map((part) => (
              <div key={part.id} className="p-2 rounded border border-gray-800">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-200">{part.name}</span>
                  <span className={`text-[10px] ${part.quantity <= part.minStock ? "text-cyber-red" : "text-cyber-green"}`}>
                    {part.quantity}/{part.minStock}
                  </span>
                </div>
                <ProgressBar value={part.quantity} max={part.minStock * 2} showPercent={false} height={2} />
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
});

export default MaintenanceOrders;
