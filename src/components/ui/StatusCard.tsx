import { memo, type ReactNode } from "react";

interface StatusCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon?: ReactNode;
  status?: "normal" | "warning" | "critical";
  children?: ReactNode;
  className?: string;
}

const StatusCard = memo(function StatusCard({ title, value, unit, icon, status = "normal", children, className = "" }: StatusCardProps) {
  const statusStyles = {
    critical: {
      border: "border-cyber-red/40",
      glow: "shadow-glow-red",
      iconBg: "bg-cyber-red/10",
      iconColor: "text-cyber-red",
    },
    warning: {
      border: "border-cyber-amber/40",
      glow: "shadow-glow-amber",
      iconBg: "bg-cyber-amber/10",
      iconColor: "text-cyber-amber",
    },
    normal: {
      border: "border-cyber-blue/20",
      glow: "shadow-glow-sm",
      iconBg: "bg-cyber-blue/10",
      iconColor: "text-cyber-blue",
    },
  };

  const styles = statusStyles[status];

  return (
    <div
      className={`bg-space-800/60 backdrop-blur-sm rounded-lg border ${styles.border} ${styles.glow} p-4 transition-all duration-300 hover:border-cyber-blue/40 hover:shadow-glow-md group ${className}`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-gray-400 font-rajdhani uppercase tracking-wider">
          {title}
        </span>
        {icon && (
          <span className={`p-1.5 rounded ${styles.iconBg} ${styles.iconColor} transition-colors group-hover:bg-cyber-blue/20`}>
            {icon}
          </span>
        )}
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="text-2xl font-orbitron font-bold text-white tracking-tight">
          {value}
        </span>
        {unit && (
          <span className="text-xs text-gray-500 font-rajdhani font-medium">
            {unit}
          </span>
        )}
      </div>
      {children && (
        <div className="mt-3 pt-3 border-t border-cyber-blue/10">
          {children}
        </div>
      )}
    </div>
  );
});

export default StatusCard;
