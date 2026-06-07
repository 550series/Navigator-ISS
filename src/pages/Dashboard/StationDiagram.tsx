import { memo, useState } from "react";
import { useStationStore } from "@/stores/stationStore";
import Panel from "@/components/ui/Panel";
import type { CabinStatus } from "@/data/types";

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

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-500">{label}</span>
      <span className="text-white font-rajdhani">{value}</span>
    </div>
  );
}

const StationDiagram = memo(function StationDiagram() {
  const cabins = useStationStore((s) => s.cabins);
  const [selectedCabin, setSelectedCabin] = useState<CabinStatus | null>(null);

  const getCabin = (key: keyof typeof SVG_CABIN_MAP) => cabins.find((c) => c.id === SVG_CABIN_MAP[key].id);

  return (
    <Panel title="空间站概览（点击舱段查看详情）" className="col-span-2">
      <div className="relative h-64 flex items-center justify-center">
        <svg viewBox="0 0 400 200" className="w-full max-w-lg animate-float">
          <ellipse cx="200" cy="100" rx="120" ry="40" fill="none" stroke="#00d4ff" strokeWidth="1.5" opacity="0.6" />
          <ellipse cx="200" cy="100" rx="120" ry="40" fill="none" stroke="#00d4ff" strokeWidth="0.5" opacity="0.2" strokeDasharray="4 4" />

          <CabinRect x={180} y={80} w={40} h={40} cabin={getCabin("CMD")} onClick={setSelectedCabin} label={SVG_CABIN_MAP.CMD.label} />
          <CabinRect x={60} y={88} w={50} h={24} cabin={getCabin("LIVE_A")} onClick={setSelectedCabin} label={SVG_CABIN_MAP.LIVE_A.label} />
          <CabinRect x={290} y={88} w={50} h={24} cabin={getCabin("LIVE_B")} onClick={setSelectedCabin} label={SVG_CABIN_MAP.LIVE_B.label} />
          <CabinRect x={155} y={140} w={90} h={20} cabin={getCabin("ENGINE")} onClick={setSelectedCabin} label={SVG_CABIN_MAP.ENGINE.label} accent="#ff8c00" />
          <CabinRect x={80} y={130} w={40} h={16} cabin={getCabin("CARGO_A")} onClick={setSelectedCabin} label={SVG_CABIN_MAP.CARGO_A.label} small />
          <CabinRect x={280} y={130} w={40} h={16} cabin={getCabin("CARGO_B")} onClick={setSelectedCabin} label={SVG_CABIN_MAP.CARGO_B.label} small />
          <CabinRect x={120} y={40} w={30} h={14} cabin={getCabin("MED")} onClick={setSelectedCabin} label={SVG_CABIN_MAP.MED.label} small />
          <CabinRect x={250} y={40} w={30} h={14} cabin={getCabin("LAB")} onClick={setSelectedCabin} label={SVG_CABIN_MAP.LAB.label} small />

          <line x1="170" y1="160" x2="170" y2="180" stroke="#ff8c00" strokeWidth="1" opacity="0.5" />
          <line x1="200" y1="160" x2="200" y2="185" stroke="#ff8c00" strokeWidth="1.5" opacity="0.7" />
          <line x1="230" y1="160" x2="230" y2="180" stroke="#ff8c00" strokeWidth="1" opacity="0.5" />
          <ellipse cx="200" cy="190" rx="8" ry="3" fill="#ff8c00" opacity="0.4">
            <animate attributeName="ry" values="3;5;3" dur="1s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.4;0.7;0.4" dur="1s" repeatCount="indefinite" />
          </ellipse>
          <line x1="110" y1="100" x2="180" y2="100" stroke="#00d4ff" strokeWidth="0.5" opacity="0.4" strokeDasharray="3 3" />
          <line x1="220" y1="100" x2="290" y2="100" stroke="#00d4ff" strokeWidth="0.5" opacity="0.4" strokeDasharray="3 3" />
          <line x1="200" y1="120" x2="200" y2="140" stroke="#00d4ff" strokeWidth="0.5" opacity="0.4" strokeDasharray="3 3" />
          <line x1="200" y1="80" x2="200" y2="54" stroke="#00d4ff" strokeWidth="0.5" opacity="0.4" strokeDasharray="3 3" />
          <line x1="135" y1="50" x2="180" y2="82" stroke="#00d4ff" strokeWidth="0.5" opacity="0.3" strokeDasharray="3 3" />
          <line x1="265" y1="50" x2="220" y2="82" stroke="#00d4ff" strokeWidth="0.5" opacity="0.3" strokeDasharray="3 3" />
        </svg>

        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="w-full h-0.5 bg-cyber-blue/50 animate-scan-line" />
        </div>

        {selectedCabin && (
          <div className="absolute top-2 right-2 w-56 bg-space-900/95 border border-cyber-blue/40 rounded shadow-xl p-3 text-xs backdrop-blur-sm z-10">
            <div className="flex items-center justify-between mb-2">
              <span className="font-orbitron text-cyber-blue">{selectedCabin.name}</span>
              <button onClick={() => setSelectedCabin(null)} className="text-gray-500 hover:text-white text-[10px]">✕</button>
            </div>
            <div className="space-y-1.5">
              <DetailRow label="温度" value={`${selectedCabin.temperature.toFixed(1)}°C`} />
              <DetailRow label="压力" value={`${selectedCabin.pressure.toFixed(1)} kPa`} />
              <DetailRow label="辐射" value={`${selectedCabin.radiation.toFixed(2)} mSv/h`} />
              <DetailRow label="完整性" value={`${selectedCabin.integrity.toFixed(1)}%`} />
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
  );
});

export default StationDiagram;
