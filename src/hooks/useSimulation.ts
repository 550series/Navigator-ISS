import { useEffect, useRef } from "react";
import { useStationStore } from "@/stores/stationStore";
import { useResourceStore } from "@/stores/resourceStore";
import { useNavigationStore } from "@/stores/navigationStore";
import { useCommStore } from "@/stores/commStore";
import { useMissionStore } from "@/stores/missionStore";
import { useSimulationStore } from "@/stores/simulationStore";
import { useEventStore } from "@/stores/eventStore";

/** 模拟数据定时刷新 Hook，支持暂停和速度调节 */
export function useSimulation() {
  const running = useSimulationStore((s) => s.running);
  const speed = useSimulationStore((s) => s.speed);
  const tick = useSimulationStore((s) => s.tick);

  const updateStation = useStationStore((s) => s.updateSimulation);
  const updateResource = useResourceStore((s) => s.updateSimulation);
  const updateNavigation = useNavigationStore((s) => s.updateSimulation);
  const updateComm = useCommStore((s) => s.updateSimulation);
  const updateMission = useMissionStore((s) => s.updateSimulation);
  const checkAutoTrigger = useEventStore((s) => s.checkAutoTrigger);

  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    if (!running) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    const intervalMs = 3000 / speed;
    intervalRef.current = setInterval(() => {
      tick();
      updateStation();
      updateResource();
      updateNavigation();
      updateComm();
      updateMission();
      checkAutoTrigger();
    }, intervalMs);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, speed, tick, updateStation, updateResource, updateNavigation, updateComm, updateMission, checkAutoTrigger]);
}
