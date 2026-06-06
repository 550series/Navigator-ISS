import { useStationStore } from "@/stores/stationStore";
import { useNavigationStore } from "@/stores/navigationStore";
import { useCommStore } from "@/stores/commStore";
import { useMissionStore } from "@/stores/missionStore";
import StatusCard from "@/components/ui/StatusCard";
import GaugeChart from "@/components/ui/GaugeChart";
import Panel from "@/components/ui/Panel";
import ProgressBar from "@/components/ui/ProgressBar";
import { formatNumber, formatPercent, getAlertLevelColor } from "@/utils/formatters";
import { Zap, Heart, Rocket, Radio, AlertTriangle, Navigation, ClipboardList } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import type { CabinStatus } from "@/data/types";

/** 空间站 SVG 中舱段 ID 与 CabinStatus.id 的映射 */
const SVG_CABIN_MAP: Record<string, { id: string; label: string }> = {
  CMD: { id: "c1", label: "CMD" },
  LIVE_A: { id: "c2", label: "LIVE-A" },
  LIVE_B: { id: "c3", label: "LIVE-B" },
  ENGINE: { id: "c4", label: "ENGINE" },
  CARGO_A: { id: "c5", label: "CARGO-A" },
  CARGO_B: { id: "c6", label: "CARGO-B" },
  MED: { id: "c7", label: "MED" },
  LAB: { id: "c8", label: "LAB" },
};

