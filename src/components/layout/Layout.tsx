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
      <div className="h-screen w-screen flex overflow-hidden scanline-overlay">
        <Sidebar />
        <div className={`flex-1 flex flex-col transition-all duration-300 ${collapsed ? "ml-16" : "ml-52"}`}>
          <TopBar />
          <main className="flex-1 overflow-y-auto p-4 grid-bg stars-bg">
            <ErrorBoundary>
              <Outlet />
            </ErrorBoundary>
          </main>
        </div>
        <NotificationContainer />
        <ConfirmDialog />
      </div>
    </ErrorBoundary>
  );
}
