import { type ReactNode } from "react";

interface PanelProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
  alert?: boolean;
  action?: ReactNode;
}

export default function Panel({ title, icon, children, className = "", alert = false, action }: PanelProps) {
  return (
    <div
      className={`bg-space-800/40 backdrop-blur-sm rounded-lg border overflow-hidden transition-all duration-300 ${
        alert
          ? "border-cyber-red/30 shadow-glow-red alert-pulse"
          : "border-cyber-blue/15 hover:border-cyber-blue/25 hover:shadow-glow-sm"
      } ${className}`}
    >
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-cyber-blue/10 bg-gradient-to-r from-space-800/60 to-space-800/30">
        {icon && (
          <span className="text-cyber-blue flex-shrink-0">
            {icon}
          </span>
        )}
        <h3 className="font-orbitron text-xs text-cyber-blue tracking-wider uppercase flex-1">
          {title}
        </h3>
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}
