import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Activity,
  Package,
  Navigation,
  Radio,
  ClipboardList,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { path: "/", label: "总览", icon: LayoutDashboard },
  { path: "/monitor", label: "状态监控", icon: Activity },
  { path: "/resources", label: "资源管理", icon: Package },
  { path: "/navigation", label: "航线导航", icon: Navigation },
  { path: "/communication", label: "通信系统", icon: Radio },
  { path: "/missions", label: "任务管理", icon: ClipboardList },
];

/** 侧边导航栏组件 */
export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside
      className={`fixed left-0 top-0 h-full z-40 flex flex-col border-r border-cyber-blue/20 bg-space-900/95 backdrop-blur-sm transition-all duration-300 ${
        collapsed ? "w-16" : "w-52"
      }`}
    >
      {/* Logo 区域 */}
      <div className="flex items-center gap-2 px-4 h-14 border-b border-cyber-blue/20">
        <div className="w-8 h-8 rounded border border-cyber-blue/40 flex items-center justify-center text-cyber-blue font-orbitron text-xs font-bold bg-cyber-blue/5">
          N
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <div className="font-orbitron text-xs text-cyber-blue tracking-wider">NAVIGATOR</div>
            <div className="text-[10px] text-gray-500 tracking-widest">ISS CONTROL</div>
          </div>
        )}
      </div>

      {/* 导航项 */}
      <nav className="flex-1 py-4 space-y-1 px-2">
        {navItems.map(({ path, label, icon: Icon }) => {
          const isActive = location.pathname === path;
          return (
            <NavLink
              key={path}
              to={path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-all duration-200 group ${
                isActive
                  ? "bg-cyber-blue/10 text-cyber-blue border border-cyber-blue/30"
                  : "text-gray-400 hover:text-cyber-blue hover:bg-cyber-blue/5 border border-transparent"
              }`}
            >
              <Icon size={18} className={isActive ? "text-cyber-blue" : "text-gray-500 group-hover:text-cyber-blue"} />
              {!collapsed && <span className="font-rajdhani font-medium">{label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* 折叠按钮 */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center h-10 border-t border-cyber-blue/20 text-gray-500 hover:text-cyber-blue transition-colors"
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
    </aside>
  );
}
