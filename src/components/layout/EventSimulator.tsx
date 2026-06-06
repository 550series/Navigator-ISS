import { useState } from "react";
import { useEventStore } from "@/stores/eventStore";
import { EVENT_LIST, EVENTS } from "@/data/events";
import { Zap, AlertTriangle, Radio, ShieldAlert, Atom, Clock, X } from "lucide-react";
import type { EventType } from "@/data/events";

const eventIcons: Record<EventType, typeof Zap> = {
  solar_flare: Zap,
  micrometeorite: AlertTriangle,
  comm_jam: Radio,
  drill: ShieldAlert,
  reactor_overload: Atom,
};

const severityColors: Record<string, string> = {
  info: "border-cyber-blue/40 bg-cyber-blue/5 text-cyber-blue",
  warning: "border-cyber-amber/40 bg-cyber-amber/5 text-cyber-amber",
  critical: "border-cyber-red/40 bg-cyber-red/5 text-cyber-red",
};

const severityLabels: Record<string, string> = {
  info: "信息",
  warning: "警告",
  critical: "紧急",
};

/** 事件模拟器弹层组件 */
export default function EventSimulator({ onClose }: { onClose: () => void }) {
  const trigger = useEventStore((s) => s.trigger);
  const lastTriggeredAt = useEventStore((s) => s.lastTriggeredAt);
  const history = useEventStore((s) => s.history);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleTrigger = (type: EventType) => {
    const ok = trigger(type);
    if (ok) {
      setFeedback(`✓ 事件已触发：${EVENTS[type].name}`);
    } else {
      setFeedback(`✗ 冷却中，请稍后再试`);
    }
    setTimeout(() => setFeedback(null), 2000);
  };

  return (
    <div className="fixed left-52 top-0 h-full w-80 bg-space-900/98 backdrop-blur-md border-r border-cyber-blue/30 shadow-2xl shadow-black z-50 flex flex-col">
      {/* 头部 */}
      <div className="h-12 border-b border-cyber-blue/20 flex items-center justify-between px-4 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Atom size={14} className="text-cyber-amber" />
          <span className="font-orbitron text-xs text-cyber-blue tracking-wider">事件模拟器</span>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-white">
          <X size={14} />
        </button>
      </div>

      {/* 事件列表 */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        <div className="text-[10px] text-gray-500 font-rajdhani">手动注入应急事件</div>
        {EVENT_LIST.map((ev) => {
          const Icon = eventIcons[ev.type];
          const last = lastTriggeredAt[ev.type] ?? 0;
          const remaining = Math.max(0, ev.cooldown - (Date.now() - last));
          const cooling = remaining > 0;
          const remainingSec = Math.ceil(remaining / 1000);
          return (
            <div
              key={ev.type}
              className={`rounded border p-3 ${severityColors[ev.severity]} ${cooling ? "opacity-60" : ""}`}
            >
              <div className="flex items-start gap-2 mb-1.5">
                <Icon size={14} className="mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-rajdhani font-medium">{ev.name}</div>
                  <div className="text-[10px] text-gray-500 mt-0.5 leading-relaxed">{ev.description}</div>
                </div>
                <span className="text-[9px] px-1 py-0.5 border border-current rounded opacity-80 flex-shrink-0">
                  {severityLabels[ev.severity]}
                </span>
              </div>
              <button
                onClick={() => handleTrigger(ev.type)}
                disabled={cooling}
                className={`w-full mt-1.5 px-2 py-1 text-[10px] font-rajdhani rounded border transition-colors ${
                  cooling
                    ? "border-gray-700 text-gray-600 cursor-not-allowed"
                    : "border-current hover:bg-white/5"
                }`}
              >
                {cooling ? (
                  <span className="flex items-center justify-center gap-1">
                    <Clock size={9} />冷却 {remainingSec}s
                  </span>
                ) : (
                  "▶ 触发事件"
                )}
              </button>
            </div>
          );
        })}

        {/* 反馈提示 */}
        {feedback && (
          <div className="rounded border border-cyber-blue/40 bg-cyber-blue/10 text-cyber-blue text-xs px-3 py-2 text-center font-rajdhani">
            {feedback}
          </div>
        )}

        {/* 事件历史 */}
        {history.length > 0 && (
          <div className="pt-3 border-t border-gray-800/50">
            <div className="text-[10px] text-gray-500 font-rajdhani mb-2">最近触发</div>
            <div className="space-y-1.5">
              {history.slice(0, 5).map((h, i) => (
                <div key={i} className="text-[10px] text-gray-400 flex items-center justify-between">
                  <span className={`flex-shrink-0 w-1.5 h-1.5 rounded-full ${
                    h.severity === "critical" ? "bg-cyber-red" :
                    h.severity === "warning" ? "bg-cyber-amber" : "bg-cyber-blue"
                  }`} />
                  <span className="flex-1 mx-2 truncate">{h.name}</span>
                  <span className="text-gray-600 font-rajdhani">
                    {new Date(h.timestamp).toLocaleTimeString("zh-CN", { hour12: false })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
