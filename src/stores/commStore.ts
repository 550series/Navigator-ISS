import { create } from "zustand";
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
}

/** 通信系统 Store */
export const useCommStore = create<CommState>((set) => ({
  commLinks: initialCommLinks,
  communications: initialCommunications,
  signalPenalty: 0,

  updateSimulation: () =>
    set((state) => {
      // penalty 每 tick 自动减半，最多 10 个 tick 后完全失效
      const penalty = state.signalPenalty * 0.7;
      const effectivePenalty = penalty < 0.02 ? 0 : penalty;
      return {
        signalPenalty: effectivePenalty,
        commLinks: state.commLinks.map((link) => {
          const baseStrength = clamp(addFluctuation(link.signalStrength, 3), 20, 100);
          // 受 penalty 影响时进一步降低
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
      const newMsg: Communication = {
        id: `c-${Date.now()}`,
        source: "领航员空间站",
        target,
        type,
        signalStrength: 88,
        latency: 4.22,
        status: "connected",
        timestamp: ts,
        content,
      };
      return { communications: [newMsg, ...state.communications] };
    }),
}));
