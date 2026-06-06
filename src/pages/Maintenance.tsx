import { useMaintenanceStore } from "@/stores/maintenanceStore";
import Panel from "@/components/ui/Panel";
import StatusCard from "@/components/ui/StatusCard";
import { Wrench, Calendar, CheckCircle, Clock, Package } from "lucide-react";
import { useState } from "react";

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

const priorityColors: Record<string, string> = {
  low: "text-gray-400",
  medium: "text-cyber-blue",
  high: "text-cyber-amber",
  critical: "text-cyber-red",
};

const typeLabels: Record<string, string> = {
  preventive: "预防性",
  corrective: "纠正性",
  emergency: "紧急",
};

export default function Maintenance() {
  const { records, spareParts, completeRecord, getStats } = useMaintenanceStore();
  const [selectedRecord, setSelectedRecord] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"records" | "parts">("records");
  const [completionNotes, setCompletionNotes] = useState("");

  const stats = getStats();
  const selected = records.find((r) => r.id === selectedRecord);

  const handleComplete = (id: string) => {
    if (!completionNotes.trim()) return;
    completeRecord(id, completionNotes);
    setCompletionNotes("");
    setSelectedRecord(null);
  };

  return (
    <div className="space-y-4">
      {/* 顶部统计 */}
      <div className="grid grid-cols-5 gap-4">
        <StatusCard
          title="总工单"
          value={stats.totalRecords}
          icon={<Wrench size={16} />}
        />
        <StatusCard
          title="计划中"
          value={stats.scheduled}
          icon={<Calendar size={16} />}
          status="normal"
        />
        <StatusCard
          title="进行中"
          value={stats.inProgress}
          icon={<Clock size={16} />}
          status={stats.inProgress > 0 ? "warning" : "normal"}
        />
        <StatusCard
          title="已完成"
          value={stats.completed}
          icon={<CheckCircle size={16} />}
          status="normal"
        />
        <StatusCard
          title="低库存备件"
          value={stats.lowStockParts}
          icon={<Package size={16} />}
          status={stats.lowStockParts > 0 ? "warning" : "normal"}
        />
      </div>

      {/* 标签页切换 */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab("records")}
          className={`px-4 py-2 text-xs rounded border transition-colors font-rajdhani font-bold ${
            activeTab === "records"
              ? "border-cyber-blue/50 bg-cyber-blue/10 text-cyber-blue"
              : "border-gray-700 text-gray-400 hover:border-cyber-blue/30"
          }`}
        >
          <Wrench size={12} className="inline mr-1" /> 维修工单
        </button>
        <button
          onClick={() => setActiveTab("parts")}
          className={`px-4 py-2 text-xs rounded border transition-colors font-rajdhani font-bold ${
            activeTab === "parts"
              ? "border-cyber-blue/50 bg-cyber-blue/10 text-cyber-blue"
              : "border-gray-700 text-gray-400 hover:border-cyber-blue/30"
          }`}
        >
          <Package size={12} className="inline mr-1" /> 备件库存
        </button>
      </div>

      {activeTab === "records" ? (
        <div className="grid grid-cols-3 gap-4">
          {/* 维修工单列表 */}
          <div className="col-span-2">
            <Panel title="维修工单" icon={<Wrench size={14} />}>
              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {records.map((record) => (
                  <div
                    key={record.id}
                    onClick={() => setSelectedRecord(record.id)}
                    className={`p-3 rounded border cursor-pointer transition-all duration-200 ${
                      selectedRecord === record.id
                        ? "border-cyber-blue/50 bg-cyber-blue/5"
                        : `${statusColors[record.status]} hover:border-cyber-blue/30`
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-rajdhani font-bold text-white">
                            {record.equipmentName}
                          </span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded ${statusColors[record.status]}`}>
                            {statusLabels[record.status]}
                          </span>
                          <span className={`text-[10px] ${priorityColors[record.priority]}`}>
                            {record.priority === "critical" ? "紧急" : 
                             record.priority === "high" ? "高" :
                             record.priority === "medium" ? "中" : "低"}
                          </span>
                        </div>
                        <div className="text-xs text-gray-300">{record.description}</div>
                        <div className="text-[10px] text-gray-500 mt-1">
                          {record.scheduledDate} · {record.assignee} · {typeLabels[record.type]}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Panel>
          </div>

          {/* 工单详情 */}
          <div>
            {selected ? (
              <Panel title="工单详情" icon={<Wrench size={14} />}>
                <div className="space-y-3">
                  <div>
                    <div className="text-[10px] text-gray-500 mb-1">设备</div>
                    <div className="text-sm font-rajdhani text-white">{selected.equipmentName}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-500 mb-1">类型</div>
                    <div className="text-sm font-rajdhani text-white">{typeLabels[selected.type]}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-500 mb-1">状态</div>
                    <div className={`text-sm font-rajdhani font-bold ${
                      statusColors[selected.status].split(" ").pop()
                    }`}>
                      {statusLabels[selected.status]}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-500 mb-1">优先级</div>
                    <div className={`text-sm font-rajdhani font-bold ${priorityColors[selected.priority]}`}>
                      {selected.priority === "critical" ? "紧急" : 
                       selected.priority === "high" ? "高" :
                       selected.priority === "medium" ? "中" : "低"}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-500 mb-1">负责人</div>
                    <div className="text-sm font-rajdhani text-white">{selected.assignee}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-500 mb-1">计划日期</div>
                    <div className="text-sm font-rajdhani text-white">{selected.scheduledDate}</div>
                  </div>
                  {selected.completedDate && (
                    <div>
                      <div className="text-[10px] text-gray-500 mb-1">完成日期</div>
                      <div className="text-sm font-rajdhani text-white">{selected.completedDate}</div>
                    </div>
                  )}
                  <div>
                    <div className="text-[10px] text-gray-500 mb-1">描述</div>
                    <div className="text-xs text-gray-300 bg-space-900/50 p-2 rounded border border-gray-800">
                      {selected.description}
                    </div>
                  </div>

                  {/* 使用的备件 */}
                  {selected.partsUsed.length > 0 && (
                    <div>
                      <div className="text-[10px] text-gray-500 mb-1">使用的备件</div>
                      <div className="space-y-1">
                        {selected.partsUsed.map((part, i) => (
                          <div key={i} className="text-xs text-gray-400 flex justify-between">
                            <span>{part.partName}</span>
                            <span>x{part.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 备注 */}
                  {selected.notes.length > 0 && (
                    <div>
                      <div className="text-[10px] text-gray-500 mb-1">备注</div>
                      <div className="space-y-1">
                        {selected.notes.map((note, i) => (
                          <div key={i} className="text-xs text-gray-400 bg-space-900/50 p-2 rounded">
                            {note}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 完成工单 */}
                  {selected.status !== "completed" && (
                    <div className="border-t border-gray-800 pt-3">
                      <div className="text-[10px] text-gray-500 mb-2">完成工单</div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={completionNotes}
                          onChange={(e) => setCompletionNotes(e.target.value)}
                          placeholder="输入完成备注..."
                          className="flex-1 bg-space-900 border border-gray-700 text-xs text-gray-300 px-3 py-2 rounded"
                        />
                        <button
                          onClick={() => handleComplete(selected.id)}
                          disabled={!completionNotes.trim()}
                          className="px-3 py-2 text-xs rounded border border-cyber-green/30 text-cyber-green hover:bg-cyber-green/10 transition-colors font-rajdhani disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          完成
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </Panel>
            ) : (
              <Panel title="工单详情" icon={<Wrench size={14} />}>
                <div className="text-center text-gray-500 text-xs py-8">
                  选择左侧工单查看详情
                </div>
              </Panel>
            )}
          </div>
        </div>
      ) : (
        /* 备件库存 */
        <Panel title="备件库存" icon={<Package size={14} />}>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left py-2 px-3 text-gray-500 font-rajdhani">备件名称</th>
                  <th className="text-left py-2 px-3 text-gray-500 font-rajdhani">类别</th>
                  <th className="text-right py-2 px-3 text-gray-500 font-rajdhani">库存</th>
                  <th className="text-right py-2 px-3 text-gray-500 font-rajdhani">最低库存</th>
                  <th className="text-left py-2 px-3 text-gray-500 font-rajdhani">位置</th>
                  <th className="text-left py-2 px-3 text-gray-500 font-rajdhani">最后补货</th>
                  <th className="text-center py-2 px-3 text-gray-500 font-rajdhani">状态</th>
                </tr>
              </thead>
              <tbody>
                {spareParts.map((part) => (
                  <tr key={part.id} className="border-b border-gray-800/50 hover:bg-space-800/30">
                    <td className="py-2 px-3 text-gray-200 font-rajdhani">{part.name}</td>
                    <td className="py-2 px-3 text-gray-400">{part.category}</td>
                    <td className="py-2 px-3 text-right text-white font-rajdhani">{part.quantity}</td>
                    <td className="py-2 px-3 text-right text-gray-400 font-rajdhani">{part.minStock}</td>
                    <td className="py-2 px-3 text-gray-400">{part.location}</td>
                    <td className="py-2 px-3 text-gray-400">{part.lastRestocked}</td>
                    <td className="py-2 px-3 text-center">
                      {part.quantity <= part.minStock ? (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-cyber-red/10 text-cyber-red">
                          低库存
                        </span>
                      ) : (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-cyber-green/10 text-cyber-green">
                          正常
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      )}
    </div>
  );
}
