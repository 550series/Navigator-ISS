import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Activity,
  Package,
  Navigation,
  Radio,
  ClipboardList,
  Users,
  Settings,
  Atom,
  ChevronLeft,
  ChevronRight,
  Bell,
  Wrench,
  FlaskConical,
  ShieldAlert,
  FileText,
  Globe,
  UserCog,
} from "lucide-react";
import { useState } from "react";
import { useSidebarStore } from "@/stores/sidebarStore";
import EventSimulator from "./EventSimulator";

const navItems = [
  { path: "/", label: "总览", icon: LayoutDashboard },
  { path: "/monitor", label: "状态监控", icon: Activity },
  { path: "/resources", label: "资源管理", icon: Package },
  { path: "/navigation", label: "航线导航", icon: Navigation },
  { path: "/communication", label: "通信系统", icon: Radio },
  { path: "/missions", label: "任务管理", icon: ClipboardList },
  { path: "/crew", label: "船员花名册", icon: Users },
  { path: "/crew-management", label: "船员管理", icon: UserCog },
  { path: "/space-environment", label: "太空环境", icon: Globe },
  { path: "/alerts", label: "告警中心", icon: Bell },
  { path: "/maintenance", label: "维修日志", icon: Wrench },
  { path: "/experiments", label: "实验管理", icon: FlaskConical },
  { path: "/emergency", label: "应急响应", icon: ShieldAlert },
  { path: "/logs", label: "操作日志", icon: FileText },
  { path: "/settings", label: "系统设置", icon: Settings },
];

export default function Sidebar() {
  const { collapsed, toggle } = useSidebarStore();
  const [showEvents, setShowEvents] = useState(false);
  const location = useLocation();

  return (
    <aside
      className={`fixed left-0 top-0 h-full z-40 flex flex-col border-r border-cyber-blue/20 bg-space-900 backdrop-blur-sm transition-all duration-300 ${
        collapsed ? "w-16" : "w-52"
      }`}
    >
      {/* Logo 区域 */}
      <div className="flex items-center gap-2 px-4 h-14 border-b border-cyber-blue/20 bg-gradient-to-r from-space-800/40 to-transparent">
        <div className="w-8 h-8 rounded-lg border border-cyber-blue/40 flex items-center justify-center text-cyber-blue font-orbitron text-xs font-bold bg-cyber-blue/5 shadow-glow-sm">
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
      <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
        {navItems.map(({ path, label, icon: Icon }) => {
          const isActive = location.pathname === path;
          return (
            <NavLink
              key={path}
              to={path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 group relative ${
                isActive
                  ? "bg-cyber-blue/10 text-cyber-blue border border-cyber-blue/30 shadow-glow-sm"
                  : "text-gray-400 hover:text-cyber-blue hover:bg-cyber-blue/5 border border-transparent"
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-cyber-blue rounded-r-full" />
              )}
              <Icon
                size={18}
                className={`flex-shrink-0 transition-colors ${
                  isActive
                    ? "text-cyber-blue"
                    : "text-gray-500 group-hover:text-cyber-blue"
                }`}
              />
              {!collapsed && (
                <span className="font-rajdhani font-medium">{label}</span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* 事件模拟器入口 */}
      <button
        onClick={() => setShowEvents(!showEvents)}
        className={`flex items-center gap-3 h-10 border-t border-cyber-blue/20 transition-colors px-3 ${
          showEvents
            ? "bg-cyber-amber/10 text-cyber-amber"
            : "text-gray-500 hover:text-cyber-amber hover:bg-cyber-amber/5"
        }`}
      >
        <Atom size={16} className="flex-shrink-0" />
        {!collapsed && <span className="text-xs font-rajdhani font-medium">事件模拟器</span>}
      </button>

      {/* 折叠按钮 */}
      <button
        onClick={toggle}
        className="flex items-center justify-center h-10 border-t border-cyber-blue/20 text-gray-500 hover:text-cyber-blue hover:bg-cyber-blue/5 transition-colors"
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      {showEvents && <EventSimulator onClose={() => setShowEvents(false)} />}
    </aside>
  );
}
