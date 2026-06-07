import { memo } from "react";
import { useSidebarStore } from "@/stores/sidebarStore";
import Panel from "@/components/ui/Panel";
import { Palette, Monitor, ToggleLeft, ToggleRight } from "lucide-react";

const DisplaySettings = memo(function DisplaySettings() {
  const sidebarCollapsed = useSidebarStore((s) => s.collapsed);

  return (
    <div className="grid grid-cols-2 gap-4">
      <Panel title="界面设置" icon={<Palette size={14} />}>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg border border-gray-800 bg-space-900/30">
            <div>
              <div className="text-xs text-gray-300 font-rajdhani font-medium">侧边栏状态</div>
              <div className="text-[10px] text-gray-500 mt-1">{sidebarCollapsed ? "已折叠" : "已展开"}</div>
            </div>
            <div className={`px-2 py-1 rounded text-[10px] font-rajdhani ${
              sidebarCollapsed ? "bg-cyber-amber/10 text-cyber-amber" : "bg-cyber-green/10 text-cyber-green"
            }`}>
              {sidebarCollapsed ? "折叠" : "展开"}
            </div>
          </div>

          <div className="p-3 rounded-lg border border-gray-800 bg-space-900/30">
            <div className="text-xs text-gray-400 font-rajdhani mb-2">主题色彩</div>
            <div className="grid grid-cols-5 gap-2">
              {[
                { name: "冰蓝", color: "#00d4ff" },
                { name: "琥珀", color: "#ff8c00" },
                { name: "翠绿", color: "#00ff88" },
                { name: "玫红", color: "#ff3b3b" },
                { name: "紫罗兰", color: "#a855f7" },
              ].map((theme) => (
                <div key={theme.name} className="text-center">
                  <div
                    className="w-8 h-8 rounded-lg mx-auto mb-1 border border-gray-700"
                    style={{ backgroundColor: theme.color, boxShadow: `0 0 10px ${theme.color}40` }}
                  />
                  <div className="text-[10px] text-gray-500">{theme.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Panel>

      <Panel title="显示选项" icon={<Monitor size={14} />}>
        <div className="space-y-3">
          {[
            { label: "扫描线效果", desc: "全息扫描线叠加", enabled: true },
            { label: "星点背景", desc: "深空星点效果", enabled: true },
            { label: "网格背景", desc: "坐标网格叠加", enabled: true },
            { label: "动画效果", desc: "界面过渡动画", enabled: true },
          ].map((option) => (
            <div key={option.label} className="flex items-center justify-between p-3 rounded-lg border border-gray-800 bg-space-900/30">
              <div>
                <div className="text-xs text-gray-300 font-rajdhani font-medium">{option.label}</div>
                <div className="text-[10px] text-gray-500 mt-1">{option.desc}</div>
              </div>
              <div className={`p-1 ${option.enabled ? "text-cyber-green" : "text-gray-500"}`}>
                {option.enabled ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
});

export default DisplaySettings;
