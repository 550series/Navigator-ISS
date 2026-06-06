interface ProgressBarProps {
  value: number;
  max: number;
  label?: string;
  showPercent?: boolean;
  color?: string;
  height?: number;
}

/** 进度条组件 */
export default function ProgressBar({ value, max, label, showPercent = true, color, height = 6 }: ProgressBarProps) {
  const percent = Math.min((value / max) * 100, 100);
  const barColor =
    color ||
    (percent < 20 ? "bg-cyber-red" : percent < 40 ? "bg-cyber-amber" : "bg-cyber-blue");

  return (
    <div className="w-full">
      {(label || showPercent) && (
        <div className="flex items-center justify-between mb-1">
          {label && <span className="text-xs text-gray-400 font-rajdhani">{label}</span>}
          {showPercent && <span className="text-xs text-gray-500 font-rajdhani">{percent.toFixed(1)}%</span>}
        </div>
      )}
      <div className="w-full bg-space-700 rounded-full overflow-hidden" style={{ height }}>
        <div
          className={`${barColor} rounded-full transition-all duration-700 ease-out`}
          style={{ width: `${percent}%`, height, boxShadow: `0 0 8px ${percent < 20 ? "rgba(255,59,59,0.4)" : percent < 40 ? "rgba(255,140,0,0.4)" : "rgba(0,212,255,0.4)"}` }}
        />
      </div>
    </div>
  );
}
