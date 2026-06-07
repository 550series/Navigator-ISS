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
  ShieldAlert,
  FileText,
  Globe,
} from "lucide-react";
import { useState } from "react";
import { useSidebarStore } from "@/stores/sidebarStore";
import EventSimulator from "./EventSimulator";

const navItems = [
  { path: "/", label: "总览", icon: LayoutDashboard, badge: null },
  { path: "/monitor", label: "状态监控", icon: Activity, badge: null },
  { path: "/resources", label: "资源管理", icon: Package, badge: null },
  { path: "/navigation", label: "航线导航", icon: Navigation, badge: null },
  { path: "/communication", label: "通信系统", icon: Radio, badge: null },
  { path: "/missions", label: "任务管理", icon: ClipboardList, badge: null },
  { path: "/crew-system", label: "船员系统", icon: Users, badge: null },
  { path: "/operations", label: "运维中心", icon: ShieldAlert, badge: "!" },
  { path: "/research", label: "科研中心", icon: Globe, badge: null },
  { path: "/logs", label: "操作日志", icon: FileText, badge: null },
  { path: "/settings", label: "系统设置", icon: Settings, badge: null },
];

export default function Sidebar() {
  const { collapsed, toggle } = useSidebarStore();
  const [showEvents, setShowEvents] = useState(false);
  const location = useLocation();

  return (
    <aside
      className={`fixed left-0 top-0 h-full z-40 flex flex-col transition-all duration-300 ease-in-out ${
        collapsed ? "w-16" : "w-52"
      }`}
    >
      {/* 侧边栏背景 */}
      <div className="absolute inset-0 bg-space-900/95 backdrop-blur-md border-r border-cyber-blue/15" />

      {/* 侧边栏内容 */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Logo 区域 */}
        <div className="flex items-center gap-3 px-4 h-14 border-b border-cyber-blue/15">
          <div className="w-8 h-8 rounded-lg border border-cyber-blue/40 flex items-center justify-center text-cyber-blue font-orbitron text-xs font-bold bg-gradient-to-br from-cyber-blue/20 to-transparent shadow-glow-sm">
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
        <nav className="flex-1 py-3 space-y-0.5 px-2 overflow-y-auto scrollbar-thin">
          {navItems.map(({ path, label, icon: Icon, badge }) => {
            const isActive = location.pathname === path || location.pathname.startsWith(path + "/");
            return (
              <NavLink
                key={path}
                to={path}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 group relative ${
                  isActive
                    ? "bg-cyber-blue/10 text-cyber-blue"
                    : "text-gray-400 hover:text-cyber-blue hover:bg-cyber-blue/5"
                }`}
              >
                {/* 活跃指示器 */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-cyber-blue rounded-r-full shadow-glow-sm" />
                )}

                {/* 图标 */}
                <div className={`relative flex-shrink-0 ${isActive ? "text-cyber-blue" : "text-gray-500 group-hover:text-cyber-blue"}`}>
                  <Icon size={18} />
                  {badge && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-cyber-red text-[8px] text-white flex items-center justify-center">
                      {badge}
                    </span>
                  )}
                </div>

                {/* 标签 */}
                {!collapsed && (
                  <span className={`font-rajdhani font-medium ${isActive ? "text-cyber-blue" : "text-gray-400 group-hover:text-gray-200"}`}>
                    {label}
                  </span>
                )}

                {/* 折叠时的工具提示 */}
                {collapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-space-800 border border-cyber-blue/20 rounded text-xs text-gray-200 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                    {label}
                  </div>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* 事件模拟器入口 */}
        <button
          onClick={() => setShowEvents(!showEvents)}
          className={`relative flex items-center gap-3 h-10 border-t border-cyber-blue/15 transition-colors px-3 ${
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
          className="relative flex items-center justify-center h-10 border-t border-cyber-blue/15 text-gray-500 hover:text-cyber-blue hover:bg-cyber-blue/5 transition-colors"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* 事件模拟器面板 */}
      {showEvents && <EventSimulator onClose={() => setShowEvents(false)} />}
    </aside>
  );
}
