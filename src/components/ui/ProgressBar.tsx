import { memo } from "react";

interface ProgressBarProps {
  value: number;
  max: number;
  label?: string;
  showPercent?: boolean;
  color?: string;
  height?: number;
}

const ProgressBar = memo(function ProgressBar({ value, max, label, showPercent = true, color, height = 6 }: ProgressBarProps) {
  const percent = Math.min((value / max) * 100, 100);

  const getBarStyle = () => {
    if (color) return { bg: color, glow: "" };

    if (percent < 20) {
      return {
        bg: "bg-gradient-to-r from-cyber-red to-cyber-red-dim",
        glow: "shadow-[0_0_8px_rgba(255,59,59,0.4)]",
      };
    }
    if (percent < 40) {
      return {
        bg: "bg-gradient-to-r from-cyber-amber to-cyber-amber-dim",
        glow: "shadow-[0_0_8px_rgba(255,140,0,0.4)]",
      };
    }
    return {
      bg: "bg-gradient-to-r from-cyber-blue to-cyber-cyan",
      glow: "shadow-[0_0_8px_rgba(0,212,255,0.4)]",
    };
  };

  const barStyle = getBarStyle();

  return (
    <div className="w-full">
      {(label || showPercent) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && (
            <span className="text-[11px] text-gray-400 font-rajdhani">{label}</span>
          )}
          {showPercent && (
            <span className="text-[11px] text-gray-500 font-rajdhani font-medium">
              {percent.toFixed(1)}%
            </span>
          )}
        </div>
      )}
      <div
        className="w-full bg-space-700/50 rounded-full overflow-hidden"
        style={{ height }}
      >
        <div
          className={`${barStyle.bg} ${barStyle.glow} rounded-full transition-all duration-700 ease-out`}
          style={{ width: `${percent}%`, height }}
        />
      </div>
    </div>
  );
});

export default ProgressBar;
