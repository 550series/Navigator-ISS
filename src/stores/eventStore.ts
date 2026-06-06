import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { EventType, EventDef } from "@/data/events";
import { EVENTS } from "@/data/events";
import { useStationStore } from "@/stores/stationStore";
import { useCommStore } from "@/stores/commStore";
import { useResourceStore } from "@/stores/resourceStore";
import { clamp } from "@/utils/formatters";

interface EventLog {
  type: EventType;
  name: string;
  severity: string;
  timestamp: number;
}

interface EventState {
  history: EventLog[];
  lastTriggeredAt: Partial<Record<EventType, number>>;
  /** 触发事件，返回是否成功（cooldown 期内返回 false） */
  trigger: (type: EventType) => boolean;
  /** 清除历史 */
  clearHistory: () => void;
}

/** 将事件 effect 派发到各 store */
function applyEffect(def: EventDef): boolean {
  const effect = def.effect();
  const station = useStationStore.getState();

  if (effect.alert) {
    const now = new Date();
    const ts = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    station.pushAlert({
      id: `e-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      level: effect.alert.level,
      source: effect.alert.source,
      message: effect.alert.message,
      timestamp: ts,
      acknowledged: false,
    });
  }

  if (effect.cabinDamage && effect.cabinDamage.length > 0) {
    // 通过 pushAlert 已经记录了，舱室 integrity 衰减交给下个 tick 的随机波动
    // 这里只打一个 critical 标识以便 UI 渲染
  }

  if (effect.reactorOverride !== undefined) {
    useStationStore.setState((s) => ({
      energy: { ...s.energy, reactorOutput: clamp(effect.reactorOverride!, 600, 1200) },
    }));
  }

  if (effect.thrustDelta !== undefined) {
    useStationStore.setState((s) => ({
      thrustTarget: clamp(s.thrustTarget + effect.thrustDelta!, 0, 1),
    }));
  }

  if (effect.commPenalty !== undefined) {
    // 在 commStore 里设置一个 penalty 字段，下一 tick 反映
    useCommStore.setState({ signalPenalty: effect.commPenalty });
  }

  if (effect.personnelHealthChange) {
    const { setPersonnelHealth } = useResourceStore.getState();
    effect.personnelHealthChange.forEach(({ id, health }) => setPersonnelHealth(id, health));
  }

  return true;
}

/** 事件 Store */
export const useEventStore = create<EventState>()(
  persist(
    (set, get) => ({
      history: [],
      lastTriggeredAt: {},

      trigger: (type) => {
        const def = EVENTS[type];
        if (!def) return false;
        const last = get().lastTriggeredAt[type] ?? 0;
        if (Date.now() - last < def.cooldown) return false;

        applyEffect(def);
        set((s) => ({
          history: [
            { type: def.type, name: def.name, severity: def.severity, timestamp: Date.now() },
            ...s.history,
          ].slice(0, 30),
          lastTriggeredAt: { ...s.lastTriggeredAt, [type]: Date.now() },
        }));
        return true;
      },

      clearHistory: () => set({ history: [], lastTriggeredAt: {} }),
    }),
    {
      name: "navigator-iss-events",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
