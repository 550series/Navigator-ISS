import { type ReactNode } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

interface SubPage {
  path: string;
  label: string;
  icon?: ReactNode;
}

interface TabLayoutProps {
  title: string;
  icon?: ReactNode;
  subPages: SubPage[];
  basePath: string;
  children?: ReactNode;
}

export default function TabLayout({ title, icon, subPages, basePath, children }: TabLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const currentTab = subPages.find((page) => 
    location.pathname === `${basePath}${page.path}` || 
    (page.path === "" && location.pathname === basePath)
  ) || subPages[0];

  const handleTabClick = (path: string) => {
    navigate(`${basePath}${path}`);
  };

  return (
    <div className="space-y-4">
      {/* 页面标题和二级导航 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon && <span className="text-cyber-blue">{icon}</span>}
          <h2 className="font-orbitron text-lg text-cyber-blue tracking-wider">{title}</h2>
        </div>
        <div className="flex gap-1 bg-space-800/50 p-1 rounded-lg border border-cyber-blue/10">
          {subPages.map((page) => (
            <button
              key={page.path}
              onClick={() => handleTabClick(page.path)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md transition-all duration-200 font-rajdhani font-medium ${
                currentTab.path === page.path
                  ? "bg-cyber-blue/10 text-cyber-blue border border-cyber-blue/30"
                  : "text-gray-400 hover:text-cyber-blue hover:bg-cyber-blue/5 border border-transparent"
              }`}
            >
              {page.icon}
              {page.label}
            </button>
          ))}
        </div>
      </div>

      {/* 内容区域 */}
      {children || <Outlet />}
    </div>
  );
}
