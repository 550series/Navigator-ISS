import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import { useSimulation } from "@/hooks/useSimulation";
import { useSidebarStore } from "@/stores/sidebarStore";
import NotificationContainer from "@/components/ui/NotificationContainer";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import ErrorBoundary from "@/components/ui/ErrorBoundary";

export default function Layout() {
  useSimulation();
  const collapsed = useSidebarStore((s) => s.collapsed);

  return (
    <ErrorBoundary>
      <div className="h-screen w-screen flex overflow-hidden bg-space-950">
        {/* 背景装饰层 */}
        <div className="fixed inset-0 pointer-events-none z-0">
          {/* 网格背景 */}
          <div className="absolute inset-0 grid-bg opacity-50" />
          {/* 星点背景 */}
          <div className="absolute inset-0 stars-bg" />
          {/* 扫描线效果 */}
          <div className="absolute inset-0 scanline-overlay" />
          {/* 径向渐变 */}
          <div className="absolute inset-0 bg-radial-glow opacity-30" />
        </div>

        {/* 侧边栏 */}
        <Sidebar />

        {/* 主内容区 */}
        <div
          className={`flex-1 flex flex-col relative z-10 transition-all duration-300 ease-in-out ${
            collapsed ? "ml-16" : "ml-52"
          }`}
        >
          {/* 顶部状态栏 */}
          <TopBar />

          {/* 页面内容 */}
          <main className="flex-1 overflow-y-auto overflow-x-hidden">
            <div className="p-4 min-h-full">
              <ErrorBoundary>
                <div className="animate-fade-in">
                  <Outlet />
                </div>
              </ErrorBoundary>
            </div>
          </main>

          {/* 底部状态栏 */}
          <footer className="h-6 border-t border-cyber-blue/10 bg-space-900/60 backdrop-blur-sm flex items-center justify-between px-4 text-[10px] font-rajdhani">
            <div className="flex items-center gap-4">
              <span className="text-gray-600">NAVIGATOR ISS v3.0.0</span>
              <span className="text-gray-700">|</span>
              <span className="text-gray-600">仿真引擎运行中</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-600">数据延迟: 3ms</span>
              <span className="text-gray-700">|</span>
              <span className="text-cyber-green/60">系统正常</span>
            </div>
          </footer>
        </div>

        {/* 全局组件 */}
        <NotificationContainer />
        <ConfirmDialog />
      </div>
    </ErrorBoundary>
  );
}
