import { describe, it, expect, beforeEach } from "vitest";
import { useSimulationStore } from "../simulationStore";

describe("simulationStore", () => {
  beforeEach(() => {
    useSimulationStore.setState({
      running: true,
      speed: 1,
      tickCount: 0,
      elapsedDays: 0,
    });
  });

  it("has initial state", () => {
    const state = useSimulationStore.getState();
    expect(state.running).toBe(true);
    expect(state.speed).toBe(1);
    expect(state.tickCount).toBe(0);
    expect(state.elapsedDays).toBe(0);
  });

  it("toggles running state", () => {
    const { toggle } = useSimulationStore.getState();
    toggle();
    expect(useSimulationStore.getState().running).toBe(false);
    toggle();
    expect(useSimulationStore.getState().running).toBe(true);
  });

  it("sets speed", () => {
    const { setSpeed } = useSimulationStore.getState();
    setSpeed(2);
    expect(useSimulationStore.getState().speed).toBe(2);
    setSpeed(5);
    expect(useSimulationStore.getState().speed).toBe(5);
  });

  it("increments tick count", () => {
    const { tick } = useSimulationStore.getState();
    tick();
    expect(useSimulationStore.getState().tickCount).toBe(1);
    tick();
    expect(useSimulationStore.getState().tickCount).toBe(2);
  });

  it("calculates elapsed days from ticks", () => {
    const { tick } = useSimulationStore.getState();
    for (let i = 0; i < 100; i++) {
      tick();
    }
    const { elapsedDays } = useSimulationStore.getState();
    expect(elapsedDays).toBeGreaterThan(0);
  });

  it("resets tick", () => {
    const { tick, resetTick } = useSimulationStore.getState();
    tick();
    tick();
    tick();
    resetTick();
    const state = useSimulationStore.getState();
    expect(state.tickCount).toBe(0);
    expect(state.elapsedDays).toBe(0);
  });
});
