import { memo } from "react";
import Panel from "@/components/ui/Panel";
import { Info, Settings } from "lucide-react";

const AboutSettings = memo(function AboutSettings() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Panel title="系统信息" icon={<Info size={14} />}>
        <div className="space-y-3">
          <div className="p-3 rounded-lg border border-gray-800 bg-space-900/30">
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">系统名称</span>
                <span className="text-white font-rajdhani">领航员空间站管理系统</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">系统版本</span>
                <span className="text-cyber-blue font-orbitron font-bold">v3.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">仿真引擎</span>
                <span className="text-white font-rajdhani">Navigator-ISS Sim Core</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">数据来源</span>
                <span className="text-white font-rajdhani">前端模拟（无后端）</span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-lg border border-gray-800 bg-space-900/30">
            <div className="text-xs text-gray-400 font-rajdhani mb-2">功能模块</div>
            <div className="grid grid-cols-2 gap-1 text-[10px]">
              {["状态监控", "资源管理", "航线导航", "通信系统", "任务管理", "船员系统", "运维中心", "科研中心"].map((module) => (
                <div key={module} className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyber-green" />
                  <span className="text-gray-400">{module}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Panel>

      <Panel title="技术栈" icon={<Settings size={14} />}>
        <div className="space-y-3">
          <div className="p-3 rounded-lg border border-gray-800 bg-space-900/30">
            <div className="text-xs text-gray-400 font-rajdhani mb-2">核心技术</div>
            <div className="space-y-2">
              {[
                { name: "React", version: "18.3", desc: "UI 框架" },
                { name: "TypeScript", version: "5.8", desc: "类型系统" },
                { name: "Zustand", version: "5.0", desc: "状态管理" },
                { name: "Vite", version: "6.3", desc: "构建工具" },
                { name: "Tailwind", version: "3.4", desc: "样式框架" },
                { name: "Recharts", version: "2.15", desc: "图表库" },
              ].map((tech) => (
                <div key={tech.name} className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-white font-rajdhani">{tech.name}</span>
                    <span className="text-[10px] text-gray-500 ml-2">{tech.desc}</span>
                  </div>
                  <span className="text-[10px] text-cyber-blue font-rajdhani">v{tech.version}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-lg border border-cyber-blue/20 bg-cyber-blue/5">
            <div className="text-xs text-cyber-blue font-rajdhani mb-1">关于项目</div>
            <div className="text-[10px] text-gray-400">
              《流浪地球》领航员空间站模拟管理界面，提供空间站日常运营核心功能的可视化交互体验。
            </div>
          </div>
        </div>
      </Panel>
    </div>
  );
});

export default AboutSettings;
