import { memo, useState } from "react";
import { useNavigationStore } from "@/stores/navigationStore";
import Panel from "@/components/ui/Panel";
import { Navigation, Compass } from "lucide-react";
import { formatNumber } from "@/utils/formatters";

const RouteVisualization = memo(function RouteVisualization() {
  const { navigation } = useNavigationStore();
  const [selectedWaypoint, setSelectedWaypoint] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-3 gap-4">
      <Panel title="航线可视化" icon={<Navigation size={14} />} className="col-span-2">
        <div className="relative h-80">
          <svg viewBox="0 0 600 280" className="w-full h-full">
            {/* 星点背景 */}
            {Array.from({ length: 40 }, (_, i) => {
              const sx = ((i * 137 + 42) % 600);
              const sy = ((i * 89 + 17) % 280);
              const sr = (i % 3) * 0.4 + 0.5;
              const so = (i % 5) * 0.08 + 0.15;
              return <circle key={i} cx={sx} cy={sy} r={sr} fill="white" opacity={so} />;
            })}

            {/* 航线轨迹 - 未完成部分 */}
            <path
              d="M 50 230 C 150 210, 200 150, 300 120 S 450 90, 550 60"
              fill="none"
              stroke="#00d4ff"
              strokeWidth="1.5"
              strokeDasharray="6 3"
              opacity="0.3"
            />

            {/* 航线轨迹 - 已完成部分 */}
            <path
              d="M 50 230 C 150 210, 200 150, 300 120"
              fill="none"
              stroke="#00d4ff"
              strokeWidth="2.5"
              opacity="0.8"
            />

            {/* 引力辅助点标记 */}
            <circle cx="200" cy="150" r="12" fill="none" stroke="#ff8c00" strokeWidth="1" strokeDasharray="3 3" />
            <text x="200" y="170" textAnchor="middle" fill="#ff8c00" fontSize="8" fontFamily="Rajdhani">木星引力</text>

            <circle cx="400" cy="90" r="10" fill="none" stroke="#a855f7" strokeWidth="1" strokeDasharray="3 3" />
            <text x="400" y="108" textAnchor="middle" fill="#a855f7" fontSize="8" fontFamily="Rajdhani">土星引力</text>

            {/* 地球标记 */}
            <circle cx="50" cy="230" r="10" fill="#1a3355" stroke="#00d4ff" strokeWidth="1.5" />
            <text x="50" y="250" textAnchor="middle" fill="#4a5568" fontSize="9" fontFamily="Rajdhani">地球</text>

            {/* 当前位置 - 脉冲动画 */}
            <circle cx="300" cy="120" r="8" fill="#00d4ff" opacity="0.2">
              <animate attributeName="r" values="8;14;8" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.2;0.05;0.2" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx="300" cy="120" r="5" fill="#00d4ff" />
            <text x="300" y="108" textAnchor="middle" fill="#00d4ff" fontSize="10" fontFamily="Orbitron" fontWeight="bold">ISS</text>

            {/* 目标标记 */}
            <circle cx="550" cy="60" r="10" fill="#1a3355" stroke="#ff8c00" strokeWidth="1.5" />
            <text x="550" y="80" textAnchor="middle" fill="#ff8c00" fontSize="9" fontFamily="Rajdhani">α星C</text>

            {/* 航点标记 */}
            {navigation.waypoints.map((wp, i) => {
              const x = 50 + (i / (navigation.waypoints.length - 1)) * 500;
              const y = 230 - (i / (navigation.waypoints.length - 1)) * 170;
              return (
                <g
                  key={wp.name}
                  onClick={() => setSelectedWaypoint(wp.name)}
                  style={{ cursor: "pointer" }}
                >
                  <circle
                    cx={x}
                    cy={y}
                    r={selectedWaypoint === wp.name ? 5 : 3}
                    fill={wp.completed ? "#00ff88" : "#00d4ff"}
                    opacity={wp.completed ? 0.8 : 0.4}
                  />
                  {selectedWaypoint === wp.name && (
                    <circle cx={x} cy={y} r="8" fill="none" stroke="#00d4ff" strokeWidth="1" opacity="0.5" />
                  )}
                </g>
              );
            })}

            {/* 风险区域标记 */}
            <ellipse cx="250" cy="140" rx="30" ry="15" fill="none" stroke="#ff3b3b" strokeWidth="0.5" strokeDasharray="4 2" opacity="0.4" />
            <text x="250" y="160" textAnchor="middle" fill="#ff3b3b" fontSize="7" fontFamily="Rajdhani" opacity="0.6">小行星带</text>

            <ellipse cx="450" cy="80" rx="25" ry="12" fill="none" stroke="#a855f7" strokeWidth="0.5" strokeDasharray="4 2" opacity="0.4" />
            <text x="450" y="98" textAnchor="middle" fill="#a855f7" fontSize="7" fontFamily="Rajdhani" opacity="0.6">辐射带</text>
          </svg>
        </div>
      </Panel>

      <Panel title="航点列表" icon={<Compass size={14} />}>
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {navigation.waypoints.map((wp, i) => (
            <div
              key={wp.name}
              onClick={() => setSelectedWaypoint(wp.name)}
              className={`flex items-center gap-2 text-xs px-2 py-2 rounded border cursor-pointer transition-colors ${
                selectedWaypoint === wp.name
                  ? "border-cyber-blue/50 bg-cyber-blue/10"
                  : wp.completed
                  ? "border-cyber-green/20 bg-cyber-green/5"
                  : i === navigation.waypoints.filter((w) => w.completed).length
                  ? "border-cyber-blue/30 bg-cyber-blue/5"
                  : "border-gray-800/50"
              }`}
            >
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center text-[9px] ${
                wp.completed ? "border-cyber-green/50 text-cyber-green" : "border-gray-600 text-gray-600"
              }`}>
                {wp.completed ? "✓" : i + 1}
              </div>
              <div className="flex-1">
                <span className={wp.completed ? "text-gray-400" : "text-gray-200"}>{wp.name}</span>
              </div>
              <span className="text-gray-600 font-rajdhani">{formatNumber(wp.distance, 2)} ly</span>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
});

export default RouteVisualization;
