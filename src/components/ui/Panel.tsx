import { type ReactNode } from "react";

interface PanelProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
  alert?: boolean;
}

/** 面板组件 - 用于各模块内容区域 */
export default function Panel({ title, icon, children, className = "", alert = false }: PanelProps) {
  return (
    <div
      className={`bg-space-800/40 backdrop-blur-sm rounded border border-cyber-blue/15 overflow-hidden ${
        alert ? "alert-pulse border-cyber-red/30" : ""
      } ${className}`}
    >
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-cyber-blue/10 bg-space-800/60">
        {icon && <span className="text-cyber-blue">{icon}</span>}
        <h3 className="font-orbitron text-xs text-cyber-blue tracking-wider uppercase">{title}</h3>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}
