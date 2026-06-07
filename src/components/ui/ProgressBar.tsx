import { memo } from "react";

interface ProgressBarProps {
  value: number;
  max: number;
  label?: string;
  showPercent?: boolean;
  color?: string;
  height?: number;
  variant?: "default" | "glow" | "gradient";
}

const ProgressBar = memo(function ProgressBar({ 
  value, 
  max, 
  label, 
  showPercent = true, 
  color, 
  height = 6,
  variant = "gradient"
}: ProgressBarProps) {
  const percent = Math.min((value / max) * 100, 100);

  const getBarStyle = () => {
    if (color) return { bg: color, glow: "", gradient: "" };

    if (percent < 20) {
      return {
        bg: "bg-cyber-red",
        glow: "shadow-[0_0_8px_rgba(255,59,59,0.4)]",
        gradient: "from-cyber-red to-cyber-red-dim",
      };
    }
    if (percent < 40) {
      return {
        bg: "bg-cyber-amber",
        glow: "shadow-[0_0_8px_rgba(255,140,0,0.4)]",
        gradient: "from-cyber-amber to-cyber-amber-dim",
      };
    }
    return {
      bg: "bg-cyber-blue",
      glow: "shadow-[0_0_8px_rgba(0,212,255,0.4)]",
      gradient: "from-cyber-blue to-cyber-cyan",
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
        className="relative w-full bg-space-700/50 rounded-full overflow-hidden"
        style={{ height }}
      >
        {/* 背景装饰 */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        
        {/* 进度条 */}
        <div
          className={`relative h-full rounded-full transition-all duration-700 ease-out ${
            variant === "gradient" ? `bg-gradient-to-r ${barStyle.gradient}` : barStyle.bg
          } ${variant === "glow" ? barStyle.glow : ""}`}
          style={{ width: `${percent}%` }}
        >
          {/* 发光效果 */}
          {variant === "glow" && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20" />
          )}
        </div>
      </div>
    </div>
  );
});

export default ProgressBar;