/** 总览仪表盘页面 */
export default function Dashboard() {
  const { energy, lifeSupport, propulsion, alerts, cabins } = useStationStore();
  const navigation = useNavigationStore((s) => s.navigation);
  const commLinks = useCommStore((s) => s.commLinks);
  const missions = useMissionStore((s) => s.missions);
  const [selectedCabin, setSelectedCabin] = useState<CabinStatus | null>(null);

  const activeMissions = missions.filter((m) => m.status === "in_progress").length;
  const connectedLinks = commLinks.filter((l) => l.status === "connected").length;
  const totalLinks = commLinks.length;

  const getCabin = (key: keyof typeof SVG_CABIN_MAP) => cabins.find((c) => c.id === SVG_CABIN_MAP[key].id);

  return (
    <div className="space-y-4">
      {/* 顶部指标卡片 */}
      <div className="grid grid-cols-4 gap-4">
        <StatusCard
          title="能源系统"
          value={formatNumber(energy.reactorOutput, 0)}
          unit="MW"
          icon={<Zap size={16} />}
          status={energy.reactorOutput / energy.reactorOutputMax < 0.5 ? "warning" : "normal"}
        >
          <div className="mt-2">
            <ProgressBar value={energy.storageLevel} max={100} label="储能" height={4} />
          </div>
        </StatusCard>

        <StatusCard
          title="生命维持"
          value={formatNumber(lifeSupport.oxygenLevel, 1)}
          unit="%O₂"
          icon={<Heart size={16} />}
          status={lifeSupport.filterStatus}
        >
          <div className="mt-2">
            <ProgressBar value={lifeSupport.airQuality} max={100} label="空气质量" height={4} />
          </div>
        </StatusCard>

        <StatusCard
          title="推进系统"
          value={formatNumber(propulsion.mainThrust / 1000, 1)}
          unit="kN"
          icon={<Rocket size={16} />}
          status={propulsion.engineStatus === "online" ? "normal" : "warning"}
        >
          <div className="mt-2">
            <ProgressBar value={propulsion.fuelReserve} max={100} label="燃料储备" height={4} />
          </div>
        </StatusCard>

        <StatusCard
          title="通信系统"
          value={`${connectedLinks}/${totalLinks}`}
          unit="链路"
          icon={<Radio size={16} />}
          status={connectedLinks < totalLinks * 0.5 ? "critical" : "normal"}
        >
          <div className="mt-2">
            <ProgressBar value={connectedLinks} max={totalLinks} label="连接率" height={4} />
          </div>
        </StatusCard>
      </div>

      {/* 中间区域 */}
      <div className="grid grid-cols-3 gap-4">
        {/* 空间站示意图 */}
        <Panel title="空间站概览（点击舱段查看详情）" className="col-span-2">
          <div className="relative h-64 flex items-center justify-center">
            {/* 空间站SVG示意图 */}
            <svg viewBox="0 0 400 200" className="w-full max-w-lg animate-float">
              {/* 主体环 */}
              <ellipse cx="200" cy="100" rx="120" ry="40" fill="none" stroke="#00d4ff" strokeWidth="1.5" opacity="0.6" />
              <ellipse cx="200" cy="100" rx="120" ry="40" fill="none" stroke="#00d4ff" strokeWidth="0.5" opacity="0.2" strokeDasharray="4 4" />

              {/* 中心舱（指挥舱） */}
              <CabinRect x={180} y={80} w={40} h={40} cabin={getCabin("CMD")} onClick={setSelectedCabin} label={SVG_CABIN_MAP.CMD.label} />
              {/* 左侧生活舱 */}
              <CabinRect x={60} y={88} w={50} h={24} cabin={getCabin("LIVE_A")} onClick={setSelectedCabin} label={SVG_CABIN_MAP.LIVE_A.label} />
              {/* 右侧生活舱 */}
              <CabinRect x={290} y={88} w={50} h={24} cabin={getCabin("LIVE_B")} onClick={setSelectedCabin} label={SVG_CABIN_MAP.LIVE_B.label} />
              {/* 引擎舱 */}
              <CabinRect x={155} y={140} w={90} h={20} cabin={getCabin("ENGINE")} onClick={setSelectedCabin} label={SVG_CABIN_MAP.ENGINE.label} accent="#ff8c00" />
              {/* 货舱 A/B */}
              <CabinRect x={80} y={130} w={40} h={16} cabin={getCabin("CARGO_A")} onClick={setSelectedCabin} label={SVG_CABIN_MAP.CARGO_A.label} small />
              <CabinRect x={280} y={130} w={40} h={16} cabin={getCabin("CARGO_B")} onClick={setSelectedCabin} label={SVG_CABIN_MAP.CARGO_B.label} small />
              {/* 医疗舱 / 实验室（顶部） */}
              <CabinRect x={120} y={40} w={30} h={14} cabin={getCabin("MED")} onClick={setSelectedCabin} label={SVG_CABIN_MAP.MED.label} small />
              <CabinRect x={250} y={40} w={30} h={14} cabin={getCabin("LAB")} onClick={setSelectedCabin} label={SVG_CABIN_MAP.LAB.label} small />

              {/* 推进器 */}
              <line x1="170" y1="160" x2="170" y2="180" stroke="#ff8c00" strokeWidth="1" opacity="0.5" />
              <line x1="200" y1="160" x2="200" y2="185" stroke="#ff8c00" strokeWidth="1.5" opacity="0.7" />
              <line x1="230" y1="160" x2="230" y2="180" stroke="#ff8c00" strokeWidth="1" opacity="0.5" />
              {/* 推进火焰 */}
              <ellipse cx="200" cy="190" rx="8" ry="3" fill="#ff8c00" opacity="0.4">
                <animate attributeName="ry" values="3;5;3" dur="1s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.4;0.7;0.4" dur="1s" repeatCount="indefinite" />
              </ellipse>
              {/* 连接线 */}
              <line x1="110" y1="100" x2="180" y2="100" stroke="#00d4ff" strokeWidth="0.5" opacity="0.4" strokeDasharray="3 3" />
              <line x1="220" y1="100" x2="290" y2="100" stroke="#00d4ff" strokeWidth="0.5" opacity="0.4" strokeDasharray="3 3" />
              <line x1="200" y1="120" x2="200" y2="140" stroke="#00d4ff" strokeWidth="0.5" opacity="0.4" strokeDasharray="3 3" />
              <line x1="200" y1="80" x2="200" y2="54" stroke="#00d4ff" strokeWidth="0.5" opacity="0.4" strokeDasharray="3 3" />
              <line x1="135" y1="50" x2="180" y2="82" stroke="#00d4ff" strokeWidth="0.5" opacity="0.3" strokeDasharray="3 3" />
              <line x1="265" y1="50" x2="220" y2="82" stroke="#00d4ff" strokeWidth="0.5" opacity="0.3" strokeDasharray="3 3" />
            </svg>
            {/* 扫描线效果 */}
            <div className="absolute inset-0 pointer-events-none opacity-20">
              <div className="w-full h-0.5 bg-cyber-blue/50 animate-scan-line" />
            </div>

            {/* 舱段详情卡 */}
            {selectedCabin && (
              <div className="absolute top-2 right-2 w-56 bg-space-900/95 border border-cyber-blue/40 rounded shadow-xl p-3 text-xs backdrop-blur-sm z-10">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-orbitron text-cyber-blue">{selectedCabin.name}</span>
                  <button
                    onClick={() => setSelectedCabin(null)}
                    className="text-gray-500 hover:text-white text-[10px]"
                  >
                    ✕
                  </button>
                </div>
                <div className="space-y-1.5">
                  <Row label="温度" value={`${selectedCabin.temperature.toFixed(1)}°C`} />
                  <Row label="压力" value={`${selectedCabin.pressure.toFixed(1)} kPa`} />
                  <Row label="辐射" value={`${selectedCabin.radiation.toFixed(2)} mSv/h`} />
                  <Row label="完整性" value={`${selectedCabin.integrity.toFixed(1)}%`} />
                  <div className="pt-1 border-t border-gray-800/50">
                    <span className="text-gray-500">状态：</span>
                    <span className={
                      selectedCabin.status === "normal" ? "text-cyber-green ml-1" :
                      selectedCabin.status === "warning" ? "text-cyber-amber ml-1" : "text-cyber-red ml-1"
                    }>
                      {selectedCabin.status === "normal" ? "正常" : selectedCabin.status === "warning" ? "警告" : "严重"}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Panel>

        {/* 环形仪表盘 */}
        <Panel title="核心指标">
          <div className="grid grid-cols-2 gap-4 justify-items-center">
            <GaugeChart value={energy.reactorOutput} max={energy.reactorOutputMax} label="反应堆输出" unit="MW" />
            <GaugeChart value={lifeSupport.oxygenLevel} max={25} label="氧气浓度" unit="%" />
            <GaugeChart value={propulsion.fuelReserve} max={100} label="燃料储备" unit="%" color="#ff8c00" />
            <GaugeChart value={propulsion.vectorControl} max={100} label="矢量控制" unit="%" />
          </div>
        </Panel>
      </div>

      {/* 底部区域 */}
      <div className="grid grid-cols-3 gap-4">
        {/* 告警信息 */}
        <Panel title="系统告警" icon={<AlertTriangle size={14} />} alert={alerts.some((a) => a.level === "critical" && !a.acknowledged)}>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {alerts.slice(0, 5).map((alert) => (
              <div
                key={alert.id}
                className={`flex items-start gap-2 text-xs px-2 py-1.5 rounded border ${
                  alert.level === "critical"
                    ? "border-cyber-red/20 bg-cyber-red/5"
                    : alert.level === "warning"
                    ? "border-cyber-amber/20 bg-cyber-amber/5"
                    : "border-cyber-blue/20 bg-cyber-blue/5"
                }`}
              >
                <span className={`font-bold ${getAlertLevelColor(alert.level)}`}>
                  {alert.level === "critical" ? "!!" : alert.level === "warning" ? "!" : "i"}
                </span>
                <div className="flex-1">
                  <span className="text-gray-300">{alert.message}</span>
                  <div className="text-gray-600 text-[10px] mt-0.5">{alert.source} | {alert.timestamp}</div>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        {/* 航线概览 */}
        <Panel title="航线概览" icon={<Navigation size={14} />}>
          <div className="space-y-3">
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">航程进度</span>
              <span className="text-white font-rajdhani">
                {formatNumber(navigation.currentDistance, 2)} / {formatNumber(navigation.totalDistance, 2)} 光年
              </span>
            </div>
            <ProgressBar value={navigation.currentDistance} max={navigation.totalDistance} height={8} />
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">当前速度</span>
              <span className="text-cyber-blue font-rajdhani">{formatNumber(navigation.speed * 1000, 2)}‰ c</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">轨道偏差</span>
              <span className={navigation.deviation > 0.005 ? "text-cyber-amber" : "text-cyber-green"}>{formatNumber(navigation.deviation * 1000, 2)}‰</span>
            </div>
            <Link to="/navigation" className="block text-center text-xs text-cyber-blue hover:text-cyber-blue/80 mt-2">
              查看详情 →
            </Link>
          </div>
        </Panel>

        {/* 任务概览 */}
        <Panel title="任务概览" icon={<ClipboardList size={14} />}>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">执行中任务</span>
              <span className="text-cyber-blue font-orbitron text-sm">{activeMissions}</span>
            </div>
            {missions
              .filter((m) => m.status === "in_progress")
              .slice(0, 3)
              .map((mission) => (
                <div key={mission.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-300 truncate mr-2">{mission.title}</span>
                    <span className="text-gray-500 font-rajdhani">{formatPercent(mission.progress)}</span>
                  </div>
                  <ProgressBar value={mission.progress} max={100} height={3} />
                </div>
              ))}
            <Link to="/missions" className="block text-center text-xs text-cyber-blue hover:text-cyber-blue/80 mt-2">
              查看全部 →
            </Link>
          </div>
        </Panel>
      </div>
    </div>
  );
}

/** SVG 舱段可点击矩形组件 */
function CabinRect({
  x, y, w, h, cabin, onClick, label, accent = "#00d4ff", small = false,
}: {
  x: number; y: number; w: number; h: number;
  cabin: CabinStatus | undefined;
  onClick: (c: CabinStatus) => void;
  label: string;
  accent?: string;
  small?: boolean;
}) {
  const statusColor =
    cabin?.status === "critical" ? "#ff3b3b" :
    cabin?.status === "warning" ? "#ff8c00" :
    accent;
  return (
    <g
      onClick={() => cabin && onClick(cabin)}
      style={{ cursor: "pointer" }}
      className="transition-opacity hover:opacity-100"
      opacity={0.7}
    >
      <rect
        x={x} y={y} width={w} height={h}
        rx={small ? 2 : 3}
        fill="#0c1e3a"
        stroke={statusColor}
        strokeWidth="0.8"
        opacity="1"
      />
      <text
        x={x + w / 2}
        y={y + h / 2 + (small ? 2 : 3)}
        textAnchor="middle"
        fill={statusColor}
        fontSize={small ? 5 : 6}
        fontFamily="Rajdhani"
      >
        {label}
      </text>
    </g>
  );
}

/** 详情行 */
function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-500">{label}</span>
      <span className="text-white font-rajdhani">{value}</span>
    </div>
  );
}
