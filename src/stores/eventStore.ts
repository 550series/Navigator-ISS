import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { EventType, EventDef, EventContext } from "@/data/events";
import { EVENTS } from "@/data/events";
import { useStationStore } from "@/stores/stationStore";
import { useCommStore } from "@/stores/commStore";
import { useResourceStore } from "@/stores/resourceStore";
import { useNavigationStore } from "@/stores/navigationStore";
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
  /** 是否启用自动触发 */
  autoTriggerEnabled: boolean;
  /** 触发事件，返回是否成功（cooldown 期内返回 false） */
  trigger: (type: EventType) => boolean;
  /** 自动触发检查（由仿真 tick 调用） */
  checkAutoTrigger: () => void;
  /** 切换自动触发 */
  toggleAutoTrigger: () => void;
  /** 清除历史 */
  clearHistory: () => void;
}

/** 构建事件执行上下文 */
function buildContext(): EventContext {
  const { personnel, equipment } = useResourceStore.getState();
  return {
    personnel,
    equipment: equipment.map((e) => ({ id: e.id, name: e.name, status: e.status })),
  };
}

/** 将事件 effect 派发到各 store */
function applyEffect(def: EventDef): boolean {
  const ctx = buildContext();
  const effect = def.effect(ctx);
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
    useStationStore.setState((s) => ({
      cabins: s.cabins.map((c) =>
        effect.cabinDamage!.includes(c.id)
          ? { ...c, integrity: clamp(c.integrity - 15, 0, 100), status: "critical" as const }
          : c
      ),
    }));
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
    useCommStore.setState({ signalPenalty: effect.commPenalty });
  }

  if (effect.personnelHealthChange) {
    const { setPersonnelHealth } = useResourceStore.getState();
    effect.personnelHealthChange.forEach(({ id, health }) => setPersonnelHealth(id, health));
  }

  if (effect.resourceChange) {
    const { resupplyResource } = useResourceStore.getState();
    effect.resourceChange.forEach(({ id, delta }) => resupplyResource(id, delta));
  }

  if (effect.deviationDelta !== undefined) {
    useNavigationStore.setState((s) => ({
      navigation: {
        ...s.navigation,
        deviation: clamp(s.navigation.deviation + effect.deviationDelta!, 0, 0.01),
      },
    }));
  }

  if (effect.equipmentDegrade && effect.equipmentDegrade.length > 0) {
    useResourceStore.setState((s) => ({
      equipment: s.equipment.map((e) =>
        effect.equipmentDegrade!.includes(e.id)
          ? { ...e, status: "degraded" as const }
          : e
      ),
    }));
  }

  return true;
}

/** 事件 Store */
export const useEventStore = create<EventState>()(
  persist(
    (set, get) => ({
      history: [],
      lastTriggeredAt: {},
      autoTriggerEnabled: true,

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

      checkAutoTrigger: () => {
        if (!get().autoTriggerEnabled) return;
        const now = Date.now();
        for (const def of Object.values(EVENTS)) {
          if (!def.autoTrigger) continue;
          if (Math.random() > def.autoProbability) continue;
          const last = get().lastTriggeredAt[def.type] ?? 0;
          if (now - last < def.cooldown) continue;
          // 自动触发
          applyEffect(def);
          set((s) => ({
            history: [
              { type: def.type, name: def.name, severity: def.severity, timestamp: now },
              ...s.history,
            ].slice(0, 30),
            lastTriggeredAt: { ...s.lastTriggeredAt, [def.type]: now },
          }));
          break; // 每个 tick 最多触发一个自动事件
        }
      },

      toggleAutoTrigger: () =>
        set((s) => ({ autoTriggerEnabled: !s.autoTriggerEnabled })),

      clearHistory: () => set({ history: [], lastTriggeredAt: {} }),
    }),
    {
      name: "navigator-iss-events",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ autoTriggerEnabled: state.autoTriggerEnabled }),
    }
  )
);
