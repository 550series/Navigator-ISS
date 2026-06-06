import { useEffect, useRef } from "react";
import { useStationStore } from "@/stores/stationStore";
import { useResourceStore } from "@/stores/resourceStore";
import { useNavigationStore } from "@/stores/navigationStore";
import { useCommStore } from "@/stores/commStore";
import { useMissionStore } from "@/stores/missionStore";

/** 模拟数据定时刷新 Hook */
export function useSimulation(intervalMs: number = 3000) {
  const updateStation = useStationStore((s) => s.updateSimulation);
  const updateResource = useResourceStore((s) => s.updateSimulation);
  const updateNavigation = useNavigationStore((s) => s.updateSimulation);
  const updateComm = useCommStore((s) => s.updateSimulation);
  const updateMission = useMissionStore((s) => s.updateSimulation);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      updateStation();
      updateResource();
      updateNavigation();
      updateComm();
      updateMission();
    }, intervalMs);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [intervalMs, updateStation, updateResource, updateNavigation, updateComm, updateMission]);
}
