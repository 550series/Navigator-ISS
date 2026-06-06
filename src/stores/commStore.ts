import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Communication, CommLink } from "@/data/types";
import { initialCommunications, initialCommLinks } from "@/data/mockData";
import { addFluctuation, clamp } from "@/utils/formatters";

interface CommState {
  commLinks: CommLink[];
  communications: Communication[];
  /** 外部注入的信号衰减（0-1），由事件触发，下一 tick 自动衰减 */
  signalPenalty: number;
  updateSimulation: () => void;
  /** 发送一条新消息到记录 */
  sendMessage: (input: { target: string; content: string; type?: Communication["type"] }) => void;
  /** 重置到初始数据 */
  resetAll: () => void;
}

/** 通信系统 Store */
export const useCommStore = create<CommState>()(
  persist(
    (set) => ({
      commLinks: initialCommLinks,
      communications: initialCommunications,
      signalPenalty: 0,

      updateSimulation: () =>
        set((state) => {
          const penalty = state.signalPenalty * 0.7;
          const effectivePenalty = penalty < 0.02 ? 0 : penalty;
          return {
            signalPenalty: effectivePenalty,
            commLinks: state.commLinks.map((link) => {
              const baseStrength = clamp(addFluctuation(link.signalStrength, 3), 20, 100);
              const signalStrength = clamp(
                baseStrength * (1 - effectivePenalty) + (Math.random() - 0.5) * 5,
                20,
                100
              );
              return {
                ...link,
                signalStrength,
                latency: clamp(addFluctuation(link.latency, 0.1) + effectivePenalty * 2, 0.5, 10),
                status: signalStrength > 70 ? "connected" : signalStrength > 50 ? "degraded" : "offline",
              };
            }),
          };
        }),

      sendMessage: ({ target, content, type = "routine" }) =>
        set((state) => {
          const now = new Date();
          const ts = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
          // 根据当前信号状态动态计算信号强度和延迟
          const avgSignal = state.commLinks.reduce((s, l) => s + l.signalStrength, 0) / state.commLinks.length;
          const avgLatency = state.commLinks.reduce((s, l) => s + l.latency, 0) / state.commLinks.length;
          const newMsg: Communication = {
            id: `c-${Date.now()}`,
            source: "领航员空间站",
            target,
            type,
            signalStrength: Math.round(avgSignal),
            latency: Math.round(avgLatency * 100) / 100,
            status: avgSignal > 70 ? "connected" : avgSignal > 50 ? "degraded" : "offline",
            timestamp: ts,
            content,
          };
          return { communications: [newMsg, ...state.communications].slice(0, 100) };
        }),

      resetAll: () => set({
        commLinks: initialCommLinks,
        communications: initialCommunications,
        signalPenalty: 0,
      }),
    }),
    {
      name: "navigator-iss-comm",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
