import { memo, type ReactNode } from "react";

interface StatusCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon?: ReactNode;
  status?: "normal" | "warning" | "critical";
  children?: ReactNode;
  className?: string;
  trend?: "up" | "down" | "stable";
}

const StatusCard = memo(function StatusCard({ 
  title, 
  value, 
  unit, 
  icon, 
  status = "normal", 
  children, 
  className = "",
  trend 
}: StatusCardProps) {
  const statusStyles = {
    critical: {
      border: "border-cyber-red/30",
      glow: "shadow-glow-red",
      iconBg: "bg-cyber-red/10",
      iconColor: "text-cyber-red",
      accent: "bg-cyber-red",
    },
    warning: {
      border: "border-cyber-amber/30",
      glow: "shadow-glow-amber",
      iconBg: "bg-cyber-amber/10",
      iconColor: "text-cyber-amber",
      accent: "bg-cyber-amber",
    },
    normal: {
      border: "border-cyber-blue/20",
      glow: "shadow-glow-sm",
      iconBg: "bg-cyber-blue/10",
      iconColor: "text-cyber-blue",
      accent: "bg-cyber-blue",
    },
  };

  const trendStyles = {
    up: "text-cyber-green",
    down: "text-cyber-red",
    stable: "text-gray-500",
  };

  const styles = statusStyles[status];

  return (
    <div
      className={`relative bg-space-800/50 backdrop-blur-sm rounded-xl border ${styles.border} ${styles.glow} p-4 transition-all duration-300 hover:border-cyber-blue/30 hover:shadow-glow-md group overflow-hidden ${className}`}
    >
      {/* 顶部装饰线 */}
      <div className={`absolute top-0 left-0 right-0 h-0.5 ${styles.accent} opacity-50`} />
      
      {/* 背景装饰 */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-cyber-blue/5 to-transparent rounded-bl-full" />
      
      {/* 头部 */}
      <div className="relative flex items-center justify-between mb-3">
        <span className="text-xs text-gray-400 font-rajdhani uppercase tracking-wider">
          {title}
        </span>
        {icon && (
          <span className={`p-1.5 rounded-lg ${styles.iconBg} ${styles.iconColor} transition-all duration-300 group-hover:scale-110`}>
            {icon}
          </span>
        )}
      </div>
      
      {/* 数值 */}
      <div className="relative flex items-baseline gap-1.5">
        <span className="text-2xl font-orbitron font-bold text-white tracking-tight">
          {value}
        </span>
        {unit && (
          <span className="text-xs text-gray-500 font-rajdhani font-medium">
            {unit}
          </span>
        )}
        {trend && (
          <span className={`ml-auto text-xs ${trendStyles[trend]}`}>
            {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"}
          </span>
        )}
      </div>
      
      {/* 子内容 */}
      {children && (
        <div className="relative mt-3 pt-3 border-t border-cyber-blue/10">
          {children}
        </div>
      )}
    </div>
  );
});

export default StatusCard;
