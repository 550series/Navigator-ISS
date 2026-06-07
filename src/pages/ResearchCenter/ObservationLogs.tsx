import { memo } from "react";
import { useSpaceEnvironmentStore } from "@/stores/spaceEnvironmentStore";
import Panel from "@/components/ui/Panel";
import { Telescope } from "lucide-react";

const ObservationLogs = memo(function ObservationLogs() {
  const observationLogs = useSpaceEnvironmentStore((s) => s.observationLogs);

  return (
    <Panel title="观测日志" icon={<Telescope size={14} />}>
      <div className="space-y-3">
        {observationLogs.map((log) => (
          <div key={log.id} className="p-3 rounded border border-gray-800">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="text-xs font-rajdhani font-bold text-white">{log.target}</div>
                <div className="text-[10px] text-gray-500">{log.observer} · {log.timestamp}</div>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-space-700 text-gray-400">
                {log.type === "visual" ? "目视" : log.type === "instrument" ? "仪器" : "摄影"}
              </span>
            </div>
            <div className="text-xs text-gray-300 mb-2">{log.description}</div>
            <div className="text-xs text-cyber-blue bg-cyber-blue/5 p-2 rounded border border-cyber-blue/10">
              {log.findings}
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
});

export default ObservationLogs;
