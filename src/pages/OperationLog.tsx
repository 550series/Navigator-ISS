import { useOperationLogStore } from "@/stores/operationLogStore";
import Panel from "@/components/ui/Panel";
import StatusCard from "@/components/ui/StatusCard";
import { FileText, CheckCircle, XCircle, Clock, Trash2, Download } from "lucide-react";
import { useState } from "react";

const resultColors: Record<string, string> = {
  success: "text-cyber-green",
  failure: "text-cyber-red",
  pending: "text-cyber-amber",
};

const resultLabels: Record<string, string> = {
  success: "成功",
  failure: "失败",
  pending: "待处理",
};

const resultIcons: Record<string, React.ReactNode> = {
  success: <CheckCircle size={12} />,
  failure: <XCircle size={12} />,
  pending: <Clock size={12} />,
};

export default function OperationLog() {
  const { logs, clearLogs, getStats } = useOperationLogStore();
  const [filterResult, setFilterResult] = useState<string>("all");
  const [searchText, setSearchText] = useState("");

  const stats = getStats();

  const filteredLogs = logs.filter((log) => {
    if (filterResult !== "all" && log.result !== filterResult) return false;
    if (searchText) {
      const q = searchText.toLowerCase();
      return (
        log.action.toLowerCase().includes(q) ||
        log.target.toLowerCase().includes(q) ||
        log.userName.toLowerCase().includes(q) ||
        log.details.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleExport = () => {
    const csv = [
      "时间,用户,操作,目标,详情,结果",
      ...filteredLogs.map(
        (l) => `"${l.timestamp}","${l.userName}","${l.action}","${l.target}","${l.details}","${resultLabels[l.result]}"`
      ),
    ].join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `operation-log-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-5 gap-4">
        <StatusCard title="总记录" value={stats.total} icon={<FileText size={16} />} />
        <StatusCard title="成功" value={stats.success} icon={<CheckCircle size={16} />} status="normal" />
        <StatusCard title="失败" value={stats.failure} icon={<XCircle size={16} />} status={stats.failure > 0 ? "critical" : "normal"} />
        <StatusCard title="待处理" value={stats.pending} icon={<Clock size={16} />} status={stats.pending > 0 ? "warning" : "normal"} />
        <StatusCard title="今日操作" value={stats.todayCount} icon={<FileText size={16} />} />
      </div>

      <Panel title="操作日志" icon={<FileText size={14} />}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="搜索日志..."
              className="bg-space-900 border border-gray-700 text-xs text-gray-300 px-3 py-1.5 rounded w-48"
            />
            <div className="flex gap-1">
              {["all", "success", "failure", "pending"].map((r) => (
                <button
                  key={r}
                  onClick={() => setFilterResult(r)}
                  className={`px-2 py-1 text-[10px] rounded border transition-colors font-rajdhani ${
                    filterResult === r
                      ? r === "all"
                        ? "border-cyber-blue/40 bg-cyber-blue/5 text-cyber-blue"
                        : r === "success"
                        ? "border-cyber-green/40 bg-cyber-green/5 text-cyber-green"
                        : r === "failure"
                        ? "border-cyber-red/40 bg-cyber-red/5 text-cyber-red"
                        : "border-cyber-amber/40 bg-cyber-amber/5 text-cyber-amber"
                      : "border-gray-700 text-gray-500"
                  }`}
                >
                  {r === "all" ? "全部" : resultLabels[r]}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-gray-500 font-rajdhani">
              {filteredLogs.length} / {logs.length} 条
            </span>
            <button
              onClick={handleExport}
              className="flex items-center gap-1 px-2 py-1 text-[10px] rounded border border-gray-700 text-gray-400 hover:border-cyber-blue/30 hover:text-cyber-blue transition-colors font-rajdhani"
            >
              <Download size={10} /> 导出
            </button>
            <button
              onClick={() => {
                if (confirm("确定清空所有操作日志？")) clearLogs();
              }}
              className="flex items-center gap-1 px-2 py-1 text-[10px] rounded border border-gray-700 text-gray-500 hover:border-cyber-red/30 hover:text-cyber-red transition-colors font-rajdhani"
            >
              <Trash2 size={10} /> 清空
            </button>
          </div>
        </div>

        <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
          <table className="w-full text-xs">
            <thead className="sticky top-0 bg-space-800">
              <tr className="border-b border-gray-800">
                <th className="text-left py-2 px-3 text-gray-500 font-rajdhani w-32">时间</th>
                <th className="text-left py-2 px-3 text-gray-500 font-rajdhani w-16">用户</th>
                <th className="text-left py-2 px-3 text-gray-500 font-rajdhani w-24">操作</th>
                <th className="text-left py-2 px-3 text-gray-500 font-rajdhani">目标</th>
                <th className="text-left py-2 px-3 text-gray-500 font-rajdhani">详情</th>
                <th className="text-center py-2 px-3 text-gray-500 font-rajdhani w-16">结果</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.id} className="border-b border-gray-800/50 hover:bg-space-800/30">
                  <td className="py-2 px-3 text-gray-500 font-rajdhani whitespace-nowrap">{log.timestamp}</td>
                  <td className="py-2 px-3 text-gray-200 font-rajdhani">{log.userName}</td>
                  <td className="py-2 px-3 text-cyber-blue font-rajdhani">{log.action}</td>
                  <td className="py-2 px-3 text-gray-200">{log.target}</td>
                  <td className="py-2 px-3 text-gray-400 max-w-[300px] truncate">{log.details}</td>
                  <td className="py-2 px-3 text-center">
                    <span className={`inline-flex items-center gap-1 ${resultColors[log.result]}`}>
                      {resultIcons[log.result]}
                      <span className="font-rajdhani text-[10px]">{resultLabels[log.result]}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
