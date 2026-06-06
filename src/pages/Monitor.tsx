import { useStationStore } from "@/stores/stationStore";
import Panel from "@/components/ui/Panel";
import GaugeChart from "@/components/ui/GaugeChart";
import ProgressBar from "@/components/ui/ProgressBar";
import StatusCard from "@/components/ui/StatusCard";
import { formatNumber, getStatusColor, getStatusBgColor } from "@/utils/formatters";
import { Thermometer, Gauge, Radiation, Shield, Zap, Wind, Rocket } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const DIST_COLORS = ["#00d4ff", "#ff8c00", "#00ff88", "#a855f7", "#4a5568"];

/** 空间站状态监控页面 */
export default function Monitor() {
  const { cabins, energy, lifeSupport, propulsion } = useStationStore();

  return (
    <div className="space-y-4">
      {/* 舱室状态 */}
      <Panel title="舱室状态" icon={<Shield size={14} />}>
        <div className="grid grid-cols-4 gap-3">
          {cabins.map((cabin) => (
            <div
              key={cabin.id}
              className={`rounded border p-3 ${getStatusBgColor(cabin.status)} transition-all duration-300`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-rajdhani font-medium text-gray-200">{cabin.name}</span>
                <span className={`text-[10px] font-bold uppercase ${getStatusColor(cabin.status)}`}>
                  {cabin.status === "normal" ? "正常" : cabin.status === "warning" ? "警告" : "危险"}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="flex items-center gap-1">
                  <Thermometer size={10} className="text-gray-500" />
                  <span className="text-gray-400">{formatNumber(cabin.temperature, 1)}°C</span>
                </div>
                <div className="flex items-center gap-1">
                  <Gauge size={10} className="text-gray-500" />
                  <span className="text-gray-400">{formatNumber(cabin.pressure, 1)} kPa</span>
                </div>
                <div className="flex items-center gap-1">
                  <Radiation size={10} className="text-gray-500" />
                  <span className="text-gray-400">{formatNumber(cabin.radiation, 2)} mSv</span>
                </div>
                <div className="flex items-center gap-1">
                  <Shield size={10} className="text-gray-500" />
                  <span className="text-gray-400">{formatNumber(cabin.integrity, 1)}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      {/* 能源系统 */}
      <div className="grid grid-cols-2 gap-4">
        <Panel title="能源系统" icon={<Zap size={14} />}>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <GaugeChart value={energy.reactorOutput} max={energy.reactorOutputMax} label="反应堆" unit="MW" size={100} />
            <GaugeChart value={energy.storageLevel} max={100} label="储能" unit="%" size={100} />
            <GaugeChart value={energy.consumption} max={1000} label="消耗" unit="MW" size={100} color="#ff8c00" />
          </div>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={energy.trend}>
                <defs>
                  <linearGradient id="outputGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="consumptionGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff8c00" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ff8c00" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" tick={{ fill: "#4a5568", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#4a5568", fontSize: 10 }} axisLine={false} tickLine={false} width={40} />
                <Tooltip
                  contentStyle={{ background: "#0c1e3a", border: "1px solid rgba(0,212,255,0.3)", borderRadius: 4, fontSize: 12 }}
                  labelStyle={{ color: "#00d4ff" }}
                />
                <Area type="monotone" dataKey="output" stroke="#00d4ff" fill="url(#outputGrad)" strokeWidth={1.5} name="输出" />
                <Area type="monotone" dataKey="consumption" stroke="#ff8c00" fill="url(#consumptionGrad)" strokeWidth={1.5} name="消耗" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="能源分配" icon={<Zap size={14} />}>
          <div className="flex items-center gap-6">
            <div className="w-48 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={energy.distribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    dataKey="value"
                    stroke="none"
                  >
                    {energy.distribution.map((_, index) => (
                      <Cell key={index} fill={DIST_COLORS[index % DIST_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: "#0c1e3a", border: "1px solid rgba(0,212,255,0.3)", borderRadius: 4, fontSize: 12 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-2">
              {energy.distribution.map((item, index) => (
                <div key={item.name} className="flex items-center gap-2 text-xs">
                  <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: DIST_COLORS[index] }} />
                  <span className="text-gray-400 flex-1">{item.name}</span>
                  <span className="text-white font-rajdhani">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </Panel>
      </div>

      {/* 生命维持 + 推进系统 */}
      <div className="grid grid-cols-2 gap-4">
        <Panel title="生命维持系统" icon={<Wind size={14} />}>
          <div className="grid grid-cols-2 gap-4">
            <StatusCard title="氧气浓度" value={formatNumber(lifeSupport.oxygenLevel, 1)} unit="%" status={lifeSupport.oxygenLevel < 19 ? "critical" : "normal"} />
            <StatusCard title="CO₂浓度" value={formatNumber(lifeSupport.co2Level, 3)} unit="%" status={lifeSupport.co2Level > 0.05 ? "warning" : "normal"} />
            <StatusCard title="湿度" value={formatNumber(lifeSupport.humidity, 0)} unit="%" />
            <StatusCard title="温度" value={formatNumber(lifeSupport.temperature, 1)} unit="°C" />
            <StatusCard title="水循环效率" value={formatNumber(lifeSupport.waterRecycling, 1)} unit="%" status={lifeSupport.waterRecycling < 95 ? "warning" : "normal"} />
            <StatusCard title="空气质量" value={formatNumber(lifeSupport.airQuality, 0)} unit="/100" status={lifeSupport.airQuality < 85 ? "warning" : "normal"} />
          </div>
        </Panel>

        <Panel title="推进系统" icon={<Rocket size={14} />}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <StatusCard
                title="主引擎推力"
                value={formatNumber(propulsion.mainThrust / 1000, 1)}
                unit="kN"
                status={propulsion.engineStatus === "online" ? "normal" : "warning"}
              />
              <StatusCard
                title="矢量控制"
                value={formatNumber(propulsion.vectorControl, 1)}
                unit="%"
                status={propulsion.vectorControl < 98 ? "warning" : "normal"}
              />
            </div>
            <div>
              <div className="text-xs text-gray-400 mb-2 font-rajdhani">燃料储备</div>
              <ProgressBar value={propulsion.fuelReserve} max={100} height={10} />
            </div>
            <div>
              <div className="text-xs text-gray-400 mb-2 font-rajdhani">离子推进器状态</div>
              <div className="grid grid-cols-4 gap-2">
                {propulsion.ionThrusters.map((thruster) => (
                  <div
                    key={thruster.id}
                    className={`text-center text-xs p-2 rounded border ${
                      thruster.thrust > 0
                        ? "border-cyber-green/30 bg-cyber-green/5 text-cyber-green"
                        : "border-cyber-red/30 bg-cyber-red/5 text-cyber-red"
                    }`}
                  >
                    <div className="font-rajdhani font-bold">{thruster.id.toUpperCase()}</div>
                    <div className="text-[10px]">{thruster.thrust > 0 ? `${thruster.thrust}N` : thruster.status}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}
