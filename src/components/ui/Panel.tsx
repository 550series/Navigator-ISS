import { memo, type ReactNode } from "react";

interface PanelProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
  alert?: boolean;
  action?: ReactNode;
  variant?: "default" | "highlight" | "ghost";
}

const Panel = memo(function Panel({ 
  title, 
  icon, 
  children, 
  className = "", 
  alert = false, 
  action,
  variant = "default" 
}: PanelProps) {
  const variantStyles = {
    default: "bg-space-800/40 border-cyber-blue/15 hover:border-cyber-blue/25",
    highlight: "bg-space-800/60 border-cyber-blue/30 shadow-glow-sm",
    ghost: "bg-transparent border-cyber-blue/10 hover:border-cyber-blue/20",
  };

  return (
    <div
      className={`backdrop-blur-sm rounded-xl border overflow-hidden transition-all duration-300 ${
        alert
          ? "border-cyber-red/30 shadow-glow-red alert-pulse"
          : variantStyles[variant]
      } ${className}`}
    >
      {/* 面板头部 */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-cyber-blue/10 bg-gradient-to-r from-space-800/60 via-space-800/40 to-transparent">
        {/* 装饰线 */}
        <div className="w-0.5 h-4 bg-cyber-blue rounded-full" />
        
        {icon && (
          <span className="text-cyber-blue flex-shrink-0">
            {icon}
          </span>
        )}
        
        <h3 className="font-orbitron text-xs text-cyber-blue tracking-wider uppercase flex-1">
          {title}
        </h3>
        
        {action && <div className="flex-shrink-0">{action}</div>}
        
        {/* 右侧装饰 */}
        <div className="flex gap-0.5">
          <div className="w-1 h-1 rounded-full bg-cyber-blue/30" />
          <div className="w-1 h-1 rounded-full bg-cyber-blue/20" />
          <div className="w-1 h-1 rounded-full bg-cyber-blue/10" />
        </div>
      </div>
      
      {/* 面板内容 */}
      <div className="p-4">{children}</div>
    </div>
  );
});

export default Panel;
