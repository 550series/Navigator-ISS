import { useCommStore } from "@/stores/commStore";
import Panel from "@/components/ui/Panel";
import StatusCard from "@/components/ui/StatusCard";
import { formatNumber, getStatusColor, getStatusBgColor } from "@/utils/formatters";
import { Radio, Wifi, WifiOff, Globe, Satellite, Ship, MessageSquare } from "lucide-react";
import { useState } from "react";

/** 通信系统页面 */
export default function Communication() {
  const { commLinks, communications } = useCommStore();
  const [selectedComm, setSelectedComm] = useState<string | null>(null);

  const connectedLinks = commLinks.filter((l) => l.status === "connected").length;
  const degradedLinks = commLinks.filter((l) => l.status === "degraded").length;
  const offlineLinks = commLinks.filter((l) => l.status === "offline").length;

  const selectedCommunication = communications.find((c) => c.id === selectedComm);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "earth": return <Globe size={14} />;
      case "satellite": return <Satellite size={14} />;
      case "ship": return <Ship size={14} />;
      default: return <Radio size={14} />;
    }
  };

  return (
    <div className="space-y-4">
      {/* 顶部指标 */}
      <div className="grid grid-cols-4 gap-4">
        <StatusCard title="活跃链路" value={connectedLinks} unit={`/${commLinks.length}`} icon={<Wifi size={16} />} />
        <StatusCard title="降级链路" value={degradedLinks} unit="条" status={degradedLinks > 0 ? "warning" : "normal"} icon={<WifiOff size={16} />} />
        <StatusCard title="离线链路" value={offlineLinks} unit="条" status={offlineLinks > 0 ? "critical" : "normal"} />
        <StatusCard
          title="平均延迟"
          value={formatNumber(commLinks.filter((l) => l.status !== "offline").reduce((s, l) => s + l.latency, 0) / Math.max(1, commLinks.filter((l) => l.status !== "offline").length), 2)}
          unit="秒"
        />
      </div>

      {/* 通信链路状态 */}
      <Panel title="通信链路状态" icon={<Radio size={14} />}>
        <div className="grid grid-cols-3 gap-3">
          {commLinks.map((link) => (
            <div
              key={link.id}
              className={`rounded border p-3 ${getStatusBgColor(link.status)} transition-all duration-300`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getTypeIcon(link.type)}
                  <span className="text-xs text-gray-200 font-rajdhani font-medium">{link.name}</span>
                </div>
                <span className={`text-[10px] font-bold uppercase ${getStatusColor(link.status)}`}>
                  {link.status === "connected" ? "已连接" : link.status === "degraded" ? "降级" : "离线"}
                </span>
              </div>
              <div className="text-xs text-gray-500 mb-2">{link.target}</div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-gray-500">信号强度</span>
                  <div className="flex items-center gap-1 mt-0.5">
                    <div className="flex-1 h-1.5 bg-space-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          link.signalStrength > 70 ? "bg-cyber-green" : link.signalStrength > 50 ? "bg-cyber-amber" : "bg-cyber-red"
                        }`}
                        style={{ width: `${link.signalStrength}%` }}
                      />
                    </div>
                    <span className="text-gray-400 font-rajdhani w-8 text-right">{link.signalStrength}%</span>
                  </div>
                </div>
                <div>
                  <span className="text-gray-500">延迟</span>
                  <div className="text-gray-400 font-rajdhani mt-0.5">{formatNumber(link.latency, 2)}s</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      {/* 通信记录 */}
      <Panel title="通信记录" icon={<MessageSquare size={14} />}>
        <div className="grid grid-cols-3 gap-4">
          {/* 记录列表 */}
          <div className="col-span-2 space-y-2 max-h-64 overflow-y-auto">
            {communications.map((comm) => (
              <div
                key={comm.id}
                onClick={() => setSelectedComm(comm.id)}
                className={`flex items-start gap-3 text-xs px-3 py-2 rounded border cursor-pointer transition-colors ${
                  selectedComm === comm.id
                    ? "border-cyber-blue/40 bg-cyber-blue/5"
                    : "border-gray-800/50 hover:border-cyber-blue/20"
                }`}
              >
                <div className={`mt-0.5 ${
                  comm.type === "emergency" ? "text-cyber-red" : comm.type === "official" ? "text-cyber-blue" : "text-gray-500"
                }`}>
                  {comm.type === "emergency" ? "!!" : comm.type === "official" ? "◆" : "○"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-gray-200 font-rajdhani font-medium">
                      {comm.source} → {comm.target}
                    </span>
                    <span className="text-gray-600 text-[10px]">{comm.timestamp}</span>
                  </div>
                  <p className="text-gray-400 truncate">{comm.content}</p>
                </div>
                <span className={`px-1.5 py-0.5 rounded text-[10px] border ${getStatusBgColor(comm.status)}`}>
                  {comm.status === "connected" ? "正常" : comm.status === "degraded" ? "降级" : "离线"}
                </span>
              </div>
            ))}
          </div>

          {/* 详情面板 */}
          <div className="border-l border-cyber-blue/10 pl-4">
            {selectedCommunication ? (
              <div className="space-y-3">
                <div className="text-xs">
                  <span className="text-gray-500">来源</span>
                  <div className="text-gray-200 font-rajdhani mt-0.5">{selectedCommunication.source}</div>
                </div>
                <div className="text-xs">
                  <span className="text-gray-500">目标</span>
                  <div className="text-gray-200 font-rajdhani mt-0.5">{selectedCommunication.target}</div>
                </div>
                <div className="text-xs">
                  <span className="text-gray-500">类型</span>
                  <div className="text-gray-200 font-rajdhani mt-0.5 capitalize">{selectedCommunication.type}</div>
                </div>
                <div className="text-xs">
                  <span className="text-gray-500">时间</span>
                  <div className="text-gray-200 font-rajdhani mt-0.5">{selectedCommunication.timestamp}</div>
                </div>
                <div className="text-xs">
                  <span className="text-gray-500">信号强度</span>
                  <div className="text-gray-200 font-rajdhani mt-0.5">{selectedCommunication.signalStrength}%</div>
                </div>
                <div className="text-xs">
                  <span className="text-gray-500">延迟</span>
                  <div className="text-gray-200 font-rajdhani mt-0.5">{formatNumber(selectedCommunication.latency, 2)}s</div>
                </div>
                <div className="text-xs">
                  <span className="text-gray-500">内容</span>
                  <div className="text-gray-300 font-rajdhani mt-0.5 leading-relaxed">{selectedCommunication.content}</div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-xs text-gray-600">
                选择一条记录查看详情
              </div>
            )}
          </div>
        </div>
      </Panel>
    </div>
  );
}
