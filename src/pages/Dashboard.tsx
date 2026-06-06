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

/** 总览仪表盘页面 */
export default function Dashboard() {
  const { energy, lifeSupport, propulsion, alerts } = useStationStore();
  const navigation = useNavigationStore((s) => s.navigation);
  const commLinks = useCommStore((s) => s.commLinks);
  const missions = useMissionStore((s) => s.missions);

  const activeMissions = missions.filter((m) => m.status === "in_progress").length;
  const connectedLinks = commLinks.filter((l) => l.status === "connected").length;
  const totalLinks = commLinks.length;

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
        <Panel title="空间站概览" className="col-span-2">
          <div className="relative h-64 flex items-center justify-center">
            {/* 空间站SVG示意图 */}
            <svg viewBox="0 0 400 200" className="w-full max-w-lg animate-float">
              {/* 主体环 */}
              <ellipse cx="200" cy="100" rx="120" ry="40" fill="none" stroke="#00d4ff" strokeWidth="1.5" opacity="0.6" />
              <ellipse cx="200" cy="100" rx="120" ry="40" fill="none" stroke="#00d4ff" strokeWidth="0.5" opacity="0.2" strokeDasharray="4 4" />
              {/* 中心舱 */}
              <rect x="180" y="80" width="40" height="40" rx="4" fill="#0c1e3a" stroke="#00d4ff" strokeWidth="1" opacity="0.8" />
              <text x="200" y="104" textAnchor="middle" fill="#00d4ff" fontSize="8" fontFamily="Orbitron">CMD</text>
              {/* 左侧舱段 */}
              <rect x="60" y="88" width="50" height="24" rx="3" fill="#0c1e3a" stroke="#00d4ff" strokeWidth="0.8" opacity="0.7" />
              <text x="85" y="104" textAnchor="middle" fill="#00d4ff" fontSize="6" fontFamily="Rajdhani">LIVE-A</text>
              {/* 右侧舱段 */}
              <rect x="290" y="88" width="50" height="24" rx="3" fill="#0c1e3a" stroke="#00d4ff" strokeWidth="0.8" opacity="0.7" />
              <text x="315" y="104" textAnchor="middle" fill="#00d4ff" fontSize="6" fontFamily="Rajdhani">LIVE-B</text>
              {/* 引擎舱 */}
              <rect x="155" y="140" width="90" height="20" rx="3" fill="#0c1e3a" stroke="#ff8c00" strokeWidth="0.8" opacity="0.7" />
              <text x="200" y="154" textAnchor="middle" fill="#ff8c00" fontSize="6" fontFamily="Rajdhani">ENGINE</text>
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
              {/* 货舱 */}
              <rect x="80" y="130" width="40" height="16" rx="2" fill="#0c1e3a" stroke="#00d4ff" strokeWidth="0.5" opacity="0.5" />
              <text x="100" y="142" textAnchor="middle" fill="#00d4ff" fontSize="5" fontFamily="Rajdhani">CARGO-A</text>
              <rect x="280" y="130" width="40" height="16" rx="2" fill="#0c1e3a" stroke="#00d4ff" strokeWidth="0.5" opacity="0.5" />
              <text x="300" y="142" textAnchor="middle" fill="#00d4ff" fontSize="5" fontFamily="Rajdhani">CARGO-B</text>
            </svg>
            {/* 扫描线效果 */}
            <div className="absolute inset-0 pointer-events-none opacity-20">
              <div className="w-full h-0.5 bg-cyber-blue/50 animate-scan-line" />
            </div>
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
