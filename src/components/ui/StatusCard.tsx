import { type ReactNode } from "react";

interface StatusCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon?: ReactNode;
  status?: "normal" | "warning" | "critical";
  children?: ReactNode;
  className?: string;
}

/** 状态卡片组件 - 用于展示关键指标 */
export default function StatusCard({ title, value, unit, icon, status = "normal", children, className = "" }: StatusCardProps) {
  const borderColor =
    status === "critical"
      ? "border-cyber-red/40"
      : status === "warning"
      ? "border-cyber-amber/40"
      : "border-cyber-blue/20";

  const glowColor =
    status === "critical"
      ? "shadow-[0_0_12px_rgba(255,59,59,0.15)]"
      : status === "warning"
      ? "shadow-[0_0_12px_rgba(255,140,0,0.15)]"
      : "shadow-[0_0_8px_rgba(0,212,255,0.08)]";

  return (
    <div
      className={`bg-space-800/60 backdrop-blur-sm rounded border ${borderColor} ${glowColor} p-4 transition-all duration-300 hover:border-cyber-blue/40 ${className}`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-gray-400 font-rajdhani uppercase tracking-wider">{title}</span>
        {icon && <span className="text-gray-500">{icon}</span>}
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-orbitron font-bold text-white">{value}</span>
        {unit && <span className="text-xs text-gray-500 font-rajdhani">{unit}</span>}
      </div>
      {children}
    </div>
  );
}
