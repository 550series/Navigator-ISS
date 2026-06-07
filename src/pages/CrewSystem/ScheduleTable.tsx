import { memo } from "react";
import { useCrewManagementStore } from "@/stores/crewManagementStore";
import Panel from "@/components/ui/Panel";
import { Clock } from "lucide-react";

const ScheduleTable = memo(function ScheduleTable() {
  const crew = useCrewManagementStore((s) => s.crew);

  return (
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
  );
});

export default ScheduleTable;
