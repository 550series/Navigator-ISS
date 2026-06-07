import { memo } from "react";
import { useEventStore } from "@/stores/eventStore";
import Panel from "@/components/ui/Panel";
import { AlertTriangle, ToggleLeft, ToggleRight, RefreshCw, RotateCcw } from "lucide-react";

const EventSettings = memo(function EventSettings() {
  const eventAutoTrigger = useEventStore((s) => s.autoTriggerEnabled);
  const toggleAutoTrigger = useEventStore((s) => s.toggleAutoTrigger);
  const clearEventHistory = useEventStore((s) => s.clearHistory);

  return (
    <div className="grid grid-cols-2 gap-4">
      <Panel title="事件触发设置" icon={<AlertTriangle size={14} />}>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg border border-gray-800 bg-space-900/30">
            <div>
              <div className="text-xs text-gray-300 font-rajdhani font-medium">自动事件触发</div>
              <div className="text-[10px] text-gray-500 mt-1">仿真运行时随机触发太空事件</div>
            </div>
            <button
              onClick={toggleAutoTrigger}
              className={`p-1 rounded transition-colors ${
                eventAutoTrigger ? "text-cyber-green" : "text-gray-500"
              }`}
            >
              {eventAutoTrigger ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
            </button>
          </div>

          <div className="p-3 rounded-lg border border-gray-800 bg-space-900/30">
            <div className="text-xs text-gray-400 font-rajdhani mb-2">事件类型说明</div>
            <div className="space-y-2 text-[10px]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyber-green" />
                <span className="text-gray-500">信息事件</span>
                <span className="text-gray-400">- 补给到达、演练等</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyber-amber" />
                <span className="text-gray-500">警告事件</span>
                <span className="text-gray-400">- 太阳耀斑、设备故障等</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyber-red" />
                <span className="text-gray-500">严重事件</span>
                <span className="text-gray-400">- 微陨石撞击、反应堆过载等</span>
              </div>
            </div>
          </div>
        </div>
      </Panel>

      <Panel title="事件历史" icon={<RefreshCw size={14} />}>
        <div className="space-y-3">
          <div className="text-[10px] text-gray-500">
            事件系统会根据当前系统状态自动触发各种太空事件，影响空间站的运行。
          </div>
          <div className="p-3 rounded-lg border border-gray-800 bg-space-900/30">
            <div className="text-xs text-gray-400 font-rajdhani mb-2">事件影响范围</div>
            <div className="space-y-1 text-[10px] text-gray-500">
              <div>• 能源系统 - 反应堆输出、储能</div>
              <div>• 生命维持 - 氧气、空气质量</div>
              <div>• 推进系统 - 推力、燃料消耗</div>
              <div>• 通信系统 - 信号强度、延迟</div>
              <div>• 舱室状态 - 完整性、环境参数</div>
              <div>• 船员健康 - 受伤、心理状态</div>
            </div>
          </div>
          <button
            onClick={clearEventHistory}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs rounded border border-gray-700 text-gray-400 hover:border-cyber-amber/40 hover:text-cyber-amber transition-colors font-rajdhani"
          >
            <RotateCcw size={12} /> 清除事件历史
          </button>
        </div>
      </Panel>
    </div>
  );
});

export default EventSettings;
