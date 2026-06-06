import { useResourceStore } from "@/stores/resourceStore";
import Panel from "@/components/ui/Panel";
import { Users, Heart, MapPin, Clock } from "lucide-react";
import { useState, useMemo } from "react";
import type { Personnel } from "@/data/types";

const healthLabels: Record<Personnel["healthStatus"], string> = {
  healthy: "健康",
  minor: "轻伤",
  injured: "重伤",
};

const healthColors: Record<Personnel["healthStatus"], string> = {
  healthy: "border-cyber-green/30 bg-cyber-green/5 text-cyber-green",
  minor: "border-cyber-amber/30 bg-cyber-amber/5 text-cyber-amber",
  injured: "border-cyber-red/30 bg-cyber-red/5 text-cyber-red",
};

const shiftLabels: Record<Personnel["shift"], string> = {
  A: "A 班",
  B: "B 班",
  C: "C 班",
};

/** 船员花名册页面 */
export default function Crew() {
  const { personnel, setPersonnelHealth } = useResourceStore();
  const [selectedId, setSelectedId] = useState<string | null>(personnel[0]?.id ?? null);
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [shiftFilter, setShiftFilter] = useState<string>("all");
  const [healthFilter, setHealthFilter] = useState<string>("all");

  const departments = useMemo(
    () => Array.from(new Set(personnel.map((p) => p.department))),
    [personnel]
  );

  const filtered = personnel.filter((p) => {
    if (departmentFilter !== "all" && p.department !== departmentFilter) return false;
    if (shiftFilter !== "all" && p.shift !== shiftFilter) return false;
    if (healthFilter !== "all" && p.healthStatus !== healthFilter) return false;
    return true;
  });

  const selected = personnel.find((p) => p.id === selectedId);

  const stats = {
    total: personnel.length,
    healthy: personnel.filter((p) => p.healthStatus === "healthy").length,
    minor: personnel.filter((p) => p.healthStatus === "minor").length,
    injured: personnel.filter((p) => p.healthStatus === "injured").length,
  };

  return (
    <div className="space-y-4">
      {/* 统计卡片 */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-space-800/60 rounded border border-cyber-blue/20 p-4">
          <div className="text-xs text-gray-400 font-rajdhani mb-1">船员总数</div>
          <div className="text-2xl font-orbitron font-bold text-white">{stats.total}</div>
        </div>
        <div className="bg-space-800/60 rounded border border-cyber-green/20 p-4">
          <div className="text-xs text-gray-400 font-rajdhani mb-1">健康</div>
          <div className="text-2xl font-orbitron font-bold text-cyber-green">{stats.healthy}</div>
        </div>
        <div className="bg-space-800/60 rounded border border-cyber-amber/20 p-4">
          <div className="text-xs text-gray-400 font-rajdhani mb-1">轻伤</div>
          <div className="text-2xl font-orbitron font-bold text-cyber-amber">{stats.minor}</div>
        </div>
        <div className="bg-space-800/60 rounded border border-cyber-red/20 p-4">
          <div className="text-xs text-gray-400 font-rajdhani mb-1">重伤</div>
          <div className="text-2xl font-orbitron font-bold text-cyber-red">{stats.injured}</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* 左侧：筛选 + 卡片网格 */}
        <div className="col-span-2 space-y-4">
          {/* 筛选条 */}
          <div className="bg-space-800/60 rounded border border-cyber-blue/20 p-3 flex flex-wrap gap-3 items-center">
            <span className="text-[10px] text-gray-500 font-rajdhani">部门</span>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="bg-space-900 border border-gray-700 text-xs text-gray-300 px-2 py-1 rounded"
            >
              <option value="all">全部</option>
              {departments.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            <span className="text-[10px] text-gray-500 font-rajdhani">班次</span>
            <select
              value={shiftFilter}
              onChange={(e) => setShiftFilter(e.target.value)}
              className="bg-space-900 border border-gray-700 text-xs text-gray-300 px-2 py-1 rounded"
            >
              <option value="all">全部</option>
              <option value="A">A 班</option>
              <option value="B">B 班</option>
              <option value="C">C 班</option>
            </select>
            <span className="text-[10px] text-gray-500 font-rajdhani">健康</span>
            <select
              value={healthFilter}
              onChange={(e) => setHealthFilter(e.target.value)}
              className="bg-space-900 border border-gray-700 text-xs text-gray-300 px-2 py-1 rounded"
            >
              <option value="all">全部</option>
              <option value="healthy">健康</option>
              <option value="minor">轻伤</option>
              <option value="injured">重伤</option>
            </select>
            <span className="ml-auto text-[10px] text-gray-600 font-rajdhani">
              {filtered.length} / {personnel.length}
            </span>
          </div>

          {/* 卡片网格 */}
          <div className="grid grid-cols-2 gap-3">
            {filtered.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedId(p.id)}
                className={`text-left rounded border p-3 transition-all ${
                  selectedId === p.id
                    ? "border-cyber-blue/50 bg-cyber-blue/5"
                    : "border-gray-800/50 hover:border-cyber-blue/30 bg-space-800/40"
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-full bg-space-700 border border-cyber-blue/30 flex items-center justify-center text-cyber-blue font-orbitron text-sm">
                    {p.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-white font-rajdhani font-medium truncate">{p.name}</div>
                    <div className="text-[10px] text-gray-500 truncate">{p.role} · {p.department}</div>
                  </div>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded border ${healthColors[p.healthStatus]}`}>
                    {healthLabels[p.healthStatus]}
                  </span>
                </div>
                <div className="flex justify-between text-[10px] text-gray-500">
                  <span className="flex items-center gap-1"><Clock size={10} />{shiftLabels[p.shift]}</span>
                  <span className="flex items-center gap-1"><MapPin size={10} />{p.location}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 右侧：详情 */}
        <Panel title="船员详情" icon={<Users size={14} />}>
          {selected ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-space-700 border-2 border-cyber-blue/40 flex items-center justify-center text-cyber-blue font-orbitron text-lg">
                  {selected.name.charAt(0)}
                </div>
                <div>
                  <div className="font-orbitron text-white text-base">{selected.name}</div>
                  <div className="text-xs text-gray-400">{selected.role}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-space-900/50 rounded p-2 border border-cyber-blue/10">
                  <div className="text-gray-500 text-[10px] mb-1">所属部门</div>
                  <div className="text-gray-200 font-rajdhani">{selected.department}</div>
                </div>
                <div className="bg-space-900/50 rounded p-2 border border-cyber-blue/10">
                  <div className="text-gray-500 text-[10px] mb-1">班次</div>
                  <div className="text-gray-200 font-rajdhani">{shiftLabels[selected.shift]}</div>
                </div>
                <div className="bg-space-900/50 rounded p-2 border border-cyber-blue/10 col-span-2">
                  <div className="text-gray-500 text-[10px] mb-1">当前位置</div>
                  <div className="text-gray-200 font-rajdhani flex items-center gap-1">
                    <MapPin size={11} />{selected.location}
                  </div>
                </div>
              </div>

              <div>
                <div className="text-[10px] text-gray-500 mb-2 flex items-center gap-1">
                  <Heart size={10} />健康状态（手动调整）
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {(["healthy", "minor", "injured"] as const).map((h) => (
                    <button
                      key={h}
                      onClick={() => setPersonnelHealth(selected.id, h)}
                      className={`text-[10px] py-1.5 rounded border transition-colors ${
                        selected.healthStatus === h
                          ? healthColors[h]
                          : "border-gray-700 text-gray-500 hover:border-gray-500"
                      }`}
                    >
                      {healthLabels[h]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-48 text-xs text-gray-600">
              选择一位船员查看详情
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
}
