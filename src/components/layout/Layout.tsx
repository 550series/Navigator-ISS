import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import { useSimulation } from "@/hooks/useSimulation";

/** 主布局组件 */
export default function Layout() {
  useSimulation();

  return (
    <div className="h-screen w-screen flex overflow-hidden scanline-overlay">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-52">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-4 grid-bg stars-bg">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
