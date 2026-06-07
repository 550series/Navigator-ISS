import { describe, it, expect, beforeEach } from "vitest";
import { useStationStore } from "../stationStore";

describe("stationStore", () => {
  beforeEach(() => {
    useStationStore.setState({
      tickCount: 0,
      thrustTarget: 0.65,
    });
  });

  it("has initial state", () => {
    const state = useStationStore.getState();
    expect(state.cabins).toBeDefined();
    expect(state.energy).toBeDefined();
    expect(state.lifeSupport).toBeDefined();
    expect(state.propulsion).toBeDefined();
    expect(state.alerts).toBeDefined();
    expect(state.tickCount).toBe(0);
  });

  it("updates simulation", () => {
    const { updateSimulation } = useStationStore.getState();
    updateSimulation();
    const { tickCount } = useStationStore.getState();
    expect(tickCount).toBe(1);
  });

  it("acknowledges alert", () => {
    const { pushAlert, acknowledgeAlert } = useStationStore.getState();
    pushAlert({
      id: "test-alert",
      level: "info",
      source: "test",
      message: "test message",
      timestamp: "2026-01-01 00:00",
      acknowledged: false,
    });
    acknowledgeAlert("test-alert");
    const { alerts } = useStationStore.getState();
    const alert = alerts.find((a) => a.id === "test-alert");
    expect(alert?.acknowledged).toBe(true);
  });

  it("sets thrust target", () => {
    const { setThrustTarget } = useStationStore.getState();
    setThrustTarget(0.8);
    const { thrustTarget } = useStationStore.getState();
    expect(thrustTarget).toBe(0.8);
  });

  it("clamps thrust target to 0-1", () => {
    const { setThrustTarget } = useStationStore.getState();
    setThrustTarget(1.5);
    expect(useStationStore.getState().thrustTarget).toBe(1);
    setThrustTarget(-0.5);
    expect(useStationStore.getState().thrustTarget).toBe(0);
  });

  it("resets all", () => {
    const { updateSimulation, resetAll } = useStationStore.getState();
    updateSimulation();
    updateSimulation();
    resetAll();
    const state = useStationStore.getState();
    expect(state.tickCount).toBe(0);
    expect(state.thrustTarget).toBe(0.65);
  });
});
