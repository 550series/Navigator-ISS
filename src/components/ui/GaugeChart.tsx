import { memo } from "react";

interface GaugeChartProps {
  value: number;
  max: number;
  label: string;
  unit?: string;
  size?: number;
  color?: string;
}

const GaugeChart = memo(function GaugeChart({ value, max, label, unit, size = 120, color = "#00d4ff" }: GaugeChartProps) {
  const percentage = Math.min((value / max) * 100, 100);
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  const displayColor =
    percentage < 20 ? "#ff3b3b" : percentage < 40 ? "#ff8c00" : color;

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(0,212,255,0.1)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={displayColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="gauge-ring"
          style={{ filter: `drop-shadow(0 0 4px ${displayColor}40)` }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center" style={{ width: size, height: size }}>
        <span className="text-lg font-orbitron font-bold text-white">{Math.round(percentage)}</span>
        {unit && <span className="text-[10px] text-gray-500">{unit}</span>}
      </div>
      <span className="mt-1 text-xs text-gray-400 font-rajdhani">{label}</span>
    </div>
  );
});

export default GaugeChart;
